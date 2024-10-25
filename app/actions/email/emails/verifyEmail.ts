

export default function verifyEmail(firstName: string, lastName: string, email: string, token: string){
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #e6f2ff; /* Light blue background */
            margin: 0;
            padding: 0;
        }
        .email-container {
            background: #ffffff;
            max-width: 600px;
            margin: 20px auto;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: #1e90ff; /* Dodger Blue */
            padding: 20px;
            text-align: center;
            color: #ffffff;
        }
        .header img {
            max-height: 50px;
        }
        .content {
            padding: 20px;
            text-align: center;
        }
        .content h2 {
            color: #1e90ff;
            margin-top: 0;
        }
        .content p {
            color: #555555;
        }
        .button-container {
            margin: 20px;
            text-align: center;
        }
        .verify-button {
            background: #1e90ff;
            color: #ffffff;
            padding: 12px 24px;
            border: none;
            border-radius: 5px;
            text-decoration: none;
            font-size: 16px;
            display: inline-block;
        }
        .verify-button:hover {
            background: #007acc; /* Darker blue for hover */
        }
        .footer {
            background: #f1f1f1;
            padding: 10px;
            text-align: center;
            font-size: 12px;
            color: #888888;
        }
        .christmas-banner {
            background: url('https://example.com/christmas-banner.jpg') no-repeat center;
            background-size: cover;
            padding: 30px;
            text-align: center;
            color: #ffffff;
        }
        .snowflakes {
            color: #1e90ff;
            font-size: 20px;
            animation: snow 10s infinite linear;
        }
        @keyframes snow {
            0% { transform: translateY(0); }
            100% { transform: translateY(100%); }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="christmas-banner">
                <div class="snowflakes">🎁🎁🎁</div>
                <!-- <img src="https://example.com/logo.png" alt="Logo" /> -->
                <h2>Welcome to HitMyGift!</h2>
            </div>
        </div>
        <div class="content">
            <h2>Hello ${firstName} ${lastName},</h2>
            <p>Please verify your email address for <strong>${email}</strong> by clicking the button below.</p>
            <div class="button-container">
                <a href="https://${process.env.WEBSITE_DOMAIN}/verify?token=${token}&email=${email}" class="verify-button">Verify My Email</a>
            </div>
        </div>
        <div class="footer">
            <p>© 2024 HitMyGift. All rights reserved.</p>
            <p>If you did not request this verification, please ignore this email.</p>
        </div>
    </div>
</body>
</html>

    
    `;
}