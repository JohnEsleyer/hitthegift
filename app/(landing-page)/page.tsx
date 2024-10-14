'use client'

import AuthMiddleware from "@/components/AuthMiddleware";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from 'next/image';
import giftloading from '/public/giftloading.svg';

export default function Home() {
  const router = useRouter();


  useEffect(()=>{
    router.push('/login');
  },[]);

  return (

    <div className="h-screen w-screen flex justify-center items-center">  <Image
    src={giftloading}
    alt=""
    width={50}
    height={50}
  /></div>

  );
}
