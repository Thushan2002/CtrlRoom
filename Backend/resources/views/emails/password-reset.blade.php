<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset - CtrlRoom</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
        }
        .container {
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #3b82f6, #6366f1);
            border-radius: 12px;
            margin-bottom: 20px;
        }
        .logo-text {
            color: white;
            font-weight: bold;
            font-size: 20px;
        }
        h1 {
            color: #1f2937;
            margin: 0 0 10px 0;
            font-size: 28px;
        }
        .subtitle {
            color: #6b7280;
            margin: 0 0 30px 0;
            font-size: 16px;
        }
        .content {
            margin-bottom: 30px;
        }
        p {
            margin-bottom: 20px;
            font-size: 16px;
            line-height: 1.6;
        }
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #3b82f6, #6366f1);
            color: white;
            text-decoration: none;
            padding: 14px 28px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            text-align: center;
            margin: 20px 0;
            transition: all 0.2s ease;
        }
        .button:hover {
            background: linear-gradient(135deg, #2563eb, #4f46e5);
            transform: translateY(-1px);
        }
        .security-note {
            background: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 8px;
            padding: 16px;
            margin: 20px 0;
            font-size: 14px;
        }
        .security-note strong {
            color: #92400e;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
        }
        .link {
            color: #3b82f6;
            text-decoration: none;
        }
        .link:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">
                <span class="logo-text">CR</span>
            </div>
            <h1>Password Reset Request</h1>
            <p class="subtitle">CtrlRoom Computer Lab Management System</p>
        </div>

        <div class="content">
            <p>Hello {{ $user->name }},</p>
            
            <p>We received a request to reset your password for your CtrlRoom account. If you made this request, click the button below to reset your password:</p>
            
            <div style="text-align: center;">
                <a href="{{ $resetUrl }}" class="button">Reset My Password</a>
            </div>
            
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p><a href="{{ $resetUrl }}" class="link">{{ $resetUrl }}</a></p>
            
            <div class="security-note">
                <strong>Security Note:</strong> This link will expire in 60 minutes for your security. If you didn't request this password reset, please ignore this email and your password will remain unchanged.
            </div>
            
            <p>If you continue to have problems, please contact our support team.</p>
        </div>

        <div class="footer">
            <p>This email was sent from CtrlRoom Computer Lab Management System.</p>
            <p>If you didn't request this password reset, please ignore this email.</p>
        </div>
    </div>
</body>
</html>
