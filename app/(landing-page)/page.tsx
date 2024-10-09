'use client'

import AuthMiddleware from "@/components/AuthMiddleware";

export default function Home() {
  return (
    <AuthMiddleware>
   <div>
     HitTheGift Landing Page
   </div>
   </AuthMiddleware>
  );
}
