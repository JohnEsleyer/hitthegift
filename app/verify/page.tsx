'use client'
 
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import {useRouter} from 'next/navigation';
import verifyVerificationToken from '../actions/email/verifyVerificationToken';


// Example Query: domain.com/verify?token=8723hud&email=johndoe@gmail.com

function Search() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const verificationToken = searchParams.get('token');
  const email = searchParams.get('email');
  const [isVerified, setIsVerified] = useState(false);
  const [temp, setTemp] = useState('');

  useEffect(() => {
    setTemp("Hello World");
    console.log('Executing useEffect');
    const verify = async () => {
      setIsVerified(true);
      if (email && verificationToken) {
        // Verify verification token
        const res = await verifyVerificationToken(verificationToken, email);
        if (res.status == 200) {
          console.log('Success');
          setIsVerified(true);
        } else {
          console.log(`Failed: status code ${res.status} ${res.message}`);
          setIsVerified(false);
        }
      } else {
        router.push('/login');
      }
    };
  
    verify();
  }, []);
  

  return (
    <div className="flex flex-col">
    <p>Email: {email}</p>
    <p>Email: ralphpolicarpio513@gmail.com</p>
    <p>Token: {verificationToken}</p>
    <p>Token: 1ceb2f6f5226c9d43b2e8ada67587fbc</p>

    {temp}
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