"use server";
import nodemailer from "nodemailer";
import getUserInfo from "../user/getUserInfo";
import inviteEmail from "./emails/inviteEmail";
import { UserData } from "@/lib/types/user";

export default async function sendInviteByEmail(
  userId: string,
  targetEmail: string
) {
  try {
    const userData = await getUserInfo(userId);

    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.ZOHO_USERNAME,
        pass: process.env.ZOHO_PASS,
      },
    });

    const mailOptions = {
      from: '"HitMyGift" noreply@hitmygift.com',
      to: targetEmail,
      subject: `You have been invited by ${userData.firstName} ${userData.lastName}`,
      html: inviteEmail(userData.firstName || '', userData.lastName || '', targetEmail)
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log('Error:', error);
        }
        console.log('Email sent: ' + info.response);
      });
      

  } catch (e) {
    return {
      message: "Server failed to send invite",
      status: 500,
    };
  }
}
