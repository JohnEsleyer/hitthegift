'use client'

import '@/styles/skeletons.css';

export default function FriendProfileSkeleton(){
    return (
      <div className="p-2 flex flex-col gap-4 bg-white rounded-2xl m-2">
    <div className="flex p-2">
      <div className="flex items-center">
        {/* Profile Image Placeholder */}
        <div className="animate-pulse rounded-full bg-gray-200 h-12 w-12"></div>
      </div>
      <div className="p-2">
        {/* Name and Email Placeholders */}
        <div className="animate-pulse bg-gray-200 h-4 w-24 mb-2"></div>
        <div className="animate-pulse bg-gray-200 h-4 w-20"></div>
      </div>
    </div>
    {/* "Interests and Hobbies" Header Placeholder */}
    <div className="animate-pulse bg-gray-200 h-4 w-48"></div>
    <div style={{ height: 120, width: 250 }} className="shadow-md overflow-auto rounded-2xl p-2">
      {/* Hobbies Info Placeholders */}
      <div className="animate-pulse bg-gray-200 h-4 w-36 mb-2"></div>
      <div className="animate-pulse bg-gray-200 h-4 w-40 mb-2"></div>
      <div className="animate-pulse bg-gray-200 h-4 w-28 mb-2"></div>
      <div className="animate-pulse bg-gray-200 h-4 w-32"></div>
    </div>
    <div style={{ height: 100 }}></div>
    {/* "Shared With" Header Placeholder */}
    <div className="animate-pulse bg-gray-200 h-4 w-64"></div>
    <div className="flex mt-2">
      {/* Friends List Placeholders */}
      <div className="animate-pulse rounded-full bg-gray-200 h-6 w-6 mr-2"></div>
      <div className="animate-pulse rounded-full bg-gray-200 h-6 w-6 mr-2"></div>
      <div className="animate-pulse rounded-full bg-gray-200 h-6 w-6"></div>
    </div>
  </div>
    );
}