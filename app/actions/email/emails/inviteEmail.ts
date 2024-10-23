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
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
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

    .header img {
      max-width: 150px;
      height: auto;
    }
    .content {
      padding: 20px;
      text-align: center;
    }
    .content h2 {
      color: #000000;
    }
    .content p {
      color: #000000;
      font-size: 16px;
      line-height: 1.5;
      margin: 20px 0;
    }
    .button {
      display: inline-block;
      background-color: #1d2ff2;
      color: white;
      text-decoration: none;
      padding: 10px 20px;
      border-radius: 5px;
      font-weight: bold;
      margin-top: 20px;
    }
    .footer {
      background-color: #f4f4f4;
      text-align: center;
      padding: 10px;
      color: #888888;
      font-size: 12px;
    }
    .icon{
      width:90px;
      height:90px;
    }
    .header{
      margin-top: 12px;
      color: blue;
      font-size: 40px;
    }
    
    .join{
      color: white;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="content pt-12 pb-12">
      <div class="header">You have a special invitation!</div>
      <p>Hi, <strong>${targetEmail}</strong></p>
      <p><strong>${userFirstName} ${userLastName}</strong> has created a wishlist on <strong>HitMyGift</strong> and wants to share it with you.</p>
      <a href="hitmygift.com" class="button"><span class="join">Join HitMyGift.com</span></a>
      <div class="mt-8"><p>Join HitMyGift.com now and discover <strong>${userFirstName}</strong>'s wishlist!</p></div>
    </div>
    <div class="footer">
      <p>Thank you for being a part of HitMyGift!</p>
    </div>
  </div>
</body>
</html>
    `
}