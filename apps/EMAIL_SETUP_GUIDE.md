# Email Verification Setup Guide

This guide explains how to set up email notifications when an admin verifies a user account.

## Overview

When an admin clicks "Approve" on a user in the admin dashboard, the system will:

1. Update the user's verification status in the database
2. Automatically send a welcome/verification email to the user
3. Provide feedback to the admin about the email status

## Setup Instructions

### 1. Get a Resend API Key

1. Sign up for a free account at [Resend.com](https://resend.com/)
2. Go to your dashboard and create a new API key
3. Copy the API key (it starts with `re_`)

### 2. Configure Environment Variables

Add the following environment variable to your dashboard app:

**For Development (.env.local in dashboard-app):**
```bash
RESEND_API_KEY=re_your_actual_api_key_here
```

**For Production:**
Add the same environment variable to your hosting platform (Vercel, Railway, etc.)

### 3. Configure Your Domain in Resend

1. In your Resend dashboard, go to "Domains"
2. Add your domain (e.g., `kitions.com`)
3. Follow the DNS verification steps
4. Once verified, you can send emails from `support@kitions.com`

### 4. Test the System

1. Start your dashboard app: `npm run dev`
2. Go to Admin > User Management
3. Find a user with "pending" status
4. Click "Approve"
5. Check the console logs and the user's email

## Email Template Features

The verification email includes:

- ✅ Professional Kitions branding
- ✅ Personalized congratulations message
- ✅ Account details summary
- ✅ Clear next steps for the user
- ✅ Direct link to the dashboard
- ✅ Contact information for support
- ✅ Both HTML and plain text versions

## How It Works

### Admin Dashboard Flow

1. **User Approval**: Admin clicks "Approve" button
2. **Database Update**: `user_verification_statuses` table is updated
3. **User Data Fetch**: System fetches user details (name, email, business)
4. **Email API Call**: Calls `/api/send-verification-email` endpoint
5. **Email Service**: Uses Resend to send the verification email
6. **Feedback**: Admin sees confirmation or error message

### Error Handling

- If email fails, verification still succeeds (graceful degradation)
- Admin receives notification about email status
- Detailed logging for debugging
- Email service errors don't affect user verification

## Customization Options

### Email Content
- Modify `generateVerificationEmailHTML()` and `generateVerificationEmailText()` in `/api/send-verification-email/route.ts`
- Update branding, colors, and messaging

### Email Service
- Currently uses Resend, but you can replace with:
  - SendGrid
  - Mailgun
  - Amazon SES
  - Nodemailer with SMTP

### Trigger Conditions
- Currently sends email only for 'verified' status
- You can add emails for 'rejected' status or other events

## Troubleshooting

### Email Not Sending
1. Check RESEND_API_KEY environment variable
2. Verify domain is configured in Resend
3. Check console logs for specific errors
4. Ensure user has valid email address

### Email in Spam
1. Configure SPF, DKIM, and DMARC records
2. Use verified domain in Resend
3. Avoid spam trigger words in subject/content

### Rate Limits
- Resend free tier: 100 emails/day, 3,000/month
- Upgrade plan if you need more volume

## Security Considerations

- API key should be kept secret (server-side only)
- Email content is logged (avoid sensitive data)
- Rate limiting can prevent abuse
- Validate user data before sending emails

## Future Enhancements

Potential improvements you could add:

1. **Email Templates**: Use a template engine for more complex designs
2. **Batch Processing**: Send multiple emails efficiently
3. **Email Tracking**: Track opens, clicks, bounces
4. **Unsubscribe**: Allow users to opt out of notifications
5. **Localization**: Support multiple languages
6. **Webhook Integration**: Real-time email status updates 