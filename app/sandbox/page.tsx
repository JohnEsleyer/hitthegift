"use client";

import { Spicy_Rice } from 'next/font/google';


const spicy = Spicy_Rice({
  weight: "400",
  subsets: ['latin']
});


export default function Sandbox() {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-r from-[#661009] to-red-700">
      <p style={{
        fontSize: 60,
        }} className={`${spicy.className} font-bold text-white`}>HitMyGift</p>

    </div>
  );
}
