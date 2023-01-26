import React from "react";
import "./Label.css";

const Label = ({ id = "123", children, className = "" }) => {
    return (
        <p
            id={id}
            className={`uci__label${className !== "" ? ` ${className}` : ""}`}
        >
            {" "}
            {children}
        </p>
    );
};

Label.displayName = "Label";

export default Label;
