'use server'

import { mongoClient } from "@/lib/mongodb";
import { UserData } from "@/lib/types/user";

export default async function verifyVerificationToken(token: string, userEmail: string){

    try{
        const db = mongoClient.db('hitmygift');
        console.log(`VerificationToken: ${token}`);
        // Find the user by email and token
        const user = await db.collection<UserData>('users').findOne({
            email: userEmail, 
            verificationToken: token
        });

        // Check if user exists and token is valid
        if (!user){
            return {
                status: 400,
                message: 'Verification token has expired'
            }
        }

        // Mark the user as verified
        await db.collection<UserData>('users').updateOne({
            email: 'ralphpolicarpio513@gmail.com',
        }, {
            $set: {verified: true}
        })

        console.log(`Email verified for ${userEmail}`);
        return {
            status: 200,
            message: 'Email verified successfully',
        }

    }catch(e){
        console.log(`Failed to verify email for ${userEmail}`);
        return {
            status: 500,
            message: 'Server error. Please try again later'
        }
    }
}   