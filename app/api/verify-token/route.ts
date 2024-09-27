
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {usePathname} from 'next/navigation';
import jwt from 'jsonwebtoken';

type RequestData = {
    token: string;
};

export default async function verifyJWT(req: Request){
    const data: RequestData =  await req.json();
    const decoded = jwt.verify(data.token, process.env.JWT_SECRET || '');        
    return decoded;
}