'use client'

import { getUserProducts } from "@/app/actions/products/getUserProducts";
import WishItem from "@/components/WishItem";
import { RootState } from "@/lib/store";
import { ProductType } from "@/lib/types/products";
import { useEffect, useState, useTransition } from "react";
import { useSelector } from "react-redux";


export default function InsideFriendRightSection(){
    const [products, setProducts] = useState<ProductType[]>([]);
    const [isProductsPending, startProductsTransition] = useTransition();
    const friendId = useSelector((state: RootState) => state.insideFriend.friendId);

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
                <div style={{marginLeft: 30}} className="pt-12">
                {isProductsPending ? <div>Loading...</div> : <div className="pt-4 flex flex-wrap gap-2">
                    {products.map((product) => (
                        <WishItem 
                         key={product.id}
                         productName={product.title}
                         description={product.description}
                         price={product.price}
                         productUrl={product.productUrl}
                         showBuyButton={true}
                        /> 
                    ))}
                </div>}
                </div>
        </div>
    );
}
