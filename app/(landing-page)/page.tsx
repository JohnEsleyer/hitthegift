'use client'

import AuthMiddleware from "@/components/AuthMiddleware";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();


  useEffect(()=>{
    router.push('/login');
  },[]);

  return (

   <div>


   </div>

  );
}
