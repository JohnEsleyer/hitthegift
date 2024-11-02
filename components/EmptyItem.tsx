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
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        className="border rounded-xl bg-slate-100"
      >
        <Gift color="#7d7d7d" />
    </div>
    )
}
