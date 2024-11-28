"use client";

import UserProfileImage from "@/components/UserProfileImage";
import {
  updateFriendId,
} from "@/lib/features/insideFriend";
import { ProductType } from "@/lib/types/products";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from 'next/image';
import emptyItem from '/public/emptyItem.png';

interface FriendsProducts {
  friendId: string;
  friendFirstName: string;
  products: ProductType[];
}

interface FriendWishItemProps {
  friendProduct: FriendsProducts;
}

export default function FriendsWishItem({
  friendProduct,
}: FriendWishItemProps) {
  const dispatch = useDispatch();
  const [products, setProducts] = useState<ProductType[]>([]);

  const handleClick = () => {
    dispatch(updateFriendId(friendProduct.friendId));
  };

  useEffect(() => {
    if (friendProduct.products) {
      setProducts(friendProduct.products);
    }
  }, []);

  return (
    <a href={"/insidefriend"} onClick={handleClick}>
      <div
        style={{ width: 167, height: 245 }}
        className="relative p-2 border border-[#d9d9d9] bg-white rounded"
      >
        {products.length > 0 ? (
          <div >
            <img className=" border border-gray-200 rounded-2xl" height={150} width={150} src={products[0].imageUrl} alt={products[0].imageUrl} />
          </div>
        ) : (
          // <EmptyItem width={165} height={150}/>
          <Image className=" bg-[#E3E3E3]" alt="" src={emptyItem} width={165} height={150}/>
        )}
        <span className="text-xs flex justify-center mt-2">
          {friendProduct.friendFirstName}
          {"'s"} wish list
        </span>
        <div className="flex justify-center mt-2">
         <UserProfileImage userId={friendProduct.friendId} userName={friendProduct.friendFirstName} width={40} height={40} alt={""} />
        </div>

      </div>
    </a>
  );
}
