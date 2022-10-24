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
        observer.observe(ref.current as any);

        return () => {
            observer.disconnect();
        };
    }, [ref, observer]);

    return isIntersecting;
}

export default useOnScreen;

/*
Used to check if a particular component is being rendered on screen or not
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