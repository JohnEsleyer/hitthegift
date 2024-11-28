"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import verifyVerificationToken from "../actions/email/verifyVerificationToken";
import Image from "next/image";
import giftloading from "/public/giftloading.svg";
import { useDispatch } from "react-redux";
import {
  updateUserVerificationToken,
  updateUserVerified,
} from "@/lib/features/userData";
import { CheckCircle } from "lucide-react";
import { navigateTo } from "../actions/navigateTo";
import Cookies from "js-cookie"; 

// Example Query: domain.com/verify?token=8723hud&email=johndoe@gmail.com

// If a newly registered user clicks on the url from their email, they will get redirected to this page
// Newly registered users are expected to have a verificationToken that is greater than 0.
// This page is accessible even when the user is not signed in.

function Search() {
  const dispatch = useDispatch();

  const searchParams = useSearchParams();
  const verificationToken = searchParams.get("token");
  const email = searchParams.get("email");
  const [isVerified, setIsVerified] = useState(false);
  useEffect(() => {

    const verify = async () => {
      if (email && verificationToken) {
        if (verificationToken == "none") {
          // router.push("/login");
          navigateTo('/login');
          return;
        }
        // Verify verification token
        const res = await verifyVerificationToken(verificationToken, email);
        if (res.status == 200) {
          setIsVerified(true);
          dispatch(updateUserVerified(true));
          dispatch(updateUserVerificationToken("none"));
          navigateTo('/login');
        } else {
          console.log(`Failed: status code ${res.status} ${res.message}`);
          setIsVerified(false);
          // router.push("/login");
          navigateTo("/login");
        }
      } else {
        console.log("no query parameters given");
        setIsVerified(false);
        // router.push("/login");
        navigateTo("/login");
      }
    };

    verify();
    Cookies.remove('token');
    Cookies.remove('rememberMe');

  }, []);
  return (
   <div></div>
  );
}

export default function Searchbar() {
  return (
    <Suspense>
      <Search />
    </Suspense>
  );
}
