'use client'

import getFriendsProducts from "@/app/actions/products/getFriendsProducts";
import { RootState } from "@/lib/store";
import { ProductType } from "@/lib/types/products";
import { useTransition, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import FriendsWishItem from "../_components/FriendsWishItem";
import FriendsWishItemSkeleton from "@/components/skeletons/FriendsWishitemSkeleton";
import { useWindowSize } from "@/utils/hooks/useWindowSize";

interface FriendsProducts {
    friendId: string;
    friendFirstName: string;
    friendImageURL: string;
    products: ProductType[];
}

export default function FriendsListRightSection(){
    const [isPending, startTransition] = useTransition();
    const userId = useSelector((state: RootState) => state.userData.id);
    const [friendsProducts, setFriendsProducts] = useState<FriendsProducts[]>([]);
    const {width, height} = useWindowSize();
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState<FriendsProducts[]>([]);

    useEffect(() => {
        setFilteredProducts((prev) => friendsProducts.filter((friend) => friend.friendFirstName.toLocaleLowerCase().includes(searchTerm.toLowerCase())))
    }, [searchTerm]);

    useEffect(() => {
        startTransition(async () => {
            console.log('Start transition');
            const results = await getFriendsProducts(userId);
            console.log(`status: ${results}`);
            if (results){
                setFriendsProducts(results.data || []);
                setFilteredProducts(results.data || []);
            }            
        });
    }, []);

    return (
        <div className="ml-8 h-screen">
            {/**Search bar */}
                <input
                    style={{height: 40, marginTop: 20, marginBottom: 15}} className="p-4 rounded-full border border-black w-64" 
                    placeholder={`Friend's name`}
                    value={searchTerm}
                    onChange={(e)=>{
                        setSearchTerm(e.target.value);
                    }}
                    />
            <div style={{height: height-75, width: width-400}} className="hide-scrollbar pt-4 flex flex-wrap gap-2 overflow-auto bg-[#dbe4e7] rounded-2xl border border-2 border-black  p-2">
                    {
                        isPending ? 
                        (<div className="pl-2 flex flex-wrap gap-2 ">
                            <FriendsWishItemSkeleton/>
                            <FriendsWishItemSkeleton/>
                            <FriendsWishItemSkeleton/>
                            <FriendsWishItemSkeleton/>
                            <FriendsWishItemSkeleton/>
                            <FriendsWishItemSkeleton/>
                            <FriendsWishItemSkeleton/>
                        </div>) 
                        : <div className="pl-2  w-full h-full">
                            {filteredProducts.length > 0 ? <div className="flex flex-wrap gap-2 justify-start">
                            {
                                filteredProducts.map((product, friendIndex) => (
                                    <FriendsWishItem key={product.friendId} friendProduct={product}/>
                                ))
                            }
                        </div> : <div style={{height: 400}} className="text-gray-400 flex justify-center items-center ">
                            No friends to show
                            </div>}
                        </div>
                    }
                    

                </div>
        </div>
    );
}
