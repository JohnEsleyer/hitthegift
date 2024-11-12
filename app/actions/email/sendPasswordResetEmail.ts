'use server'

import nodemailer from 'nodemailer';

import { UserData } from "@/lib/types/user";
import crypto from 'crypto';
import passwordResetEmail from './emails/passwordResetEmail';
import { MongoClient } from 'mongodb';

export default async function sendPasswordResetEmail(targetEmail: string){
    
    const uri = process.env.MONGODB_URI || '';

    const mongoClient = new MongoClient(uri);
    
    try{
        const db = mongoClient.db('hitmygift');
        // Find the user by email
        const user = await db.collection<UserData>('users').findOne({
            email: targetEmail,
        });

        // If no user is found based on the email, return 400
        if (!user){
            console.log('No user found with that email address');
            return {
                status: 400,
                message: 'No user found with that email address',
            }
        }

        // Generate a reset token
        const resetPassToken = crypto.randomBytes(16).toString('hex');

        // Assign the token to user
        await db.collection<UserData>('users').updateOne({
            email: targetEmail,
        }, {
            $set: {resetToken: resetPassToken},
        });

        
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
            from :'"HitMyGift" noreply@hitmygift.com',
            to: targetEmail,
            subject: 'You have request a password reset',
            html: passwordResetEmail(user.firstName, user.lastName, targetEmail, resetPassToken),

        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              return console.log('Error:', error);
            }
            console.log('Email sent: ' + info.response);
          });

         
        return {
            status: 200,
            message: 'Password reset request sent',
        }

    }catch(e){
        console.log('Failed to send password reset request');
         
        return {
            status: 500,
            message: 'Failed to send password reset request',
        }

    }finally{
        mongoClient.close();
    }
}