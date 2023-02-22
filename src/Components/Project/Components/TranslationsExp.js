import { UndoOutlined } from "@ant-design/icons/lib/icons"
import SearchOutlined from "@ant-design/icons/SearchOutlined"
import { Button, Col, DatePicker, Form, Input, Row } from "antd"
import { DownOutlined, UpOutlined } from "@ant-design/icons"
import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import { columnList } from "Constant"

const { RangePicker } = DatePicker

const TranslationsExp = () => {
    const { t } = useTranslation()
    const [disableSearch, setDisableSearch] = useState(true)
    const selectedTab = {
        mainTab: 'transactions'
    }
    // const { selectedTab } = useAppStateContext()
    const [dates, setDates] = useState(
        selectedTab.mainTab === "transactions" ? [new Date(), new Date()] : []
    )
    const [searchValue, setSearchValue] = useState({})
    const [expand, setExpand] = useState(false)

    const eventSelectOption = columnList.map((opt) => ({
        label: t(opt.title),
        value: opt.value,
    }))

    const transactionSelectOptions = columnList.map((opt) => ({
        label: t(opt.title),
        value: opt.value,
    }))

    const filterOptions =
        selectedTab.mainTab === "transactions"
            ? transactionSelectOptions
            : eventSelectOption
    const isTransactionList = selectedTab.mainTab === "transactions"

    const checkIfDisabled = (searchValue, dates) => {
        if (
            Object.keys(searchValue).length !== 0 ||
            (dates && dates?.length !== 0)
        ) {
            return false
        }
        return true
    }

    useEffect(() => {
        setDisableSearch(checkIfDisabled(searchValue, dates))
    }, [searchValue, dates])
    console.log({ searchValue, filterOptions })
    return (
        <div
            style={{
                margin: "20px 0px",
                display: "flex",
                justifyContent: "space-between",
            }}
        >
            <Row>
                {filterOptions.map((item, i) => (
                    <Col key={i}>
                        <Form>
                            <Form.Item
                                hidden={!expand && i > 1}
                                style={{ marginLeft: "10px" }}
                                name={`${item.value}`}
                                label={`${item.label}`}
                                rules={[
                                    {
                                        required: false,
                                        message: "Input something!",
                                    },
                                ]}
                            >
                                {item.label === "Transaction Created At" ||
                                    item.label === "Event Arrived At" ? (
                                    <>
                                        <RangePicker
                                            data-testid={`${item.value}`}
                                            onChange={(values) => {
                                                setDates(
                                                    values?.map((date) => {
                                                        return date
                                                    })
                                                )
                                            }}
                                        />
                                    </>
                                ) : (

                                    <Input
                                        data-testid={`${item.value}`}
                                        name={`${item.value}`}
                                        type="text"
                                        placeholder={t("SEARCH_INPUT_PLACEHOLDER")}
                                        allowClear
                                        value={searchValue[item.value]}
                                        style={{ width: "280px" }}
                                        onChange={(e) => {
                                            if (e.target.value) {
                                                setSearchValue({
                                                    ...searchValue,
                                                    [e.target.name]: e.target.value,
                                                })
                                            } else {
                                                const searchdata = { ...searchValue }
                                                delete searchdata[e.target.name]
                                                setSearchValue(searchdata)
                                            }
                                        }}
                                    />

                                )}
                            </Form.Item>
                        </Form>
                    </Col>
                ))}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginLeft: isTransactionList ? "auto" : "47px",
                        marginRight: isTransactionList && expand ? "70px" : "",
                    }}
                >
                    <Button
                        style={{ marginLeft: "60px" }}
                        data-testid="search-button-testid"
                        disabled={disableSearch}
                        size="middle"
                        type="primary"
                        icon={<SearchOutlined />}
                        onClick={() =>
                            console.info('<<<<<<<<<<===START===>>>>>>>>>>', '<<<<<<<<<<===END===>>>>>>>>>>')
                        }
                    >
                        {t("SEARCH")}
                    </Button>
                    <Button
                        style={{ marginLeft: "20px" }}
                        size="middle"
                        type="default"
                        icon={<UndoOutlined />}
                        onClick={() => {
                            if (isTransactionList) {
                                setSearchValue({})
                                setDates([new Date(), new Date()])
                            } else {
                                setDates([])
                            }
                            setSearchValue({})
                        }}
                    >
                        {t("RESET")}
                    </Button>
                    <Button
                        data-testid="expand-button-testid"
                        style={{ fontSize: 12, border: "none" }}
                        onClick={() => {
                            setExpand(!expand)
                        }}
                    >
                        {expand ? <UpOutlined /> : <DownOutlined />}
                        {expand ? t("COLLAPSE") : t("EXPAND")}
                    </Button>
                </div>
            </Row >
        </div >
    )
}


export default TranslationsExp