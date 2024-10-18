'use client'

import Avvvatars from "avvvatars-react";
import { useState } from "react";

interface UserProfileImageProps{
    userId: string;
    userName: string;
    width: number;
    height: number;
    alt: string;
}

export default function UserProfileImage({userId,userName ,width, height, alt}: UserProfileImageProps){
    const bucketName = 'profile-hitmygift';
    const [hasError, setHasError] = useState(false);
    
    const handleError = () => {
        setHasError(true);
    }

    return hasError? (
        <div>
            <Avvvatars value={userName} size={width}/>
        </div>
    ) : (
        <img className="border rounded-full " src={`https://${bucketName}.${process.env.NEXT_PUBLIC_SPACES_CDN_ENDPOINT}/${userId}.webp`} alt={alt} width={width} height={height} onError={handleError}/>

    )
}

