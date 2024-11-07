"use client";

import { useState } from "react";

export default function Sandbox() {
  const [autoFill, setAutoFill] = useState(true);
  return (
    <div className="h-screen w-screen">
    <label className="switch">
      <input
        type="checkbox"
        checked={autoFill} // Use checked to reflect the state
        onChange={(e) => {
          console.log(`Autofill: ${e.target.checked}`);
          setAutoFill(e.target.checked); // Directly set the state from the checkbox
        }}
      />
      <span className="slider round"></span>
    </label>
    <div>{autoFill ? 'on' : 'off'}</div> {/* Show "on" or "off" */}
  </div>
  );
}
