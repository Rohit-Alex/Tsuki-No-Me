import { Select } from "antd"
import React from "react"


const { Option } = Select

const SelectWrapper = ({
    size,
    placeholder,
    allowClear,
    disabled,
    onChange,
    options,
    value,
    ...rest
}) => {
    return (
        <Select
            {...rest}
            size={size}
            placeholder={placeholder}
            allowClear={allowClear}
            disabled={disabled}
            onChange={onChange}
            value={!value ? placeholder : value}
        >
            {options.map((option) => (
                <Option key={option.value} value={option.value} data-tesid={option.value}>
                    {option.label}
                </Option>
            ))}
        </Select>
    )
}

export default SelectWrapper