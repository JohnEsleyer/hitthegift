'use client'
import '@/styles/skeletons.css';

import React from 'react';

interface CircleSkeletonProps {
  height: number;
  width: number;
}

export function CircleSkeleton({ height, width }: CircleSkeletonProps){
  return (
    <div
      className="bg-gray-300 rounded-full"
      style={{
        height: height,
        width: width,
        animation: 'pulse 1s linear infinite',
      }}
    ></div>
  );
};
