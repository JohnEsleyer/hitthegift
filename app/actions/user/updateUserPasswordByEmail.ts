'use server'

import { hashPassword } from "@/lib/hashPassword";
import { UserData } from "aws-sdk/clients/ec2";
import { MongoClient } from "mongodb";

export default async function updateUserPasswordByEmail(email:string, newPass: string){
    const uri = process.env.MONGODB_URI || '';
    const mongoClient = new MongoClient(uri);
    
    try{
        const db = mongoClient.db('hitmygift');
        // Find the user by email
        const user = await db.collection<UserData>('users').findOne({
            email: email,
        });

        // If no user is found based on the email, return 400
        if (!user){
            console.log('No user found with that email address');
             
            return {
                status: 400,
                message: 'No user found with that email address',
            }
        }

        // Encrypt the new password
        const encryptedPassword = await hashPassword(newPass); 

        await db.collection<UserData>('users').updateOne({
            email: email,
        }, {
            $set: {password: encryptedPassword},
        });
        
         
        return {
            status: 200,
            message: `Password reset successfull`,
        }


    }catch(e){
        console.log(`Server Error: ${e}`);
         
        return {
            status: 500,
            message: `Server Error: ${e}`,
        }
    }finally{
        mongoClient.close();
    }
}