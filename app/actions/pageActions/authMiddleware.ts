// authMiddleware.ts
import { usePathname } from "next/navigation"; // No longer needed here
import Cookies from "js-cookie"; 
import verifyToken from "@/app/actions/auth/verifyToken";
import { useDispatch, useSelector } from "react-redux"; // No longer needed here
import { RootState } from "@/lib/store"; // No longer needed here
import { navigateTo } from "@/app/actions/navigateTo";
import getUserInfo from "@/app/actions/user/getUserInfo";
import { updateUserVerified } from "@/lib/features/userData";

export default async function authMiddleware(
  pathname: string, 
  isVerified: boolean, 
  dispatch: any, 
  userId: string
) { 
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
        navigateTo('/verify-email');
      }
    } catch(e){
      console.error(e);
      navigateTo('/login');
    }
  }

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
          navigateTo('/login');
        }
      }
    } else {
      if (!publicRoutes.includes(pathname) && pathname !== '/login'){
        navigateTo('/login');
      }
    }
  } catch(e){
    console.error(e);
  } 
}