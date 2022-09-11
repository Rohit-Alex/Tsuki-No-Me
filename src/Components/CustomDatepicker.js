import dateFnsGenerateConfig from "rc-picker/lib/generate/dateFns"
import "antd/lib/date-picker/style/index"
import generatePicker from "antd/lib/date-picker/generatePicker"

const DatePicker = generatePicker(dateFnsGenerateConfig)

const DatePickers = ({ placeholder, disabledDate, value, onChange }) => {
    return (
        <DatePicker
            format="YYYY-MM-DD"
            style={{ width: "150px" }}
            placeholder={placeholder}
            disabledDate={disabledDate}
            value={value}
            onChange={onChange}
        ></DatePicker>
    )
}

export default DatePickers