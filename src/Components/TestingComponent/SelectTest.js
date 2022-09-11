import { Select, Space } from "antd"
const { Option } = Select

const TransactionList = () => {
    
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