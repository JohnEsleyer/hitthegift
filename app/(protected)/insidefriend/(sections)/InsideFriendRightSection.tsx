"use client";

import { getUserProducts } from "@/app/actions/products/getUserProducts";
import WishItem from "@/components/WishItem";
import { RootState } from "@/lib/store";
import { ProductType } from "@/lib/types/products";
import { useEffect, useState, useTransition } from "react";
import { useSelector } from "react-redux";

import WishItemSkeleton from "@/components/skeletons/WishItemSkeleton";


export default function InsideFriendRightSection() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [isProductsPending, startProductsTransition] = useTransition();
  const friendId = useSelector(
    (state: RootState) => state.insideFriend.friendId
  );
  const friendName = useSelector((state: RootState) => state.insideFriend.friendName);


  useEffect(() => {
    startProductsTransition(async () => {
      const results = await getUserProducts(friendId);
      console.log(`status: ${results.message}`);
      if (results) {
        setProducts(results.data || []);
      }
    });
  }, []);

  return (
    <div className="w-full">
      <div style={{ marginLeft: 30 }} className="pt-12 h-screen">
        {isProductsPending ? (
          <div className="flex flex-wrap gap-8 h-full">
          <WishItemSkeleton />
          <WishItemSkeleton />
          <WishItemSkeleton />
          <WishItemSkeleton />
          <WishItemSkeleton />
          <WishItemSkeleton />
        </div>
        ) : (
          <div>

          {products.length > 0 ? <div className="pt-4 flex flex-wrap gap-2">
            {products.map((product) => (
              <WishItem
                key={product.id}
                id={product.userId}
                currency={product.currency}
                title={product.title}
                description={product.description}
                price={product.price}
                productUrl={product.productUrl}
                showBuyButton={true}
                imageUrl={product.imageUrl}
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
