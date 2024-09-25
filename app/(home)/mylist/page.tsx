'use client'

import MyListLeftSection from "./_components/MyListLeftSection"
import MyListRightSection from "./_components/MyListRightSection"

export default function MyListPage(){
    return (
        <div className="w-screen h-screen flex">
           <div className="w-72">
            <MyListLeftSection/>
           </div>
           <div className="flex-1 ">
            <MyListRightSection/>
           </div>
        </div>
    )
}