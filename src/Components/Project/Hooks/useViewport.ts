import React, { useState } from "react";

const useViewport = () => {
    const [width, setWidth] = useState(window.innerWidth);

    React.useEffect(() => {
        const handleWindowResize = () => setWidth(window.innerWidth);
        window.addEventListener("resize", handleWindowResize);
        return () => window.removeEventListener("resize", handleWindowResize);
    }, []);

    return { width };
};

export default useViewport;

/*
To use
  const { width } = useViewport();
*/