import { useEffect, ReactNode, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie"; 
import verifyToken from "@/app/actions/auth/verifyToken";
import Image from 'next/image';
import giftloading from '/public/giftloading.svg';
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";
import { navigateTo } from "@/app/actions/navigateTo";
import getUserInfo from "@/app/actions/user/getUserInfo";

interface AuthMiddlewareProps {
  children: ReactNode; 
}

export default function AuthMiddleware({ children }: AuthMiddlewareProps) {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const isVerified = useSelector((state: RootState) => state.userData.verified);   
  const [isPending, startTransition] = useTransition();

  const userId = useSelector((state: RootState) => state.userData.id);

  async function checkEmail(){
    // Check if email is verified
    try{
      const res = await getUserInfo(userId);
      if (res.verified){
        navigateTo(pathname);
      }else{
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
      const rememberMe = Cookies.get("rememberMe") === "true"; // Get rememberMe cookie
      const publicRoutes = ["/register", "/sandbox"]; // Public routes
      try{
      if (token){
        const res = await verifyToken(token);
        if (res.status == 200){
          // Redirect to /mylist if user is in /login and rememberMe and isVerified are true.
          if (pathname == '/login' && rememberMe && isVerified){
            navigateTo('/mylist');
          }else if (pathname !== '/login' && isVerified){
            navigateTo(pathname);
          }else{
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