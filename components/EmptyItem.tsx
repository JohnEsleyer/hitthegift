'use client'

import { Gift } from "lucide-react";

interface EmptyItemProps{
    width: number;
    height: number;
}

export function EmptyItem({width, height}: EmptyItemProps){
    return (
        <div
        style={{
          width: width,
          height: height,
          backgroundColor: '#e0e0e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        className="border rounded-xl"
      >
        <Gift color="#7d7d7d" />
    </div>
    )
}
