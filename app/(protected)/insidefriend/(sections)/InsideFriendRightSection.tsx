"use client";

import { getUserProducts } from "@/app/actions/products/getUserProducts";
import WishItem from "@/components/WishItem";
import { RootState } from "@/lib/store";
import { ProductType } from "@/lib/types/products";
import { useEffect, useState, useTransition } from "react";
import { useSelector } from "react-redux";
import WishItemSkeleton from "@/components/skeletons/WishItemSkeleton";
import { useWindowSize } from "@/utils/hooks/useWindowSize";
import '@/styles/utilities.css';

export default function InsideFriendRightSection() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [isProductsPending, startProductsTransition] = useTransition();
  const friendId = useSelector(
    (state: RootState) => state.insideFriend.friendId
  );
  const friendName = useSelector((state: RootState) => state.insideFriend.friendName);
  const {width, height} = useWindowSize();

  useEffect(() => {
    startProductsTransition(async () => {
      const results = await getUserProducts(friendId);
      if (results) {
        setProducts(results.data || []);
      }

    });
  }, []);

  return (
    <div className="w-full">
      <div style={{ marginLeft: 30,marginTop: 74, height: height-80, width: width-400}}  className=" hide-scrollbar overflow-auto p-2 mb-4 border-t-2 border-gray-400 ">
        {isProductsPending ? (
          <div className=" pl-2 pt-2 flex flex-wrap gap-8 ">
          <WishItemSkeleton />
          <WishItemSkeleton />
          <WishItemSkeleton />
          <WishItemSkeleton />
          <WishItemSkeleton />
          <WishItemSkeleton />
        </div>
        ) : (
          <div>
          {products.length > 0 ? <div className="pl-2 pt-2 flex flex-wrap gap-2">
            {products.map((product) => (
              <WishItem
                key={product.id}
                product={product}
                showBuyButton={true}
                
              />
            ))}
          </div> : <div style={{height: 400}} className="w-full flex justify-center items-center text-gray-300">
              {friendName} has no wish items
            </div>}
          </div>
        )}
      </div>
    </div>
  );
}
