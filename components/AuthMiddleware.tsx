import { useEffect, ReactNode, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation"; // Import useRouter
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
  const router = useRouter(); // Initialize useRouter
  const isVerified = useSelector((state: RootState) => state.userData.verified);   
  const [isPending, startTransition] = useTransition();
  const dispatch = useDispatch();
  const [initialAuthCheckComplete, setInitialAuthCheckComplete] = useState(false); 

  const userId = useSelector((state: RootState) => state.userData.id);
 

  async function checkEmail(){
    try{
      const res = await getUserInfo(userId);
      if (res.verified){
        dispatch(updateUserVerified(res.verified)); 
      } else {
        if (pathname == '/login' || pathname == '/register'){ 
          return;
        }
        console.log('Failed to fetch user data');
        router.push('/verify-email'); // Use router.push instead of navigateTo
      }
    } catch(e){
      console.error(e);
      router.push('/login'); // Use router.push instead of navigateTo
    }
  }

  useEffect(() => {
    startTransition(async () => {
      const token = Cookies.get("token");  
      const publicRoutes = ["/register", "/sandbox"]; 
      try {
        if (token){
          const res = await verifyToken(token);
          if (res.status == 200){ 
            if (isVerified){
              console.log(`Auth - 2`); 
            } else {
              console.log(`Auth - 3`);
              checkEmail();
            }
          } else {
            if (!publicRoutes.includes(pathname) && pathname !== '/login'){
              router.push('/login'); // Use router.push instead of navigateTo
            }
          }
        } else {
          if (!publicRoutes.includes(pathname) && pathname !== '/login'){
            router.push('/login'); // Use router.push instead of navigateTo
          }
        }
        setInitialAuthCheckComplete(true); // Mark initial check as complete
      } catch(e){
        console.error(e);
      } 
    });
  }, []); 

  // Remove the second useEffect that causes client-side navigation

  if (isPending) {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <Image src={giftloading} alt="" width={50} height={50} />
      </div>
    );
  } else {
    return <div>{children}</div>;
  }  
}