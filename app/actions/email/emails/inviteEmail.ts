
export default function inviteEmail(
  userFirstName: string,
  userLastName: string,
  targetEmail: string
) {
  return `
  <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invitation to Join HitMyGift</title>
</head>
<body style="font-family: 'Arial', sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
  <div class="email-container" style="background: #ffffff; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 8px;">
    <h2 style="color: #333;">You have a special invitation!</h2>
    <p style="color: #555; text-align: left;">Hi, <strong>${targetEmail}</strong></p>
    <p style="color: #555; text-align: left;"><strong>${userFirstName} ${userLastName}</strong> has created a wishlist on <strong>HitMyGift</strong> and wants to share it with you.</p>
    <a href="https://hitmygift.com" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 20px;">Join HitMyGift.com</a>
    <div style="margin-top: 20px;">
      <p style="color: #555;">Join HitMyGift now and discover <strong>${userFirstName}</strong>'s wishlist!</p>
    </div>
    <div class="footer" style="margin-top: 30px; color: #888; font-size: 12px; text-align: center;">
      <p>Thank you for being a part of HitMyGift!</p>
    </div>
  </div>
</body>
</html>
    `;
}
