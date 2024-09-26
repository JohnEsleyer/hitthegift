import { mongoClient } from '@/lib/mongodb';

type RequestData = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    hobbyInfo: string;
    showInterest: boolean;
}

export async function POST(
    req: Request,
){
    const body: RequestData = await req.json();

    try{
        const db = mongoClient.db('hitmygift');
        db.collection('users').insertOne({
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            password: body.password,
            hobbyInfo: body.hobbyInfo,
            showInterest: body.showInterest
        });
    }catch(e){
        console.log(e);
        Response.json({message:"Registration failed"});
    }

    return Response.json({message: "Successfully registered user"});
}