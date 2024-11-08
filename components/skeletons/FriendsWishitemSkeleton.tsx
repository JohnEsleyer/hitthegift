'use client'

import '@/styles/skeletons.css';

export default function FriendsWishItemSkeleton(){
    return (
      <a href="#">
      <div
        style={{ width: 200 }}
        className="p-4 rounded-xl border border-slate-300 bg-white"
      >
        {/* Skeleton for the image section */}
        <div style={{ height: 150 }} className="bg-[#a3a2a2] animate-pulse flex justify-center items-center"> 
            {/* <Image
                src={giftloading}
                width={50}
                height={50}
                alt=""
            /> */}
        </div>
    
        {/* Skeleton for the text */}
        <div className="mt-2">
          <div className="h-4 bg-[#a3a2a2] w-3/4 mx-auto animate-pulse"></div>
        </div>
    
        {/* Skeleton for the avatar */}
        <div className="flex justify-center mt-4">
          <div className="w-12 h-12 rounded-full bg-[#a3a2a2] animate-pulse"></div>
        </div>
      </div>
    </a>
    )
}