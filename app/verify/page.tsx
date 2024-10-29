'use client'
 
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import {useRouter} from 'next/navigation';
import verifyVerificationToken from '../actions/email/verifyVerificationToken';
import Image from 'next/image';
import giftloading from '/public/giftloading.svg';
import { useDispatch } from 'react-redux';
import { updateUserVerificationToken, updateUserVerified } from '@/lib/features/userData';

// Example Query: domain.com/verify?token=8723hud&email=johndoe@gmail.com

// If a newly registered user clicks on the url from their email, they will get redirected to this page
// Newly registered users are expected to have a verificationToken that is greater than 0.
// This page is accessible even when the user is not signed in. 


function Search() {
  const router = useRouter();
  const dispatch = useDispatch();
  
  const searchParams = useSearchParams();
  const verificationToken = searchParams.get('token');
  const email = searchParams.get('email');
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    console.log('Executing useEffect');
    const verify = async () => {
      if (email && verificationToken) {

        if (verificationToken == 'none'){
          router.push('/mylist')
          return;
        }
        // Verify verification token
        const res = await verifyVerificationToken(verificationToken, email);
        if (res.status == 200) {
          console.log('Success');
          setIsVerified(true);
          dispatch(updateUserVerified(true));
          dispatch(updateUserVerificationToken('none'));
        } else {
          console.log(`Failed: status code ${res.status} ${res.message}`);
          setIsVerified(false);
          router.push('/mylist');
        }
      } else {
        console.log('no query parameters given');
        setIsVerified(false);
        router.push('/login');
      }
    };
  
    verify();
  }, []);
  

  return (
    <div className="w-screen h-screen flex items-center justify-center">  
      {isVerified ? 
      <div className="flex flex-col items-center justify-center min-h-screen bg-green-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Congratulations!
        </h1>
        <p className="text-lg text-gray-700">
          Your email address has been successfully verified.
        </p>
        <p className="mt-2 text-gray-600">
          Thank you for confirming your email. You can now access all the features of your account.
        </p>
        <button
          className="mt-6 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          onClick={() => window.location.href = '/mylist'}
        >
          Go to Your Wish list
        </button>
      </div>
    </div> : 
      <Image src={giftloading} alt="" width={50} height={50}/>}
    </div>
  )
}
 
export default function Searchbar() {
  return (
    <Suspense>
      <Search />
    </Suspense>
  )
}