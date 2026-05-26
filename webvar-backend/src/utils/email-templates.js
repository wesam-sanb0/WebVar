export function generateVerificationEmail({ username, verificationLink }) {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.5;
            color: #2D3748;
            background-color: #F8FBFD;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            padding: 30px 0 20px;
        }
        .logo {
            font-size: 28px;
            font-weight: 700;
            color: #00bcd4;
            margin-bottom: 8px;
        }
        .tagline {
            color: #5F6C80;
            font-size: 16px;
            margin-bottom: 30px;
        }
        .card {
            background: white;
            border-radius: 12px;
            padding: 32px;
            box-shadow: 0 4px 15px rgba(0, 188, 212, 0.08);
            border: 1px solid #E1F5F8;
        }
        h1 {
            font-size: 24px;
            font-weight: 600;
            margin-top: 0;
            color: #008394;
        }
        .button {
            display: inline-block;
            padding: 14px 28px;
            background-color: #00bcd4;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            margin: 24px 0;
        }
        .features {
            margin: 30px 0;
            background: #F0FAFC;
            padding: 20px;
            border-radius: 8px;
        }
        .feature {
            display: flex;
            align-items: center !important;
            margin-bottom: 16px;
            color: #2D3748;
        }
        .feature-icon {
            font-size: 24px;
            margin-right: 12px;
            color: #00bcd4;
            min-width: 30px;
            text-align: center;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            color: #718096;
            font-size: 14px;
        }
        .divider {
            height: 1px;
            background: linear-gradient(90deg, rgba(0,188,212,0) 0%, rgba(0,188,212,0.3) 50%, rgba(0,188,212,0) 100%);
            margin: 30px 0;
        }
        a.btn-white{
            color: white !important;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">WebVar</div>
            <div class="tagline">Shop with confidence!</div>
        </div>
        
        <div class="card">
            <h1>Almost there, ${username}!</h1>
            <p>Thank you for joining WebVar. To start comparing prices securely, please verify your email address:</p>
            
            <div style="text-align: center;">
                <a href="${verificationLink}" class="button btn-white">Verify Email</a>
            </div>
            
            <div class="divider"></div>
            
            <div class="features">
                <div class="feature">
                    <div class="feature-icon">↔</div>
                    <span><strong>Price Comparison:</strong> Find the best deals across trusted stores</span>
                </div>
                <div class="feature">
                    <div class="feature-icon">✓</div>
                    <span><strong>Secure Shopping:</strong> All stores verified for your safety</span>
                </div>
            </div>
            
            <p style="color: #5F6C80;">If you didn't create this account, no further action is required.</p>
        </div>
        
        <div class="footer">
            <p>© 2025 WebVar. All rights reserved.</p>
            <p>We compare prices and verify shopping websites to ensure you get the best deals safely.</p>
        </div>
    </div>
</body>
</html>
    `;
}

export function generateResetPasswordEmail({ username, resetLink }) {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.5;
            color: #2D3748;
            background-color: #F8FBFD;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            padding: 30px 0 20px;
        }
        .logo {
            font-size: 28px;
            font-weight: 700;
            color: #00bcd4;
            margin-bottom: 8px;
        }
        .tagline {
            color: #5F6C80;
            font-size: 16px;
            margin-bottom: 30px;
        }
        .card {
            background: white;
            border-radius: 12px;
            padding: 32px;
            box-shadow: 0 4px 15px rgba(0, 188, 212, 0.08);
            border: 1px solid #E1F5F8;
        }
        h1 {
            font-size: 24px;
            font-weight: 600;
            margin-top: 0;
            color: #008394;
        }
        .button {
            display: inline-block;
            padding: 14px 28px;
            background-color: #00bcd4;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            margin: 24px 0;
        }
        .features {
            margin: 30px 0;
            background: #F0FAFC;
            padding: 20px;
            border-radius: 8px;
        }
        .feature {
            display: flex;
            align-items: center !important;
            margin-bottom: 16px;
            color: #2D3748;
        }
        .feature-icon {
            font-size: 24px;
            margin-right: 12px;
            color: #00bcd4;
            min-width: 30px;
            text-align: center;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            color: #718096;
            font-size: 14px;
        }
        .divider {
            height: 1px;
            background: linear-gradient(90deg, rgba(0,188,212,0) 0%, rgba(0,188,212,0.3) 50%, rgba(0,188,212,0) 100%);
            margin: 30px 0;
        }
        a.btn-white{
            color: white !important;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">WebVar</div>
            <div class="tagline">Shop with confidence!</div>
        </div>
        
        <div class="card">
            <h1>Password Reset Request</h1>
            <p>Hi ${username}, we received a request to reset your WebVar account password. Click the button below to reset it:</p>
            
            <div style="text-align: center;">
                <a href="${resetLink}" class="button btn-white">Reset Password</a>
            </div>
            
            <div class="divider"></div>
            
            <div class="features">
                <div class="feature">
                    <div class="feature-icon">🔒</div>
                    <span><strong>Secure Process:</strong> Reset your password safely and quickly</span>
                </div>
                <div class="feature">
                    <div class="feature-icon">🕒</div>
                    <span><strong>Time Sensitive:</strong> This link will expire in 1 hour</span>
                </div>
            </div>
            
            <p style="color: #5F6C80;">If you didn't request a password reset, you can safely ignore this email.</p>
        </div>
        
        <div class="footer">
            <p>© 2025 WebVar. All rights reserved.</p>
            <p>We compare prices and verify shopping websites to ensure you get the best deals safely.</p>
        </div>
    </div>
</body>
</html>
    `;
}
