import { Resend } from 'resend';
import { getEmailTemplate } from '@/app/utils/email-templates';

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
    const { to, subject, message, templateId = 'custom' } = body;

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

    // Generate the HTML content using the template selector
    const templateData = { subject, message };
    const htmlContent = getEmailTemplate(templateId, templateData);

    // Send the email
    await resend.emails.send({
      from: 'support@kitions.com',
      to: to,
      subject: subject,
      html: htmlContent,
    });

    console.log('Email sent successfully using template:', templateId);
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