'use server'

import { mongoClient } from "@/lib/mongodb";
import { UserData } from "@/lib/types/authTypes";


export async function testAction(data: string){
    console.log("Hello " +data);
}

export async function testMongo(){
    console.log(mongoClient.db('hitmygift').collections.length);
    try{
        const db = mongoClient.db('hitmygift');
        db.collection('users').insertOne({
            firstName: "Ralph",
            lastName: "Policarpio",
            email: "ralph@gmail.com",
            password: "mypassword",
            hobbyInfo: "mypassword",
            showInterest: true
        });
        // return {message: "Registration Failed"};
    }catch(e){
        console.log(e);
        // return {message: "Registration Success"};
    }

}

export async function deleteAllUsers(){
    try{
        mongoClient.db('hitmygift').collection('users').deleteMany({});
    }catch(e){
        console.log(e);
    }
}