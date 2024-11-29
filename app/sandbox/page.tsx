'use client'

import RenderClientOnly from "@/components/utilityComponents/RenderClientOnly";

import Image from 'next/image';
import logo from '/public/logo.svg';

export default function Sandbox(){


    return <RenderClientOnly loading={<div></div>}>
        <div>v1.0.5</div>
        <Image src={logo} alt="logo" width={100} height={100}/>
        <div className="bg-green-300">
        <img className="" src={`https://imageassets-hitmygift.${process.env.NEXT_PUBLIC_SPACES_CDN_ENDPOINT}/logo.png`} alt={"profile"} width={200} height={200}/> 
        </div>
    </RenderClientOnly>
}