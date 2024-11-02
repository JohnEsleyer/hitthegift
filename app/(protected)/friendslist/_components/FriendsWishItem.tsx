"use client";

import { EmptyItem } from "@/components/EmptyItem";
import {
  updateFriendId,
  updateProfileImageUrl,
} from "@/lib/features/insideFriend";
import { RootState } from "@/lib/store";
import { ProductType } from "@/lib/types/products";
import Avvvatars from "avvvatars-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface FriendsProducts {
  friendId: string;
  friendFirstName: string;
  friendImageURL: string;
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
    dispatch(updateProfileImageUrl(friendProduct.friendImageURL));
  };

  useEffect(() => {
    if (friendProduct.products) {
      setProducts(friendProduct.products);
    }
  }, []);

  return (
    <a href={"/insidefriend"} onClick={handleClick}>
      <div
        style={{ width: 200, height: 250 }}
        className="relative p-4 rounded-xl bg-white border border-slate-300"
      >
        {products.length > 0 ? (
          <div >
            <img className="border border-gray-200 rounded-2xl" height={150} width={150} src={products[0].imageUrl} alt={products[0].imageUrl} />
          </div>
        ) : (
          <EmptyItem width={165} height={150}/>
        )}
        <span className="text-xs flex justify-center mt-2">
          {friendProduct.friendFirstName}
          {"'s"} wish list
        </span>
        <div className="flex justify-center ">
          {friendProduct.friendImageURL == "" ? (
            <Avvvatars value={friendProduct.friendFirstName} />
          ) : (
            <img
              width={40}
              height={40}
              alt={friendProduct.friendImageURL}
              src={friendProduct.friendImageURL}
              className="rounded-full border"
            />
          )}
        </div>
        <div
          style={{ bottom: 80, right: 10 }}
          className="absolute bg-white p-2 rounded-2xl shadow-md font-bold"
        >
          {friendProduct.products.length} items
        </div>
      </div>
    </a>
  );
}
