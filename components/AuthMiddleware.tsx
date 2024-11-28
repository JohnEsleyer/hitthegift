import { useEffect, ReactNode, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie"; 
import verifyToken from "@/app/actions/auth/verifyToken";
import Image from 'next/image';
import giftloading from '/public/giftloading.svg';
import { RootState } from "@/lib/store";
import { useDispatch, useSelector } from "react-redux";
import { navigateTo } from "@/app/actions/navigateTo";
import getUserInfo from "@/app/actions/user/getUserInfo";
import { updateUserVerified } from "@/lib/features/userData";

interface AuthMiddlewareProps {
  children: ReactNode; 
}

export default function AuthMiddleware({ children }: AuthMiddlewareProps) {
  const pathname = usePathname();
  const isVerified = useSelector((state: RootState) => state.userData.verified);   
  const [isPending, startTransition] = useTransition();

  const userId = useSelector((state: RootState) => state.userData.id);
  const dispatch = useDispatch();
  
  async function checkEmail(){
    // Check if email is verified. If true, let the user continue to the path, otherwise, redirect to /verify-email
    try{
      const res = await getUserInfo(userId);
      if (res.verified){
        dispatch(updateUserVerified(res.verified));
        navigateTo(pathname);
      }else{
        // If path is /login or /register, let the user continue
        if (pathname == '/login' || pathname == '/register'){
          navigateTo(pathname);
          return;
        }
        console.log('Failed to fetch user data');
        navigateTo('/verify-email');
      }
    }catch(e){
      console.error(e);
      navigateTo('/login');
    }
  }

  useEffect(() => {
    startTransition(async () => {
      const token = Cookies.get("token"); 
      const publicRoutes = ["/register", "/sandbox"]; // Public routes
      try{
      if (token){
        const res = await verifyToken(token);
        if (res.status == 200){
          // Redirect to /mylist if user is in /login and rememberMe and isVerified are true.
        
          if (isVerified){
            console.log(`Auth - 2`);
            navigateTo(pathname);
          }else{
            console.log(`Auth - 3`);
           checkEmail();
          }
        }else{
          if (publicRoutes.includes(pathname) || pathname == '/login'){
            navigateTo(pathname);
          }else{
            navigateTo('/login');
          }
        }
      }else{
        if (publicRoutes.includes(pathname) || pathname == '/login'){
          navigateTo(pathname);
        }else{
          navigateTo('/login');
        }
      }
      }catch(e){
        console.error(e);
      } 

    });
    
  }, [pathname]); 


  if (isPending) {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <Image src={giftloading} alt="" width={50} height={50} />
      </div>
    );
  }else{
    return <div>{children}</div>;
  }  
}