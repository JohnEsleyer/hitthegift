"use client";

import { useState } from "react";
import '@/styles/RGBButton.css';
import '@/styles/GlowingBorder.css';


export default function Sandbox() {
  const handleClick = () => {
    // Handle button click
  };

  return (
    <div>
      <button className="button-85">Press Me</button>
      <div style={{width: 200, height: 40}} className="text-black glowing-border mt-12 border rounded-full">
      <input
                className={`rounded-full p-3 border glowing-border `}
                placeholder={"Product name"}

                onChange={(e) => {
                  //   setTitle(e.target.value);
                  
                }}
              /> 
      </div>
     
    </div>
  );
}
