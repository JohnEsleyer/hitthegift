'use server'

import { mongoClient } from "@/lib/mongodb";
import { UserData } from "@/lib/types/userdata";



export async function createUserAction(data: UserData){
    try{
        const db = mongoClient.db('hitmygift');
        db.collection('users').insertOne({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: data.password,
            hobbyInfo: data.hobbyInfo,
            showInterest: data.showInterest
        });
        return {message: "Registration Failed"};
    }catch(e){
        console.log(e);
        return {message: "Registration Success"};
    }

}

export async function testAction(data: string){
    console.log("Hello " +data);
}