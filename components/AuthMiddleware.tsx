"use client";

import { useEffect, ReactNode, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import jwt from "jsonwebtoken";
import Cookies from "js-cookie"; // You'll need js-cookie package to get cookies on the client side
import verifyToken from "@/app/actions/auth/verifyToken";
import Image from 'next/image';
import giftloading from '/public/giftloading.svg';


// Middleware Component that wraps the content
interface AuthMiddlewareProps {
  children: ReactNode; // The component/page to wrap
}

export default function AuthMiddleware({ children }: AuthMiddlewareProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    async function checkToken() {
      const publicRoutes = ["/login", "/register", "/sandbox"]; // Define public routes

      // If the route is public, no need to verify the token
      if (publicRoutes.includes(pathname)) {
        setIsAuthenticated(true);
        return;
      }

      const token = Cookies.get("token"); // Get token from cookies
      console.log(`Client-side token check: ${token}`);

      if (!token) {
        // If no token is found, redirect to login
        router.push("/login");
        return;
      }

        // Verify the token on the server

        const res = await verifyToken(token);

        if (res.status == 200){
            // Token is valid, allow access to the wrapped page
            setIsAuthenticated(true);
        }else{
            console.log("Token Verification Failed:");
            // If verification fails, redirect to login
            router.push("/login");
        }
        
      
    }
    checkToken();
  }, [router]);

  // While the authentication check is happening, you can show a loading state
  if (!isAuthenticated) {
    return <div className="h-screen w-screen flex justify-center items-center">  <Image
    src={giftloading}
    alt=""
    width={50}
    height={50}
  /></div>;
  }

  // If authenticated, render the wrapped component
  return <div>{children}</div>;
}
