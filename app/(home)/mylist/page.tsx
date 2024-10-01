'use client'

import RenderClientOnly from "@/components/utilityComponents/RenderClientOnly"
import MyListLeftSection from "./(sections)/MyListLeftSection"
import MyListRightSection from "./(sections)/MyListRightSection"
import Image from 'next/image';
import Loading from '/public/loading.svg';
import Friends from '/public/friends.png';

export default function MyListPage(){
    return (
        <div className="w-screen h-screen flex">
        <RenderClientOnly loading={
            <div className="flex w-full justify-center items-center">
                <Image src={Loading} alt='' className="w-8 h-8"/>
            </div>
        }>
           <div className="w-72">
            <MyListLeftSection/>
           </div>
           <div className="flex-1 ">
            <MyListRightSection/>
           </div>
           <div className="flex justify-end items-center">
           <div className="p-2 pr-4 text-white">
            <button className="bg-blue-500 p-2 border rounded-2xl rounded-r-lg ">
                <Image 
                    alt=""
                    width={30}
                    src={Friends}
                />
            </button>            

           </div>
           </div>
        </RenderClientOnly>
        </div>
    )
}