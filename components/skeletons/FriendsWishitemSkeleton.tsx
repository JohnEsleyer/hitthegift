'use client'
import Image from 'next/image';
import giftloading from '/public/giftloading.svg';

export default function FriendsWishItemSkeleton(){
    return (
        <a href="#">
  <div
    style={{ width: 200 }}
    className="p-4 rounded-xl border border-slate-300 bg-white"
  >
    {/* Skeleton for the image section */}
    <div style={{ height: 150 }} className="bg-gray-300 animate-pulse flex justify-center items-center">
        {/* <Image
            src={giftloading}
            width={50}
            height={50}
            alt=""
        /> */}
    </div>

    {/* Skeleton for the text */}
    <div className="mt-2">
      <div className="h-4 bg-gray-300 w-3/4 mx-auto animate-pulse"></div>
    </div>

    {/* Skeleton for the avatar */}
    <div className="flex justify-center mt-4">
      <div className="w-12 h-12 rounded-full bg-gray-300 animate-pulse"></div>
    </div>
  </div>
</a>
    )
}