import { NextRequest, NextResponse } from 'next/server';

interface EmailData {
  user_id: string;
  status: string;
  user_email: string;
  user_name: string;
  business_name: string;
}

export async function POST(request: NextRequest) {
  try {
    const emailData: EmailData = await request.json();
    const { status, user_email, user_name, business_name } = emailData;

    console.log('📧 Verification email request received:', { user_email, status, user_name });

    // Only send email for verified status
    if (status !== 'verified') {
      console.log('📧 Status is not verified, skipping email');
      return NextResponse.json({ message: 'Email not sent - status not verified' }, { status: 200 });
    }

    // Check if we have Resend API key configured
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    
    if (!RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY environment variable not set');
      return NextResponse.json(
        { error: 'Email service not configured' }, 
        { status: 500 }
      );
    }

    // Send email using Resend
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Kitions Team <support@kitions.com>',
        to: [user_email],
        subject: '🎉 Your Kitions Account Has Been Verified!',
        html: generateVerificationEmailHTML(user_name, business_name, user_email),
        text: generateVerificationEmailText(user_name, business_name, user_email),
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error('❌ Failed to send email via Resend:', errorText);
      return NextResponse.json(
        { error: `Failed to send email: ${errorText}` }, 
        { status: 500 }
      );
    }

    const emailResult = await emailResponse.json();
    console.log('✅ Verification email sent successfully:', emailResult);

    return NextResponse.json({
      success: true,
      message: 'Verification email sent successfully',
      emailId: emailResult.id
    });

  } catch (error) {
    console.error('❌ Error in send-verification-email API:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}

function generateVerificationEmailHTML(userName: string, businessName: string, userEmail: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Account Verified - Kitions</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 40px;">
        <img src="https://kitions.com/default-monochrome-black.svg" alt="Kitions" style="width: 150px; height: auto;">
      </div>

      <!-- Main Content -->
      <div style="background-color: #f8f9fa; border-radius: 10px; padding: 30px; margin-bottom: 30px;">
        <!-- Success Icon -->
        <div style="text-align: center; margin-bottom: 20px;">
          <div style="display: inline-block; background-color: #10b981; border-radius: 50%; width: 60px; height: 60px; line-height: 60px;">
            <span style="color: white; font-size: 30px;">✓</span>
          </div>
        </div>

        <h1 style="color: #1f2937; text-align: center; margin-bottom: 20px; font-size: 28px;">
          Congratulations, ${userName}!
        </h1>
        
        <p style="font-size: 18px; text-align: center; color: #4b5563; margin-bottom: 25px;">
          Your Kitions account has been successfully verified by our team.
        </p>
        
        <div style="background-color: white; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
          <h3 style="color: #374151; margin-top: 0; margin-bottom: 15px;">Account Details:</h3>
          <p style="margin: 5px 0;"><strong>Business:</strong> ${businessName}</p>
          <p style="margin: 5px 0;"><strong>Email:</strong> ${userEmail}</p>
          <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #10b981; font-weight: 600;">Verified ✓</span></p>
        </div>

        <h3 style="color: #374151; margin-bottom: 15px;">What's Next?</h3>
        <ul style="color: #4b5563; padding-left: 20px; margin-bottom: 25px;">
          <li style="margin-bottom: 8px;">You can now access all platform features</li>
          <li style="margin-bottom: 8px;">Connect with verified suppliers and retailers</li>
          <li style="margin-bottom: 8px;">Manage your business profile and inventory</li>
          <li style="margin-bottom: 8px;">Start building your network</li>
        </ul>

        <!-- CTA Button -->
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://dashboard.kitions.com" 
             style="display: inline-block; background-color: #8982cf; color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: 600; font-size: 16px;">
            Access Your Dashboard
          </a>
        </div>
      </div>

      <!-- Footer -->
      <div style="text-align: center; color: #6b7280; font-size: 14px;">
        <p>Need help? Contact our support team at <a href="mailto:support@kitions.com" style="color: #8982cf;">support@kitions.com</a></p>
        <p style="margin-top: 20px;">
          © 2024 Kitions. All rights reserved.<br>
          <a href="https://kitions.com" style="color: #8982cf; text-decoration: none;">Visit our website</a>
        </p>
      </div>

    </body>
    </html>
  `;
}

function generateVerificationEmailText(userName: string, businessName: string, userEmail: string): string {
  return `
Congratulations, ${userName}!

Your Kitions account has been successfully verified by our team.

Account Details:
- Business: ${businessName}
- Email: ${userEmail}
- Status: Verified ✓

What's Next?
• You can now access all platform features
• Connect with verified suppliers and retailers
• Manage your business profile and inventory
• Start building your network

Access your dashboard at: https://dashboard.kitions.com

Need help? Contact our support team at support@kitions.com

© 2024 Kitions. All rights reserved.
Visit our website: https://kitions.com
  `;
} 