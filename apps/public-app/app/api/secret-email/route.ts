import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    // Get the secret key from the request headers
    const authHeader = req.headers.get('Authorization');
    const secretKey = authHeader ? authHeader.replace('Bearer ', '') : '';
    
    console.log('Secret key provided for email sending:', secretKey);
    console.log('ENV variable exists:', !!process.env.MY_SECRET_EMAIL_KEY);
    
    // Check if the environment variable is set
    if (!process.env.MY_SECRET_EMAIL_KEY) {
      console.error('MY_SECRET_EMAIL_KEY environment variable is not set');
      // Temporary fallback for testing - REMOVE IN PRODUCTION
      if (secretKey !== 'correr83') {
        return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    } else {
      // Check if the secret key is valid
      if (secretKey !== process.env.MY_SECRET_EMAIL_KEY) {
        console.log('Keys do not match for email sending');
        return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // Parse the request body
    const body = await req.json();
    const { to, subject, message } = body;

    // Validate inputs
    if (!to || !subject || !message) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Missing required fields: to, subject, and message are all required'
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Send the email
    await resend.emails.send({
      from: 'support@kitions.com',
      to: to,
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
          <style>
            body { margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9f9f9; }
            .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #eee; }
            .header { background-color: #8982cf; color: #ffffff; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
            .content { padding: 30px; color: #333333; line-height: 1.6; }
            .message-box { background-color: #f2f0ff; border-left: 4px solid #8982cf; padding: 15px; margin-top: 10px; border-radius: 4px; white-space: pre-wrap; word-wrap: break-word; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #999999; background-color: #f1f1f1; border-top: 1px solid #eee; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Kitions</h1>
            </div>
            <div class="content">
              <div class="message-box">
                ${message.replace(/\n/g, '<br/>')}
              </div>
            </div>
            <div class="footer">
              Sent from Kitions
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log('Email sent successfully');
    return new Response(JSON.stringify({ success: true }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error sending email:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ success: false, error: errorMessage }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 