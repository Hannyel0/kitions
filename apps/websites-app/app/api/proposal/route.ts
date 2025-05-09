import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Form data typing
interface ProposalFormData {
  fullName: string;
  email: string;
  phone: string;
}

export async function POST(request: Request) {
  try {
    // Parse the JSON request body
    const body: ProposalFormData = await request.json();
    
    // Basic validation
    if (!body.fullName || !body.email || !body.phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    // Send email via Resend
    await resend.emails.send({
      from: 'support@kitions.com',
      to: 'hannyeljimenez@gmail.com',
      subject: '🚀 New Free Proposal Request from Kitions Website',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Free Proposal Request</title>
          <style>
            body { margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9f9f9; }
            .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #eee; }
            .header { background-color: #8982cf; color: #ffffff; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
            .content { padding: 30px; color: #333333; line-height: 1.6; }
            .content h2 { color: #8982cf; margin-top: 0; margin-bottom: 20px; font-size: 22px; }
            .field { margin-bottom: 15px; }
            .field strong { color: #555; min-width: 120px; display: inline-block; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #999999; background-color: #f1f1f1; border-top: 1px solid #eee; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚀 New Proposal Request!</h1>
            </div>
            <div class="content">
              <h2>New Free Proposal Request from Kitions Website</h2>
              <div class="field">
                <strong>Full Name:</strong> ${body.fullName}
              </div>
              <div class="field">
                <strong>Email:</strong> <a href="mailto:${body.email}" style="color: #8982cf; text-decoration: none;">${body.email}</a>
              </div>
              <div class="field">
                <strong>Phone:</strong> ${body.phone}
              </div>
            </div>
            <div class="footer">
              Received via Kitions Website Proposal Form
            </div>
          </div>
        </body>
        </html>
      `,
    });
    
    // Return success response
    return NextResponse.json(
      { 
        success: true, 
        message: 'Proposal request submitted successfully' 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error handling proposal form submission:', error);
    
    return NextResponse.json(
      { 
        error: 'An error occurred while processing your request' 
      },
      { status: 500 }
    );
  }
} 