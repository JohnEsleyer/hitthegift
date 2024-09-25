'use client'


export default function FriendsListRightSection(){
    
    const WishItem = () => {
        return (
            <div className="p-2 rounded border border-slate-300 w-32">
                <div className="h-40 bg-slate-300">
                    
                </div>
                <span className="text-xs flex justify-center mt-2">Ruben{"'s"} wishlist</span>
            </div>
        )
    }
    
    
    return (
        <div className="w-full">
            {/**Search bar */}
            <div className="mt-12 p-4 rounded-full bg-slate-200 w-64">
                <span>Friend{"'s"}s name</span>
            </div>
            <div className="pt-4 flex flex-wrap gap-2">
                    <WishItem/>
                    <WishItem/>
                    <WishItem/>
                    <WishItem/>
                </div>
        </div>
    );
}
