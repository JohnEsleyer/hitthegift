export default function verifyEmail(
  firstName: string,
  lastName: string,
  email: string,
  token: string
) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
  <div class="email-container" style="background: #ffffff; max-width: 600px; margin: 20px auto; padding: 20px; border-radius: 8px;">
    <h2 style="color: #333;">Welcome to HitMyGift!</h2>
    <p style="color: #555;">Hello ${firstName} ${lastName},</p>
    <p style="color: #555;">Please verify your email address for <strong>${email}</strong> by clicking the button below.</p>
    <a href="https://${process.env.WEBSITE_DOMAIN}/verify?token=${token}&email=${email}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 20px;">Verify My Email</a>
    <div class="footer" style="margin-top: 30px; color: #888; font-size: 12px;">
      <p>© 2024 HitMyGift. All rights reserved.</p>
      <p>If you did not request this verification, please ignore this email.</p>
    </div>
  </div>
</body>
</html>
    `;
}
