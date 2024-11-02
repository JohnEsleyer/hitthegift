'use server'

import { UserData } from "@/lib/types/user";
import { MongoClient } from "mongodb";


// Verifies the verification token sent to the user's email.
// Sets the verified property to true and sets the verificationToken to 'none'
export default async function verifyVerificationToken(token: string, userEmail: string){
    const uri = process.env.MONGODB_URI || '';
    const mongoClient = new MongoClient(uri);
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
            email: userEmail,
        }, {
            $set: {verified: true, verificationToken: 'none'}
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
    }finally{
        mongoClient.close();
    }
}   