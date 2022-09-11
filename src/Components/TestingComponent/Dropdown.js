// import "antd/dist/antd.css";
// import "./index.css";
import { Button, Checkbox, Col, Dropdown, Menu, Row } from "antd";
import ProfileOutlined from "@ant-design/icons/ProfileOutlined";
import { columnList } from "../../Constant";

const DropdownList = ({ selectedValue, handleChangeCheckbox }) => {
    const ColumnNames = ({ columnList, selectedValue, handleChangeCheckbox }) => {
        return (
            (columnList.length && (
                <Checkbox.Group
                    style={{ width: "100%" }}
                    value={selectedValue}
                    onChange={(selectedValues) => {
                        handleChangeCheckbox(selectedValues)
                    }}
                >
                    {columnList.map((column) => (
                        <Row key={column.dataIndex}>
                            <Col key={column.dataIndex} span={24}>
                                <Checkbox data-testid={`${column.dataIndex}-data-testid`} key={column.dataIndex} value={column.dataIndex}>
                                    {column.title}
                                </Checkbox>
                            </Col>
                        </Row>
                    ))}
                </Checkbox.Group>
            )) ||
            ""
        );
    };

    return (
        <>
            <div>
                <Dropdown
                    overlay={
                        <Menu>
                            <ColumnNames
                                columnList={columnList}
                                selectedValue={selectedValue}
                                handleChangeCheckbox={handleChangeCheckbox}
                            />
                        </Menu>
                    }
                    overlayClassName="menu-class-name"
                    trigger="click"
                >
                    <Button
                        type="default"
                        icon={
                            <ProfileOutlined style={{ fontSize: "24px", border: "none" }} />
                        }
                    />
                </Dropdown>
            </div>

        </>
    );
};

export default DropdownList
