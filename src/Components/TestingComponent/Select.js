import { Select } from "antd"
import { useState } from "react"
import { columnList } from "../../Constant"

const SelectWrapper = () => {
    const [value, setValue] = useState('')
    return (
        <div id="area">
        <Select
            placeholder='Normal select box'
            allowClear
            onChange={value => setValue(value)}
                getPopupContainer={() => { return document.getElementById('area') }}
            filterOption={(input, option) => {  return (option.children).includes(input) }}
            value={value}
        >
            {columnList.map((option) => (
                <Select.Option key={option.value} value={option.value} data-tesid={option.value}>
                    {option.title}
                </Select.Option>
            ))}
        </Select>
        </div>

    )
}

export default SelectWrapper