'use server'

import { mongoClient } from "@/lib/mongodb";
import { UserData } from "@/lib/types/user";


export default async function verifyResetToken(token: string, email: string){
    try{
        const db = mongoClient.db('hitmygift');
        
        // Find the user by email and token 
        const user = await db.collection<UserData>('users').findOne({
            email: email, 
            resetToken: token
        });

        // Check if user exists and token is valid
        if (!user){
            return {
                status: 400,
                message: 'Password Reset token has expired'
            }
        }

        console.log(`Password Reset Token verified`);
        return {
            status: 200,
            message: 'Password Reset token is verified',
        }


    }catch(e){
        console.log(`Server Error: ${e}`);
        return {
            status: 500,
            message: `Server error: ${e}`,
        }
    }
}