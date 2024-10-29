

export default function passwordResetEmail(firstName: string, lastName: string, email: string, token: string){
    return ` 
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 20px; border-radius: 5px;">
        <h2 style="color: #333333;">Reset Your Password</h2>
        <p>Hi ${firstName} ${lastName},</p>
        <p>We received a request to reset your password for your <strong>HitMyGift</strong> account. If you didn't make this request, you can safely ignore this email.</p>
        <p style="text-align: center; margin: 20px 0;">
            <a href="https://${process.env.WEBSITE_DOMAIN}/forgot-password?token=${token}&email=${email}" style="background-color: #4CAF50; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Your Password</a>
        </p>
        <p>If you’re having trouble clicking the "Reset Your Password" button, copy and paste the URL below into your web browser:</p>
        <p style="word-break: break-all;"><a href="https://${process.env.WEBSITE_DOMAIN}/forgot-password?token=${token}&email=${email}" style="color: #4CAF50;">https://${process.env.WEBSITE_DOMAIN}/forgot-password?token=${token}&email=${email}</a></p>
        <p>Thank you,<br>The HitMyGift Team</p>
    </div>
</body>
</html>

    `;
}