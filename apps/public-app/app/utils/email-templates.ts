/**
 * Email templates for the secret email panel
 */

type TemplateData = {
  message: string;
  subject: string;
  [key: string]: string | number | boolean | undefined; // More specific types instead of 'any'
};

// Base styles shared across all templates
const baseStyles = `
  body { margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9f9f9; }
  .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #eee; }
  .header { padding: 30px; text-align: center; }
  .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
  .content { padding: 30px; color: #333333; line-height: 1.6; }
  .footer { text-align: center; padding: 20px; font-size: 12px; color: #999999; background-color: #f1f1f1; border-top: 1px solid #eee; }
`;

// Custom template (default)
export function customTemplate(data: TemplateData): string {
  const { subject, message } = data;
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        ${baseStyles}
        .header { background-color: #8982cf; color: #ffffff; }
        .message-box { background-color: #f2f0ff; border-left: 4px solid #8982cf; padding: 15px; margin-top: 10px; border-radius: 4px; white-space: pre-wrap; word-wrap: break-word; }
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

// Greeting template
export function greetingTemplate(data: TemplateData): string {
  const { subject, message } = data;
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        ${baseStyles}
        .header { background: linear-gradient(135deg, #8982cf 0%, #6a5acd 100%); color: #ffffff; padding: 40px 30px; }
        .header h1 { margin-bottom: 10px; }
        .header p { margin: 0; opacity: 0.9; }
        .welcome-icon { font-size: 48px; margin-bottom: 15px; }
        .message-box { background-color: #ffffff; padding: 20px; margin-top: 10px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); line-height: 1.7; }
        .signature { margin-top: 30px; font-style: italic; color: #666; }
        .button-container { margin-top: 25px; text-align: center; }
        .button { display: inline-block; background-color: #8982cf; color: white; padding: 12px 24px; text-decoration: none; border-radius: 30px; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="welcome-icon">👋</div>
          <h1>Welcome to Kitions!</h1>
          <p>We're glad you're here</p>
        </div>
        <div class="content">
          <div class="message-box">
            ${message.replace(/\n/g, '<br/>')}
          </div>
          <div class="button-container">
            <a href="https://kitions.com/login" class="button">Get Started</a>
          </div>
          <div class="signature">
            - The Kitions Team
          </div>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Kitions. All rights reserved.</p>
          <p>Questions? Contact us at <a href="mailto:support@kitions.com" style="color: #8982cf;">support@kitions.com</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Invoice template
export function invoiceTemplate(data: TemplateData): string {
  const { subject, message } = data;
  
  // Extract invoice details from message if available
  const invoiceNumber = message.match(/Invoice #: ?(.*)/)?.[1] || '[INVOICE_NUMBER]';
  const amount = message.match(/Amount Due: ?(.*)/)?.[1] || '[AMOUNT]';
  const dueDate = message.match(/Due Date: ?(.*)/)?.[1] || '[DUE_DATE]';
  const date = message.match(/Date: ?(.*)/)?.[1] || new Date().toLocaleDateString();
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        ${baseStyles}
        .header { background-color: #333333; color: #ffffff; }
        .invoice-box { border: 1px solid #eee; padding: 30px; border-radius: 4px; max-width: 100%; margin-top: 20px; }
        .invoice-header { display: flex; justify-content: space-between; margin-bottom: 20px; }
        .invoice-header h2 { color: #333; margin: 0; font-size: 24px; }
        .invoice-details { background-color: #f8f9fa; padding: 15px; border-radius: 4px; margin-bottom: 20px; }
        .invoice-details table { width: 100%; border-collapse: collapse; }
        .invoice-details th { text-align: left; color: #666; font-weight: normal; padding: 8px 0; }
        .invoice-details td { text-align: right; padding: 8px 0; font-weight: bold; }
        .invoice-amount { font-size: 24px; color: #333; margin-top: 20px; text-align: right; }
        .invoice-amount span { font-size: 16px; color: #666; }
        .payment-button { display: inline-block; background-color: #8982cf; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; margin-top: 15px; }
        .payment-notice { margin-top: 20px; padding: 15px; background-color: #fff8e1; border-left: 4px solid #ffc107; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Invoice from Kitions</h1>
        </div>
        <div class="content">
          <p>Dear Customer,</p>
          
          <div class="invoice-box">
            <div class="invoice-header">
              <h2>Invoice</h2>
              <div style="text-align: right;">
                <div style="color: #999;">Invoice #${invoiceNumber}</div>
                <div style="font-weight: bold; color: #333; margin-top: 5px;">${date}</div>
              </div>
            </div>
            
            <div class="invoice-details">
              <table>
                <tr>
                  <th>Invoice Number</th>
                  <td>${invoiceNumber}</td>
                </tr>
                <tr>
                  <th>Issue Date</th>
                  <td>${date}</td>
                </tr>
                <tr>
                  <th>Due Date</th>
                  <td>${dueDate}</td>
                </tr>
              </table>
            </div>
            
            <div class="invoice-amount">
              <span>Amount Due</span><br>
              ${amount}
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="https://kitions.com/billing" class="payment-button">Pay Invoice</a>
            </div>
          </div>
          
          <div class="payment-notice">
            Payment Terms: Please pay this invoice within the due date to avoid any service interruptions.
          </div>
          
          <p style="margin-top: 30px;">Thank you for your business!</p>
          <p>Best regards,<br>Kitions Billing Team</p>
        </div>
        <div class="footer">
          <p>This is an automatically generated email, please do not reply directly.</p>
          <p>© ${new Date().getFullYear()} Kitions. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Update template
export function updateTemplate(data: TemplateData): string {
  const { subject, message } = data;
  
  // Try to extract features from the message
  const featuresMatch = message.match(/What's New:([\s\S]*?)(?=To learn more|$)/i);
  const featuresBlock = featuresMatch ? featuresMatch[1].trim() : '';
  
  // Split features into array and format them
  let features: string[] = [];
  if (featuresBlock) {
    features = featuresBlock.split('\n')
      .map(line => line.trim())
      .filter(line => line.startsWith('-'))
      .map(line => line.substring(1).trim());
  }
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        ${baseStyles}
        .header { background: linear-gradient(135deg, #4a90e2 0%, #8982cf 100%); color: #ffffff; }
        .header h1 { margin-bottom: 10px; }
        .update-box { background-color: #f5f9ff; padding: 30px; border-radius: 8px; margin: 20px 0; }
        .update-title { font-size: 20px; font-weight: bold; color: #4a90e2; margin-bottom: 15px; }
        .feature-list { list-style-type: none; padding: 0; margin: 0; }
        .feature-item { margin-bottom: 15px; padding-left: 30px; position: relative; }
        .feature-item:before { content: "✨"; position: absolute; left: 0; top: 0; color: #8982cf; }
        .cta-button { display: inline-block; background-color: #4a90e2; color: white; padding: 12px 30px; text-decoration: none; border-radius: 30px; font-weight: bold; margin-top: 20px; }
        .divider { height: 1px; background-color: #e0e0e0; margin: 30px 0; }
        .contact-box { background-color: #f0f0f0; padding: 15px; border-radius: 8px; margin-top: 20px; font-size: 14px; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Product Update</h1>
        </div>
        <div class="content">
          <p>Dear Customer,</p>
          <p>We're excited to announce the latest updates to the Kitions platform!</p>
          
          <div class="update-box">
            <div class="update-title">What's New</div>
            <ul class="feature-list">
              ${features.length > 0 ? 
                features.map(feature => `<li class="feature-item">${feature}</li>`).join('') : 
                '<li class="feature-item">[FEATURE 1]: Brief description</li>\n              <li class="feature-item">[FEATURE 2]: Brief description</li>\n              <li class="feature-item">[FEATURE 3]: Brief description</li>'
              }
            </ul>
          </div>
          
          <div style="text-align: center;">
            <a href="https://kitions.com/updates" class="cta-button">Learn More</a>
          </div>
          
          <div class="divider"></div>
          
          <p>To learn more about these updates, please visit our documentation or contact support.</p>
          <p>Thank you for being a valued Kitions customer!</p>
          
          <div class="contact-box">
            Questions? Contact our support team at <a href="mailto:support@kitions.com" style="color: #4a90e2;">support@kitions.com</a>
          </div>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Kitions. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Template selector function
export function getEmailTemplate(templateId: string = 'custom', data: TemplateData): string {
  switch (templateId) {
    case 'greeting':
      return greetingTemplate(data);
    case 'invoice':
      return invoiceTemplate(data);
    case 'update':
      return updateTemplate(data);
    case 'custom':
    default:
      return customTemplate(data);
  }
} 