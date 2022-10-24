import React, { useState, useEffect } from "react";

const OPTIONS = {
    root: null,
    rootMargin: "0px 0px 0px 0px",
    threshold: 0,
};

const useIsVisible = (elementRef: React.RefObject<React.ReactNode>) => {
    const [isVisible, setIsVisible] = useState<boolean>(false);

    useEffect(() => {
        if (elementRef!.current) {
            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        // observer.unobserve(elementRef.current);
                    }
                    else {
                        setIsVisible(false);
                    }
                });
            }, OPTIONS);
            observer.observe(elementRef.current as any);
        }
    }, [elementRef]);

    return isVisible;
};

export default useIsVisible;