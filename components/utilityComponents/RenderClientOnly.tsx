'use client'

import { ReactNode, useEffect, useState } from "react"

interface RenderClientOnlyProps{
    children: ReactNode;
    loading: ReactNode;
}

export default function RenderClientOnly({children, loading}: RenderClientOnlyProps){
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);


    if (isClient){
        return (
            children
        )
    }


    return (
        loading
    );
}