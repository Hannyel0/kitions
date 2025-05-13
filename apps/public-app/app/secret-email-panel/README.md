# Secret Email Panel

This is a secure panel for sending emails from your Kitions support email address.

## Setup

1. Add the `MY_SECRET_EMAIL_KEY` environment variable to your `.env.local` file:

```
MY_SECRET_EMAIL_KEY=your-secret-key-here
```

2. Make sure your Resend API key is properly configured in your `.env.local` file:

```
RESEND_API_KEY=your-resend-api-key
```

## Usage

Access the panel by visiting:

```
https://kitions.com/secret-email-panel?key=your-secret-key-here
```

Replace `your-secret-key-here` with the value you set in your `.env.local` file.

## Features

- **Secure Access**: Only accessible with the correct secret key
- **Email Sending**: Send emails from support@kitions.com
- **Beautiful UI**: Matches your Kitions brand design
- **Form Validation**: Ensures all required fields are filled correctly

## Security Notice

Keep your secret key confidential to prevent unauthorized access. The key is verified on both client-side and server-side for maximum security. 