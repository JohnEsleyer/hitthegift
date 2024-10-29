'use server'

import nodemailer from 'nodemailer';
import verifyEmail from './emails/verifyEmail';
import getUserInfo from '../user/getUserInfo';



export default async function sendEmailVerification(
    userId: string,
    targetEmail: string, 
    firstName: string, 
    lastName: string,
    token: string,
){


    try{    
        const transporter = nodemailer.createTransport({
            host: "smtp.zoho.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.ZOHO_USERNAME,
                pass: process.env.ZOHO_PASS,
            },  
        });

        const userData = await getUserInfo(userId);

        if (!userData){
            return {
                status:400,
                message: 'Failed to fetch user data',
            }
        }

        const mailOptions = {
            from :'"HitMyGift" noreply@hitmygift.com',
            to: targetEmail,
            subject: 'Verify your email address',
            html: verifyEmail(firstName, lastName, targetEmail, token),

        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              return console.log('Error:', error);
            }
            console.log('Email sent: ' + info.response);
          });
          
          return {
            status: 200,
            message: "Email sent successfully",
          }

    }catch(e){
        console.log(e);
        return {
            status: 500,
            message: 'Server error, something went wrong.'
        }
    }
}

