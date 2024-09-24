'use client'

import HomeLeftSection from "./_components/HomeLeftSection"
import HomeRightSection from "./_components/HomeRightSection"

export default function HomePage(){
    return (
        <div className="w-screen h-screen flex">
            <HomeLeftSection/>
            <HomeRightSection/>
        </div>
    )
}