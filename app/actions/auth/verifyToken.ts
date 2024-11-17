'use server'

import jwt from 'jsonwebtoken';

export default async function verifyToken(token: string){
    const secret = process.env.JWT_SECRET || ''; 
    try{
        const decoded = jwt.verify(token, secret); // Verify the token using the secret

    }catch(e){
        return {
            status: 400
        }
    }

    return {
        status: 200
    }
}