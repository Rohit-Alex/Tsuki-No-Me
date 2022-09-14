import { ReactNode, RefObject } from "react";

import { useMemo, useState, useEffect } from "react";

function useOnScreen(ref: RefObject<ReactNode>) {
    const [isIntersecting, setIsIntersecting] = useState<boolean>(false);

    const observer = useMemo(
        () =>
            new IntersectionObserver(([entry]) =>
                setIsIntersecting(entry.isIntersecting)
            ),
        []
    );

    useEffect(() => {
        observer.observe(ref.current);

        return () => {
            observer.disconnect();
        };
    }, [ref, observer]);

    return isIntersecting;
}

export default useOnScreen;

/*
To use
const ref = useRef(null);
  const onScreen = useOnScreen(ref);

  useEffect(() => {
    if (onScreen) {
      that needs to be done
    }
  }, [onScreen]);

  <div ref={ref}>
  The div that needs to be checked
  </div>
  */