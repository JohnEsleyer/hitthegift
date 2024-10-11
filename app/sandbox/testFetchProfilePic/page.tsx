'use client'

import { fetchProfilePicture } from "@/app/actions/s3/fetchProfilePicture";
import { RootState } from "@/lib/store"
import { useEffect, useState, useTransition } from "react";
import { useSelector } from "react-redux"


export default function TestFetchProfilePic(){
    const userId = useSelector((state: RootState) => state.userData.id);
    const [isPending, startTransition] = useTransition();
    const [imageUrl, setImageUrl] = useState('');

    useEffect(()=> {
        startTransition(async ()=>{
            try{
                const res = await fetchProfilePicture(userId);
                if (res){
                    setImageUrl(res.data as string);
                }
            }catch(e: any){
                console.log(e);
            }
        });
    },[]);

    return (
        <div>
            {isPending ? <div className="profile-skeleton" style={{ width: 60, height: 60 }}></div>
             : 
             <div>
                <img className="rounded-full" src={imageUrl} width={60} height={60}/>
            </div>}
        </div>
    )
}