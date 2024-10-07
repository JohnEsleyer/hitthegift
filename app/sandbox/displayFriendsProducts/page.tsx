'use client'


import getFriendsProducts from "@/app/actions/products/getFriendsProducts";
import { getUserProducts } from "@/app/actions/products/getUserProducts";
import getAllFriends from "@/app/actions/user/getAllFriends";
import { RootState } from "@/lib/store";
import { ProductType } from "@/lib/types/products";
import { useEffect, useState, useTransition } from "react";
import { useSelector } from "react-redux";


interface FriendsProducts {
    friendId: string;
    friendFirstName: string;
    friendImageURL: string;
    products: ProductType[];
}

export default function DisplayFriendsProducts(){
    const [isPending, startTransition] = useTransition();
    const userId = useSelector((state: RootState) => state.userData.id);
    const [products, setProducts] = useState<FriendsProducts[]>([]);

    useEffect(() => {
        startTransition(async () => {
            console.log('Start transition');
            const results = await getFriendsProducts(userId);
            console.log(`status: ${results}`);
            if (results){
                setProducts(results.data || []);
            }
           
        });
    }, []);

    return (
        <div>
        {isPending ? (
          <div>Loading...</div>
        ) : (
          <div>
            {products.map((product, friendIndex) => (
              <div key={product.friendId}>
                <p>Friend {friendIndex + 1}: {product.friendId} {product.friendFirstName}</p>
                {product.products.length > 0 ? (
                  product.products.map((prod, prodIndex) => (
                    <p key={prodIndex}>
                      {prodIndex + 1}. {prod.title ? prod.title : 'No title available'}
                    </p>
                  ))
                ) : (
                  <p>No products found for this friend.</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
    )
}