import { DatePicker } from "antd"
import { useState } from "react"

const RangePicker = () => {
    const { RangePicker } = DatePicker
    const [values, setValues] = useState()
    return <RangePicker format="YYYY-MM-DD"  placeholder="Range Picker" onChange={value => setValues(value)}/>
}
export default RangePicker