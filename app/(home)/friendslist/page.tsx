'use client'

import FriendsListLeftSection from "./_components/FriendsListLeftSection"
import FriendsListRightSection from "./_components/FriendsListRightSection"


export default function FriendsListPage(){
    return (
        <div className="w-screen h-screen flex">
           <div className="w-72">
            <FriendsListLeftSection/>
           </div>
           <div className="flex-1 ">
            <FriendsListRightSection/>
           </div>
        </div>
    )
}