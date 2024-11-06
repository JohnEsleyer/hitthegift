import { UserData } from "@/lib/types/user";
import { String } from "aws-sdk/clients/codebuild";



export default function inviteEmail(userFirstName: string, userLastName: string, targetEmail: string){
    return `
  <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invitation to Join HitMyGift</title>

  <style>
    body {
      font-family: 'Arial', sans-serif;
      background-color: #e6f2ff; /* Light blue background */
      margin: 0;
      padding: 20px;
    }

    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    .header {
      background-color: #c6e2ff;
      background-image: url('https://imageassets-hitmygift.fra1.cdn.digitaloceanspaces.com/background.png');
      color: #333; /* Darker text color */
      padding: 70px;
      height: 50px;
      text-align: center;
      font-weight: bold;
      font-size: 30px;
      border-bottom: 2px solid #a6d2ff; /* Subtle border */
      color: #ffffff;
    }

    .content {
      padding: 20px;
      text-align: center;
    }

    .text-left {
      text-align: left;
    }

    .content h2 {
      color: #c60000; /* Christmas red */
    }

    .content p {
      color: #333;
      font-size: 16px;
      line-height: 1.5;
      margin: 20px 0;
    }

    .button {
      display: inline-block;
      background-color: #001ec6; /* Christmas red */
      color: white;
      text-decoration: none;
      padding: 10px 20px;
      border-radius: 5px;
      font-weight: bold;
      margin-top: 20px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* Add a subtle shadow */
    }

    .button:hover {
      background-color: #003aa6; /* Darker red on hover */
    }

    .footer {
      background-color: #d9d9d9;
      text-align: center;
      padding: 10px;
      color: #555;
      font-size: 12px;
    }

    .snowflake {
      color: #c6e2ff;
      font-size: 18px;
      position: relative;
      top: -10px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <span class="snowflake">🎁</span> You have a special invitation! <span class="snowflake">🎁</span>
    </div>
    <div class="content pt-12 pb-12">
      <p class="text-left">Hi, <strong>${targetEmail}</strong></p>
      <p class="text-left"><strong>${userFirstName} ${userLastName}</strong> has created a wishlist on <strong>HitMyGift</strong> and wants to share it with you.</p>
      <a href="hitmygift.com" class="button"><span class="join">Join HitMyGift.com</span></a>
      <div class="mt-8">
        <p>Join HitMyGift.com now and discover <strong>${userFirstName}</strong>'s wishlist!</p>
      </div>
    </div>
    <div class="footer">
      <p>Thank you for being a part of HitMyGift!</p>
    </div>
  </div>
</body>
</html>
    `
}