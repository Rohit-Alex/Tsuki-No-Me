import { sub } from "date-fns"
import { useState } from "react"

const DatePickers = () => {
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState('')

    const disabledDateForEndDate = (current) => {
        if (!startDate) return current && current.valueOf() > Date.now();
        else return current && current <= sub(new Date(), { days: 1 });
    };

    const disabledDateForStartDate = (current) => {
        return current && current.valueOf() > Date.now();
    };
    console.log("inside")
    return (
        <div>
            {['startDate', 'endDate'].map((type, index) =>
                <DatePickers
                    value={index === 0 ? startDate : endDate}
                    placeholder={type === "startDate" ? ("SEARCH_START_DATE_PLACEHOLDER") : ("SEARCH_END_DATE_PLACEHOLDER")}
                    onChange={(date, d) => {
                        if (type === 'startDate') {
                            setEndDate('')
                            setStartDate(date)
                        }
                        else setEndDate(date)
                    }}
                    key={index}
                    disabledDate={index === 0 ? disabledDateForStartDate : disabledDateForEndDate}
                    data-testid={`${type}-testid`}
                />
            )}
        </div>

    )
}

export default DatePickers