'use client'

import { useState } from "react";
import Image from 'next/image';
import user from '/public/user.webp';

interface UserProfileImageProps{
    userId: string;
    userName: string;
    width: number;
    height: number;
    alt: string;
}

export default function UserProfileImage({userId, userName ,width, height, alt}: UserProfileImageProps){
    const bucketName = 'profile-hitmygift';
    const [hasError, setHasError] = useState(false);
    
    const handleError = () => {
        setHasError(true);
    }

    return hasError? (
        <div>
            <img className="border rounded-full" src={`https://imageassets-hitmygift.${process.env.NEXT_PUBLIC_SPACES_CDN_ENDPOINT}/user.webp`} alt={"profile"} width={width} height={height}/> 
        </div>
    ) : (
        <img className="border rounded-full " src={`https://${bucketName}.${process.env.NEXT_PUBLIC_SPACES_CDN_ENDPOINT}/${userId}.webp`} alt={alt} width={width} height={height} onError={handleError}/>

    )
}

