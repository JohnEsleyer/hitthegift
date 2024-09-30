'use client'

import RenderClientOnly from "@/components/utilityComponents/RenderClientOnly"
import MyListLeftSection from "./(sections)/MyListLeftSection"
import MyListRightSection from "./(sections)/MyListRightSection"
import Image from 'next/image';
import Loading from '/public/loading.svg';

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
        </RenderClientOnly>
        </div>
    )
}