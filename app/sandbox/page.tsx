'use client'

import RenderClientOnly from "@/components/utilityComponents/RenderClientOnly";
import { RootState } from "@/lib/store"
import { useSelector } from "react-redux";

export default function Sandbox(){
    const userId = useSelector((state: RootState) => state.userData.id);

    return <RenderClientOnly loading={<div></div>}><div>v1.0.2 {userId}</div></RenderClientOnly>
}