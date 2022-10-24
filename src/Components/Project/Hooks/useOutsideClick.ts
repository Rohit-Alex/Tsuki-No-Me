import { ReactNode, RefObject, SyntheticEvent, useEffect, useState } from "react";

const useOutsideClick = (ref: RefObject<ReactNode>) => {
    const [outsideClicked, setOutsideClicked] = useState(false);

    useEffect(() => {
        function handleClickOutside(event: any) {
            if (ref.current && !(ref.current as any).contains(event.target)) {
                setOutsideClicked(true);
            } else {
                setOutsideClicked(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);

    return { outsideClicked };
};

export default useOutsideClick;

/*
To use
const wrapperRef = useRef(null);
  const { outsideClicked } = useOutsideClick(wrapperRef);

  useEffect(() => {
    if (outsideClicked) {
      setShowSuggestion(false);
    }
  }, [outsideClicked]);

        <div ref={wrapperRef}>
        </div> the div on that you need to check if it is clicked outside of it or not.
    */
