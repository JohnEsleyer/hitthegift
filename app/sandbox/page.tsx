'use client'

import Image from 'next/image';
import giftloading from '/public/giftloading.svg';

export default function Sandbox() {
 return (
  <div>
    <Image
      src={giftloading}
      alt=""
      width={50}
      height={50}
    />
  </div>
 )
 
}
