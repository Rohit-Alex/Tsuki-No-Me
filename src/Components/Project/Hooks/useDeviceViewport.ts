import React, { useState } from "react";
import { useMediaQuery } from "./useMediaQuery";
const useDeviceViewport = () => {
    const btwIpad = useMediaQuery('(min-width:768px) and (max-width:1030px)')
    const [width, setWidth] = useState(window.innerWidth);
    let isLargeScreen = width > 1400;
    let isWeb = width > 1025;
    let isIpadpro = width <= 1024;
    let isIpadmini = width <= 991;
    let isMobile = width <= 767;
    let isMinimobile = width <= 575;
    let isMotoG4 = width <= 374;
    let isIphone5s = width <= 359;
    React.useEffect(() => {
        const handleWindowResize = () => setWidth(window.innerWidth);
        window.addEventListener("resize", handleWindowResize);
        return () => window.removeEventListener("resize", handleWindowResize);
    }, []);

    return {
        isWeb,
        isIpadpro,
        isIpadmini,
        isMobile,
        isMinimobile,
        isMotoG4,
        isIphone5s,
        btwIpad,
        isLargeScreen
    };
};

export default useDeviceViewport;

/*
To use
  const { isMobile } = useDeviceViewport();
*/