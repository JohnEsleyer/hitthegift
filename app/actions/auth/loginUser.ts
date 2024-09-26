'use server'

import { comparePassword } from "@/lib/hashPassword";
import { mongoClient } from "@/lib/mongodb";
import { LoginData, UserData } from "@/lib/types/authTypes";

export async function loginUserAction(data: LoginData){

    try{
        const {email, password} = data;
        const db = mongoClient.db('hitmygift');
        
        // Find the user by email
        const user = await db.collection('users').findOne({email});

        // Validate user 
        if (!user){
            return {message: 'Invalid email or password', status: 401};
        }

        // Compare password entered to the hashed password 
        const isMatch = comparePassword(password, user.password)
        if (!isMatch){
            return {
                message: 'Invalid email or password', status: 401
            }
        }

        return {message: "Login Successful",data: {userId: user._id}, status: 200};
    }catch(e){
        console.log(e);
        return {message: "Login Failed", status: 500};
    }

}

export async function testAction(data: string){
    console.log("Hello " +data);
}