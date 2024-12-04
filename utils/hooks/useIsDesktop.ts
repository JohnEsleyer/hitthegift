
import { useState, useEffect } from 'react';

const useIsDesktop = (breakpoint: number = 768): boolean => {
  const [isDesktop, setIsDesktop] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= breakpoint;
    }
    return false; // Default value for server-side rendering
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(min-width: ${breakpoint}px)`);

    const updateIsDesktop = () => setIsDesktop(mediaQuery.matches);

    // Set the initial value
    updateIsDesktop();

    // Add event listener for changes
    mediaQuery.addEventListener('change', updateIsDesktop);

    // Cleanup on unmount
    return () => mediaQuery.removeEventListener('change', updateIsDesktop);
  }, [breakpoint]);

  return isDesktop;
};

export default useIsDesktop;
