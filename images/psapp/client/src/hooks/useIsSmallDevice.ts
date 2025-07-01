import { useState, useEffect } from 'react';

export const useIsSmallDevice = (breakpoint: number = 600): boolean => {
  const [isSmallDevice, setIsSmallDevice] = useState(window.innerWidth <= breakpoint);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallDevice(window.innerWidth <= breakpoint);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [breakpoint]);

  return isSmallDevice;
};