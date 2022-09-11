import { Select, Space, } from "antd"
import { useEffect, useState } from "react"
import { useTransactionSearchContext } from "../Context/TransactionData"
import { TRANSACTION_DATA_COLUMN } from "../utils"

import { Link } from "react-router-dom"
const { Option } = Select

const TransactionList = () => {
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [requestBody, setRequestBody] = useState({})
    const tenant = 'sadasdswq13123'

    const {
        getTransactionSearch,
        resetDataOnSearch,
        transactionData,
        pagination,
        isLoading,
    } = useTransactionSearchContext()

    const handleSearch = async (key, value) => {
        await resetDataOnSearch()
        let body = {}
        if (pagination?.pageSource) body.pageSource = pagination?.pageSource
        if (typeof value === "object") {
            if (value.startDate) body = { ...body, startDate: value.startDate }
            if (value.endDate) body = { ...body, endDate: value.endDate }
        } else {
            if (key && value) body = { ...body, [key]: value }
        }
        setRequestBody(body)
        await getTransactionSearch(body)
    }

    useEffect(() => {
        const getTransactionData = async () => {
            let body = {
                ...requestBody,
            }
            if (pagination?.pageSource) body = { ...body, pageSource: pagination?.pageSource }
            await getTransactionSearch(body)
        }
        getTransactionData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page])

    const nextData = () => {
        if (!pagination?.pageSource) {
            setHasMore(false)
            return
        }
        setPage((prev) => !prev)
    }

    const [filteredValues, setFilteredValues] = useState([])
    const [selectedValue, setSelectedValues] = useState(
        TRANSACTION_DATA_COLUMN.map((e) => e.dataIndex)
    )

    useEffect(() => {
        const updatedValues = TRANSACTION_DATA_COLUMN.filter((e) =>
            selectedValue.includes(e.dataIndex)
        )
        updatedValues.push({
            title: "Action",
            label: "action",
            dataIndex: "traceId",
            render: traceId => <Link to={{
                pathname: 'events/details',
                data: traceId,
            }}>{("VIEW")}</Link>,
        })
        setFilteredValues(updatedValues)
    }, [selectedValue])

    const handleChangeCheckbox = (values) => {
        setSelectedValues(values)
    }
    return (
        <Space direction="vertical" style={{ width: "100%" }}>
            <Select
                showSearch
                placeholder="Search to Select"
                filterOption={(input, option) => { return (option.children).includes(input) }}
                allowClear
            >
                <Option value="1">Not Identified</Option>
                <Option value="2">Closed</Option>
                <Option value="3">Communicated</Option>
                <Option value="4">Identified</Option>
                <Option value="5">Resolved</Option>
                <Option value="6">Cancelled</Option>
            </Select>
        </Space>
    )
}

export default TransactionList