'use client'

import { updateFriendId } from "@/lib/features/friendlist";
import { ProductType } from "@/lib/types/products";
import Avvvatars from "avvvatars-react";
import { useDispatch } from "react-redux";

interface FriendsProducts {
    friendId: string;
    friendFirstName: string;
    friendImageURL: string;
    products: ProductType[];
}

interface FriendWishItemProps {
    friendsProduct: FriendsProducts;
}

export default function FriendsWishItem({friendsProduct} : FriendWishItemProps){
    const dispatch = useDispatch();
    
    const handleClick = () => {
        // friendsProduct.
        // dispatch(updateFriendId(friendsProduct.friendId));
    }

    return (
        <a href={'/friendlist'} onClick={handleClick}>
        <div
            style={{width: 200}}
            className="p-4 rounded-xl border border-slate-300">
            <div style={{height: 150}} className=" bg-slate-300">
            </div>
            <span className="text-xs flex justify-center mt-2">{friendsProduct.friendFirstName}{"'s"} wish list</span>
            <div className="flex justify-center ">
                <Avvvatars value={friendsProduct.friendFirstName} />
            </div>

        </div></a>
    )
}