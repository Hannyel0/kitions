import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Helper function to format service type string
const formatServiceType = (serviceType: string): string => {
  switch (serviceType) {
    case 'webDevelopment':
      return 'Web Development';
    case 'other':
      return 'Other';
    default:
      return serviceType; // Return as is if unknown
  }
};

export async function POST(req: Request) {
  const body = await req.json();
  const {
    firstName,
    lastName,
    email,
    phone,
    serviceType,
    message,
  } = body;

  const formattedService = formatServiceType(serviceType);

  try {
    await resend.emails.send({
      from: 'support@kitions.com', // Verified Resend sending domain
      to: 'hannyeljimenez@gmail.com',   // Where you want to receive the emails
      subject: '🚀 New Lead from Kitions Contact Form!!',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Lead from Kitions Contact Form</title>
          <style>
            body { margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9f9f9; }
            .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #eee; }
            .header { background-color: #8982cf; color: #ffffff; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
            .content { padding: 30px; color: #333333; line-height: 1.6; }
            .content h2 { color: #8982cf; margin-top: 0; margin-bottom: 20px; font-size: 22px; }
            .field { margin-bottom: 15px; }
            .field strong { color: #555; min-width: 120px; display: inline-block; }
            .message-box { background-color: #f2f0ff; border-left: 4px solid #8982cf; padding: 15px; margin-top: 10px; border-radius: 4px; white-space: pre-wrap; word-wrap: break-word; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #999999; background-color: #f1f1f1; border-top: 1px solid #eee; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚀 New Lead!</h1>
            </div>
            <div class="content">
              <h2>New Lead from Kitions Contact Form!!</h2>
              <div class="field">
                <strong>Name:</strong> ${firstName} ${lastName}
              </div>
              <div class="field">
                <strong>Email:</strong> <a href="mailto:${email}" style="color: #8982cf; text-decoration: none;">${email}</a>
              </div>
              <div class="field">
                <strong>Phone:</strong> ${phone || 'N/A'}
              </div>
              <div class="field">
                <strong>Service Needed:</strong> ${formattedService}
              </div>
              <div class="field">
                <strong>Message:</strong>
                <div class="message-box">
                  ${message?.replace(/\n/g, '<br/>') || 'N/A'}
                </div>
              </div>
            </div>
            <div class="footer">
              Received via Kitions Website Contact Form
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Resend Error:', error);
    // It might be helpful to return the specific error message in development
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ success: false, error: errorMessage }), { status: 500 });
  }
} 