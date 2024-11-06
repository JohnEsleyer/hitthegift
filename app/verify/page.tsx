"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import verifyVerificationToken from "../actions/email/verifyVerificationToken";
import Image from "next/image";
import giftloading from "/public/giftloading.svg";
import { useDispatch } from "react-redux";
import {
  updateUserVerificationToken,
  updateUserVerified,
} from "@/lib/features/userData";
import { CheckCircle } from "lucide-react";

// Example Query: domain.com/verify?token=8723hud&email=johndoe@gmail.com

// If a newly registered user clicks on the url from their email, they will get redirected to this page
// Newly registered users are expected to have a verificationToken that is greater than 0.
// This page is accessible even when the user is not signed in.

function Search() {
  const router = useRouter();
  const dispatch = useDispatch();

  const searchParams = useSearchParams();
  const verificationToken = searchParams.get("token");
  const email = searchParams.get("email");
  const [isVerified, setIsVerified] = useState(false);
  useEffect(() => {
    const verify = async () => {
      if (email && verificationToken) {
        if (verificationToken == "none") {
          router.push("/mylist");
          return;
        }
        // Verify verification token
        const res = await verifyVerificationToken(verificationToken, email);
        if (res.status == 200) {
          console.log("Success");
          setIsVerified(true);
          dispatch(updateUserVerified(true));
          dispatch(updateUserVerificationToken("none"));
        } else {
          console.log(`Failed: status code ${res.status} ${res.message}`);
          setIsVerified(false);
          router.push("/mylist");
        }
      } else {
        console.log("no query parameters given");
        setIsVerified(false);
        router.push("/login");
      }
    };

    verify();
  }, []);
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      {isVerified ? (
        <div className="w-screen h-screen flex items-center justify-center bg-gray-300 p-4">
        <div className="max-w-lg w-full bg-white shadow-md rounded-2xl p-6 text-center">
          <div className="flex justify-center">
            <div className="bg-blue-500 p-6 rounded-full">
              <CheckCircle size={32} color="white" /> 
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-black mb-4">
            Congratulations!
          </h1>
          <p className="text-gray-700 mb-4">
            Your email address has been successfully verified.
          </p>
          <p className="text-gray-700 mb-6">
            You can now access all the features of your account.
          </p>
          <button
            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-2xl border"
            onClick={() => (window.location.href = "/mylist")}
          >
            Go to Login
          </button> 
          <p className="mt-6 text-gray-500 text-sm">
            Thank you for confirming your email!
          </p>
        </div>
      </div>
      ) : (
        <Image src={giftloading} alt="" width={50} height={50} />
      )}
    </div>
  );
}

export default function Searchbar() {
  return (
    <Suspense>
      <Search />
    </Suspense>
  );
}
