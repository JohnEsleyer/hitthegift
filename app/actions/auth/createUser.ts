'use server'

import { hashPassword } from "@/lib/hashPassword";
import { mongoClient } from "@/lib/mongodb";
import { UserData } from "@/lib/types/authTypes";

export async function createUserAction(data: UserData){

    try{
        const db = mongoClient.db('hitmygift');

        // Encrypt password before sending to DB
        const encryptedPassword = hashPassword(data.password);

        db.collection('users').insertOne({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: encryptedPassword,
            hobbyInfo: data.hobbyInfo,
            showInterest: data.showInterest
        });
        return {message: "Registration Success", status:200};
    }catch(e){
        console.log(e);
        return {message: "Registration Failed", status:500};
    }

}

export async function testAction(data: string){
    console.log("Hello " +data);
}