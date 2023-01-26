import { Button } from '@mui/material';
import { Input } from 'antd';
import React, { useState } from 'react';
import 'antd/dist/antd.css';
import DatePickers from './CustomDatePicker';
import { sub } from 'date-fns';
import SelectWrapper from './SelectWrapper';

const options = [{ label: 'Mode', value: 'mode' }, { label: 'Number', value: 'number' }, { label: 'Transactions Created At', value: 'createdAt' }, { label: 'Seller line order id', value: 'sellerLineOrderId' }]

function Search({ handleSearch }) {

    const [filterValue, setFilterValue] = useState('')
    const [searchValue, setSearchValue] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')

    const disabledDateForEndDate = (current) => {
        if (!startDate) return current && current.valueOf() > Date.now();
        else return current && current <= sub(new Date(), { days: 1 });
    };
    const disabledDateForStartDate = (current) => {
        return current && current.valueOf() > Date.now();
    };

    return (
        <div data-testid="search-test">
            {filterValue === 'createdAt' ? ['startDate', 'endDate'].map((type, index) =>
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
                />) :
                <Input
                    name="search-input"
                    placeholder={("SEARCH_INPUT_PLACEHOLDER")}
                    defaultValue="eventId"
                    allowClear
                    value={searchValue}
                    style={{ width: "300px" }}
                    size="middle"
                    onChange={(e) => {
                        setSearchValue(e.target.value)
                    }}
                />
            }
            <SelectWrapper
                placeholder={("SEARCH_SELECT_PLACEHOLDER")}
                style={{ width: 200 }}
                size="middle"
                allowClear={filterValue ? true : false}
                value={filterValue}
                data-testid="search-testid"
                options={options}
                onChange={(value) => {
                    setFilterValue(value || "")
                }}
            />
            <Button
                onClick={() => {
                    if (filterValue === 'createdAt') handleSearch(filterValue, { startDate, endDate })
                    else handleSearch(filterValue, searchValue)
                }}
                data-testid="search-button-testid"
            >   Search
            </Button>
        </div>
    )
}

export default Search;
