<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Information - CtrlRoom</title>
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
        p {
            margin-bottom: 20px;
            font-size: 16px;
            line-height: 1.6;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
        }
    </style>
</head>
<body>
<div class="container">
    <div class="header">
        <div class="logo">
            <span class="logo-text">CR</span>
        </div>
        <h1>Password Reset Information</h1>
        <p class="subtitle">CtrlRoom Computer Lab Management System</p>
    </div>

    <p>Hello,</p>

    <p>We received a password reset request for <strong>{{ $recipientEmail }}</strong>. If you have an account with us, you will receive a separate email with instructions shortly. If you did not request a password reset, you can safely ignore this message.</p>

    <p>For your security, password reset links expire after a short period of time.</p>

    <div class="footer">
        <p>This email was sent automatically by CtrlRoom. Please do not reply.</p>
    </div>
</div>
</body>
</html>
