'use client'
import {FormEvent, useState, useTransition} from 'react';
import { createUserAction } from '../actions/auth/createUser';
import { UserData } from '@/lib/types/authTypes';
import { termsAndConditions } from './constants';
import { useRouter } from 'next/navigation';
import Loading from '/public/loading.svg';
import Image from 'next/image';

export default function RegisterPage() {
  const router = useRouter();

  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showTermsNConditions, setShowTermsNConditions] = useState<boolean>(false);
  const [didReadTerms, setDidReadTerms] = useState<boolean>(false);
  const [responseMessage, setResponseMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<UserData>({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      hobbyInfo: '',
      birthday: '',
      showInterest: true,

  });

  const handleSubmit = async () => {
    setIsLoading(true);

    const registerUser = async () => {
      const response = await createUserAction({
        firstName: userData?.firstName as string,
        lastName: userData?.lastName as string,
        email: userData?.email as string,
        password: userData?.password as string,
        hobbyInfo: userData?.hobbyInfo as string,
        birthday: userData?.birthday as string,
        showInterest: userData?.showInterest as boolean
      });
      if (response){
        setResponseMessage(response.message);
        setTimeout(()=>{
          setIsLoading(false);
        
          router.push('/mylist');
        }, 3000);
       
      }
      
    }


      registerUser();



  }
  
  return (
    <div>
      {/*Terms and conditions */}
      {showTermsNConditions && <div 
        style={{zIndex: 100, position: 'absolute'}}
        className="flex justify-center items-center w-screen h-screen"
        >
       <div style={{width: 500, height: 600}} className="p-4 bg-white rounded-2xl border-2 border-black">
          <p className="text-2xl font-bold">Terms and conditions</p>
          <div style={{height: 500}} className='overflow-auto '>
            <p>{termsAndConditions}</p>
            <div className="flex justify-center">
          <button onClick={() => {setShowTermsNConditions(false)}} className="flex justify-center bg-blue-600 p-2 text-white font-bold rounded mt-4">Read</button>
          </div>
          </div>
          
       </div>
      </div>}
    <div 
      style={{zIndex: 1, position: 'relative'}}
      className=" flex flex-col items-center justify-center w-screen h-screen ">
      <div className="gap-4 p-4 flex flex-col border border-black rounded-2xl">
        <div className="flex gap-2">
          {/*Name */}
          <label>Name:</label>
          <input
            className="border-2 border-black rounded"
            type="text"
            placeholder="First Name"
            onChange={(e) => {
              setUserData((prev) => (
                {
                  ...prev,
                  firstName: e.target.value
                }
              ));
            }}
            required
          />
          {/*Last Name */}
          <label>Last Name:</label>
          <input
            className="border-2 border-black rounded"
            type="text"
            placeholder="Last Name"
            onChange={(e) => {
              setUserData((prev) => (
                {
                  ...prev,
                  lastName: e.target.value,
                }
              ));
            }}
            required
          ></input>
        </div>
        <div>
          {/*Email */}
          <label>Email:</label>
          <input
            className="border-2 border-black rounded"
            type="text"
            placeholder="firstname@email.com"
            onChange={(e) => {
              setUserData((prev) => (
                {
                  ...prev,
                  email: e.target.value
                }
              ));
            }}
            required
          />
        </div>
        <div>
          {/*Password */}
          <label>Password:</label>
          <input
            className="border-2 border-black rounded"
            type="password"
            placeholder="*******"
            onChange={(e) => {
              setUserData((prev) => (
                {
                  ...prev,
                  password: e.target.value
                }
              ));
            }}
            required
          />
        </div>
        <div>
          {/*Confirm Password */}
          <label>Confirm Password:</label>
          <input
            className="border-2 border-black rounded"
            type="password"
            placeholder="*******"
            onChange={(e) => {
             setConfirmPassword(e.target.value);
            }}
            required
          />
        </div>
        {/**Date of Birth and Toggle On/Off */}
        <div className="flex gap-4 ">
          <div className="flex flex-col">
            <label>Date of Birth</label>
            <input type="date" onChange={(e) => {
              setUserData((prev) => (
                {
                  ...prev,
                  birthday: prev.birthday,
                }
              ))
            }}/>
          </div>
          <div className="flex flex-col">
            <div className="flex gap-2">
              <span>On/Off</span>
              <input type="checkbox" onChange={(e) => {
                setUserData((prev) => ({
                  ...prev,
                  showInterest: e.target.checked,
                }));
              }}/>
      
            </div>
            <p>You want your friends to see your interests</p>
          </div>
        </div>
        {/** Hobbies and interests **/}
        <div>
          <span>Hobbies and interests</span>
          <div>
            <textarea 
              className="border border-black" 
              onChange={(e) => {
                setUserData((prev) => ({
                  ...prev,
                  hobbyInfo: e.target.value,
                }))
              }}
            
            ></textarea>
          </div>
        </div>
        {/**Checkbox for Terms and Conditions */}
        <div>
          <div className="flex gap-1">
          <input 
            type="checkbox" 
            checked={didReadTerms} 
            onChange={(e) => {
              setDidReadTerms(e.target.checked);
            }} 
            required/>
          <p>
            I have read and accept the terms and conditions for this page.
          </p>
          </div>
          <button onClick={() => {
            setShowTermsNConditions(true);
          }} className="text-blue-600 underline">
            Read terms and conditions
          </button>
          

        </div>
        {/** Buttons */}
        <div className="flex gap-4 justify-center">
          <button onClick={handleSubmit} className="bg-blue-500 pl-2 pr-2 rounded text-white">
            Create
          </button>
          <button className="bg-black pl-2 pr-2 rounded text-white">
            Cancel
          </button>
        </div>
        <div className="flex justify-center h-8">
        {isLoading && <Image
          src={Loading}
          height={50}
          width={50}
          alt=''
        />}
        <p>{responseMessage}</p>
        
        </div>
      </div>
      
    </div>
    </div>
  );
}
