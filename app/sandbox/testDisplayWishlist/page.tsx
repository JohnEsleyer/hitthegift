'use client'

import { getUserProducts } from "@/app/actions/products/getUserProducts";
import getAllFriends from "@/app/actions/user/getAllFriends";
import { RootState } from "@/lib/store";
import { ProductType } from "@/lib/types/products";
import { useEffect, useState, useTransition } from "react";
import { useSelector } from "react-redux";

export default function testGetFriends(){
    const [isPending, startTransition] = useTransition();
    const userId = useSelector((state: RootState) => state.userData.id);
    const [products, setProducts] = useState<ProductType[]>([]);

    useEffect(() => {
        startTransition(async () => {
            const results = await getUserProducts(userId);
            console.log(`status: ${results.message}`);
            if (results){
                setProducts(results.data || []);
            }
           
        });
    }, []);

    return (
        <div>
            {isPending 
            ?
            <div>Loading...</div>
            : 
            <div>
                {products.map((product) => (
                   <p key={product.id}>{product.title}</p>
                ))}
            </div> 
            }
        </div>
    )
}