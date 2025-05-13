/**
 * Email template generator functions for the secret email panel
 */

export function getCustomTemplate(subject: string, message: string): string {
  return `
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
  `;
}

export function getGreetingTemplate(subject: string, message: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        body { margin: 0; padding: 0; font-family: 'Poppins', Helvetica, Arial, sans-serif; background-color: #f5f7fa; }
        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 25px rgba(0,0,0,0.05); }
        .header { background: linear-gradient(135deg, #8982cf 0%, #6a62b7 100%); color: #ffffff; padding: 40px 30px; text-align: center; }
        .header img { width: 120px; height: auto; margin-bottom: 20px; }
        .header h1 { margin: 0; font-size: 28px; font-weight: 600; letter-spacing: 0.5px; }
        .welcome-text { font-size: 18px; font-weight: 300; margin-top: 10px; opacity: 0.9; }
        .content { padding: 40px 30px; color: #333333; line-height: 1.7; }
        .greeting { font-size: 20px; font-weight: 500; color: #6a62b7; margin-bottom: 20px; }
        .message-box { background-color: #f8f7fd; border-radius: 12px; padding: 25px; margin: 25px 0; white-space: pre-wrap; word-wrap: break-word; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #8982cf 0%, #6a62b7 100%); color: white; text-decoration: none; padding: 12px 30px; border-radius: 8px; font-weight: 500; margin-top: 20px; }
        .divider { height: 1px; background-color: #e9ecef; margin: 30px 0; }
        .footer { text-align: center; padding: 30px 20px; font-size: 14px; color: #999999; background-color: #f8f7fd; }
        .social-icons { margin: 20px 0; }
        .social-icons a { margin: 0 10px; display: inline-block; }
        .social-icons img { width: 24px; height: 24px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Kitions</h1>
          <p class="welcome-text">We're glad you're here!</p>
        </div>
        <div class="content">
          <p class="greeting">Hello there,</p>
          <div class="message-box">
            ${message.replace(/\n/g, '<br/>')}
          </div>
          <p>Ready to explore our platform? Click the button below to get started:</p>
          <a href="https://kitions.com" class="cta-button">Explore Kitions</a>
          
          <div class="divider"></div>
          
          <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Kitions. All rights reserved.</p>
          <p>123 Business Avenue, Suite 100, City, Country</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
