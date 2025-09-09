# Password Reset Setup Guide

This document explains how to set up the password reset functionality for the CtrlRoom application.

## Environment Variables

Add the following environment variables to your `.env` file:

```env
# Frontend URL for password reset links
FRONTEND_URL=http://localhost:3000

# Email configuration (choose one method)
MAIL_MAILER=smtp
MAIL_HOST=your-smtp-host
MAIL_PORT=587
MAIL_USERNAME=your-email@example.com
MAIL_PASSWORD=your-email-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@ctrlroom.com"
MAIL_FROM_NAME="CtrlRoom"

# For development with Mailtrap (recommended)
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your-mailtrap-username
MAIL_PASSWORD=your-mailtrap-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@ctrlroom.com"
MAIL_FROM_NAME="CtrlRoom"
```

## Features Implemented

### Frontend Components
- **ForgotPassword.jsx**: Form to request password reset
- **ResetPassword.jsx**: Form to set new password using reset token
- Updated **Login.jsx**: Added link to forgot password page
- Updated **App.jsx**: Added routes for forgot/reset password

### Backend Endpoints
- **POST /api/forgot-password**: Request password reset
- **POST /api/reset-password**: Reset password with token

### Security Features
- Tokens are hashed before storing in database
- Tokens expire after 60 minutes
- Tokens are single-use (deleted after successful reset)
- Email validation and user existence checks
- Password confirmation validation

## Email Template

The password reset email template is located at:
`Backend/resources/views/emails/password-reset.blade.php`

The template includes:
- Professional styling matching the app design
- Clear call-to-action button
- Security warnings
- Fallback text link

## Database

The password reset functionality uses the existing `password_resets` table with the following structure:
- `email`: User's email address
- `token`: Hashed reset token
- `created_at`: Timestamp for expiration checking

## Testing

1. Start both frontend and backend servers
2. Navigate to `/login`
3. Click "Forgot Password?"
4. Enter a registered email address
5. Check your email for the reset link
6. Click the link to go to the reset password page
7. Enter a new password and confirm it
8. Try logging in with the new password

## Email Service Setup

For production, configure a proper email service:

### Option 1: SMTP (Gmail, Outlook, etc.)
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
```

### Option 2: Mailgun
```env
MAIL_MAILER=mailgun
MAILGUN_DOMAIN=your-domain.mailgun.org
MAILGUN_SECRET=your-mailgun-secret
```

### Option 3: SendGrid
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USERNAME=apikey
MAIL_PASSWORD=your-sendgrid-api-key
MAIL_ENCRYPTION=tls
```

## Troubleshooting

1. **Email not sending**: Check your email configuration and credentials
2. **Reset link not working**: Verify FRONTEND_URL is set correctly
3. **Token expired**: Tokens expire after 60 minutes, request a new one
4. **Invalid token**: Make sure the token hasn't been used already

## Security Notes

- Reset tokens are hashed before storage
- Tokens expire after 60 minutes
- Tokens are single-use only
- Email addresses are validated before sending
- The system doesn't reveal whether an email exists or not (security through obscurity)
