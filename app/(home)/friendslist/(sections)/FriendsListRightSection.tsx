'use client'

import getFriendsProducts from "@/app/actions/products/getFriendsProducts";
import { RootState } from "@/lib/store";
import { ProductType } from "@/lib/types/products";
import { useTransition, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import FriendsWishItem from "../_components/FriendsWishItem";


interface FriendsProducts {
    friendId: string;
    friendFirstName: string;
    friendImageURL: string;
    products: ProductType[];
}


export default function FriendsListRightSection(){
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
        <div className="w-full">
            {/**Search bar */}
                <input
                    className="mt-12 p-4 rounded-full bg-slate-200 w-64" 
                    placeholder={`Friend's name`}/>
            <div className="pt-4 flex flex-wrap gap-2">
                    {
                        isPending ? 
                        (<div>Loading...</div>) 
                        : <div className="flex flex-wrap gap-2 ">
                            {
                                products.map((product, friendIndex) => (
                                    <FriendsWishItem key={product.friendId} friendProduct={product}/>
                                ))
                            }
                        </div>
                    }
                    

                </div>
        </div>
    );
}
