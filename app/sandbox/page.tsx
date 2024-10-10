'use client'
import React, { useState } from "react";



export default function Sandbox(){
  const isSender = true;
  const message = "test";
  return (
    <div className={`chat-container ${isSender ? 'right' : ''}`}>
    <div className={`chat-bubble ${isSender ? 'right' : ''}`}>
      {message}
    </div>
  </div>
  )
}