import React, { useState, useRef, useEffect, useCallback } from "react";
import useOnClickOutside from "./useOnClickOutside";
import "./customDropdown.css";
import Label from "./Label";
class Store {
    isChipAdded = false;
}

// const loadingStyle = {
//   background: "gray",
//   opacity: 0.2,
//   position: "relative",
//   overflow: "hidden"
// };

const store = new Store();

const CustomDropdown = ({
    options,
    title,
    onSelected,
    noOptionsText = "No options",
    selectedValue = null,
    type = "",
    disabled,
    value,
    label,
    iconRight,
    isLoading,
    cbForReachedBottom
}) => {
    const getInitialItem = () => {
        if (type === "") return [{ label: title, value: selectedValue }];
    };

    const mainComponentRef = useRef();

    const [selectedItem, setSelectedItem] = useState(getInitialItem());

    // const [optionsPros, setOptionsPros] = useState(options || []); not_required
    const [opts, setOpts] = useState(options || []);

    const [open, setOpen] = useState(false);

    const handlerToggle = () => setOpen(!open);

    useOnClickOutside(mainComponentRef, () => {
        setOpen(false)
    });
    /* not_required
    const getOptionsProp = () => {
        return optionsPros;
    };
    */
    const handlerSelectedItem = (o) => {
        return () => {
            if (type !== "multi") {
                setSelectedItem([o]);
                onSelected(o);
                setOpen(false);
            }
            store.isChipAdded = false;
        };
    };

    /* not_required 
    console.log(isLoading, "isLoading...");
    useEffect(() => {
        if (value !== undefined && !open) {
            setSelectedItem([value]);
        }
    }, [value, open]);
    */
    useEffect(() => {
        if (Array.isArray(options)) {
            setOpts(options);
            // setOptionsPros(options);

            if (!options.find((option) => option.value === selectedItem[0].value)) {
                setSelectedItem(getInitialItem());
            }
        }
    }, [options,
        // setOpts, setOptionsPros not_required
    ]);
    /* not_required
    useEffect(() => {
        if (selectedValue) {
            const filterdedOption = getOptionsProp().filter((o) => {
                return (
                    `${o.value}`
                        .toLocaleLowerCase()
                        .indexOf(`${selectedValue}`.toLocaleLowerCase()) > -1
                );
            });
            if (filterdedOption.length === 1) {
                const item = filterdedOption[0];
                setSelectedItem([item]);
                onSelected(filterdedOption[0]);
            }
        }
    }, [selectedValue]);

    const observer = useRef();
    const lastRowElement = useCallback(
        (node) => {
            if (isLoading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                console.log("inside intersection observer --->>", entries)
                if (entries[0].isIntersecting) {
                    console.log("intersected ...??")
                    cbForReachedBottom && cbForReachedBottom();
                }
            });
            if (node) observer.current.observe(node);
        },
        [isLoading]
    );
    */
    const listInnerRef = useRef(); //added

    const onScroll = () => {
        if (listInnerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
            if (scrollTop + clientHeight > scrollHeight - 3) {
                cbForReachedBottom && cbForReachedBottom();
            }
        }
    }; // added onScroll fun

    const calClassName = ["uci__dropdown uci__dropdown--top-left"];
    if (disabled) calClassName.push("uci__dropdown--disabled");
    if (open) calClassName.push(`uci__dropdown--${open ? "open" : "close"}`);

    const isItemSelected = (o) => selectedItem.find((e) => o.value === e.value);
    const getOptionList = () => {
        return opts.map((o, i) => (
            <li
                className={`"uci__dropdownitem ucidropdown_item--${isItemSelected(o) ? "active" : "normal"
                    }`}
                key={o.value}
                role="option"
                aria-selected={isItemSelected(o)}
            //ref={opts.length === i + 1 ? lastRowElement : null} not_required
            >
                <button type="button" onClick={handlerSelectedItem(o)}>
                    {o.label}
                </button>
            </li>
        ));
    };

    return (
        <div>
            {label && <Label>{label}</Label>}
            <div className={calClassName.join(" ")} ref={mainComponentRef}>
                {type === "" && (
                    <button
                        type="button"
                        onClick={handlerToggle}
                        disabled={disabled}
                        aria-haspopup="listbox"
                        aria-expanded={open}
                    >
                        <span>
                            {(
                                opts.find(
                                    (e) => e.value === selectedItem[0].value
                                ) || {}
                            ).label || selectedItem[0].label}
                        </span>
                        <i>{!isLoading && <span>Dropdown...</span>}</i>
                        <span className="ucidropdown_loading-indicator">
                            {isLoading && <span>Loading...</span>}
                        </span>
                    </button>
                )}

                <ul
                    style={{
                        display: open ? "block" : "none"
                        // ...(isLoading ? loadingStyle : {})
                    }}
                    role="listbox"
                    tabIndex={-1}
                    onScroll={onScroll}
                    ref={listInnerRef} //added
                    data-testid={`option-ctn-data-testid-${label}`} //added
                >
                    {getOptionList()}
                    {opts.length === 0 && (
                        <li className="uci__dropdown_item" role="option">
                            <div>{noOptionsText}</div>
                        </li>
                    )}
                    {/* {isLoading && (
            <div
              style={{
                position: "absolute",
                top: "50vh",
                left: "50vw",
                color: "red"
              }}
            >
              loading....
            </div>
          )} */}
                </ul>
            </div>
        </div>
    );
};

export default CustomDropdown;

// CustomDropdown.propTypes = {
//     options: PropTypes.arrayOf(
//         PropTypes.exact({
//             label: PropTypes.string,
//             value: PropTypes.string
//         })
//     ).isRequired,
//     title: PropTypes.string.isRequired,
//     onSelected: PropTypes.func.isRequired,
//     noOptionsText: PropTypes.string,
//     selectedValue: PropTypes.string,
//     type: PropTypes.string,
//     disabled: PropTypes.bool,
//     value: PropTypes.exact({
//         label: PropTypes.string,
//         value: PropTypes.string
//     }).isRequired,
//     values: PropTypes.arrayOf(
//         PropTypes.exact({
//             label: PropTypes.string,
//             value: PropTypes.string
//         })
//     ),
//     label: PropTypes.string.isRequired,
//     isLoading: PropTypes.bool.isRequired,
//     cbForReachedBottom: PropTypes.func.isRequired
// };

// CustomDropdown.defaultProps = {
//     noOptionsText: "No options",
//     selectedValue: null,
//     type: ""
// };
