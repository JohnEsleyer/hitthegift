import { useEffect, useState } from "react";

interface WindowSize{
    width: number ;
    height: number ;
}

export const useWindowSize = (): WindowSize => {
    const [windowSize, setWindowSize] = useState<WindowSize>({
        width: 500,
        height:500,
    });


    useEffect(() => {
         // Only run on the client side
    if (typeof window !== "undefined") {
        const handleResize = () => {
          setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
          });
        };
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
      }
    },[]);
    return windowSize;
}