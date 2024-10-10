'use client'
import React, { useState } from "react";



export default function Sandbox(){
 return (  
  <div className="skeleton-textarea-wrapper">
      <div className="skeleton-textarea border">
        {/* Adding placeholder lines to simulate text */}
        <div className="skeleton-line"></div>
        <div className="skeleton-line short"></div>
        <div className="skeleton-line"></div>
        <div className="skeleton-line short"></div>
        <div className="skeleton-line"></div>
      </div>
    </div>
)
}