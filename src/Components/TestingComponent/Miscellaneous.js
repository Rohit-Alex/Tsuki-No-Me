import { Input, Button } from "antd"
import { useCallback, useContext, useState } from "react";
import debounce from 'lodash/debounce';
import DatePickers from "../CustomDatepicker";
import { sub } from "date-fns";
import SelectWrapper from "./Select";
import AllInOne from "./AllInOne";
import RangePicker from "./RangePicker";
import { NotificationContext } from "Context/notificationContext";

const Miscellaneous = () => {
    const [searchValue, setSearchValue] = useState('')
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState('')
    const { openNotification } = useContext(NotificationContext)
    const debouncedSave = useCallback(
        debounce((nextVal) => console.log('inside debounce after 400', nextVal), 400),
        []
    );
    const handleSearch = (e) => {
        const nextValue = e.target.value
        console.log('nextVal', nextValue, debouncedSave)
        setSearchValue(nextValue)
        debouncedSave(nextValue);
    }

    const disabledDateForEndDate = (current) => {
        if (!startDate) return current && current.valueOf() > Date.now();
        else return current && current <= sub(new Date(), { days: 1 });
    };

    const disabledDateForStartDate = (current) => {
        return current && current.valueOf() > Date.now();
    };

    const showNotification = () => { 
        // notification.info({
        //     message: 'hi',
        //     description: "hiaf adad",
        //     duration: 3
        // })
        openNotification({
            message: 'hi',
            description: "hiaf adad",
            duration: 3
        })
     }

    return (
        <App>
            <Input placeholder='SEARCH_RULE_NAME' onChange={handleSearch} value={searchValue} style={{ width: '180px' }} />
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
            <SelectWrapper />
            <RangePicker />
            <div>
                <AllInOne />
            </div>
            <Button onClick={showNotification} data-testid="ant-notification">Open notification</Button>
        </App>
    )
}

export default Miscellaneous