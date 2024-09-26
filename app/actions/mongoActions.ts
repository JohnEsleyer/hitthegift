'use server'

import { mongoClient } from "@/lib/mongodb";
import { UserData } from "@/lib/types/userdata";



export async function createUserAction(data: UserData){

    console.log(data.firstName);
    console.log(data.email);

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
        return {message: "Registration Success", status:500};
    }catch(e){
        console.log(e);
        return {message: "Registration Failed", status:200};
    }

}

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