import { Button, Card, Col, Row, Tooltip } from "antd";
import { Fragment, ReactNode, useCallback, useEffect } from "react";
// import "./widget.less";
import { InfoCircleFilled } from "@ant-design/icons";
// import CustomToolTip from "./HelperCustomTooltip";


function CustomToolTip({
    title,
    keyIndex,
    toolTipColor,
    getWidgetTitleName,
}) {
    return (
        <>
            <strong>{getWidgetTitleName(`${keyIndex}`)}</strong>
            <> </>
            <div id="area"></div>
            <Tooltip
                key={`${title}tootlp${keyIndex}`}
                getPopupContainer={() => { return document.getElementById('area') }}
                title={title}
                arrowPointAtCenter
                placement="right"
                overlayClassName="settlements-card-tooltip-overlay"
                data-testid={`${title}-testId`}
            >
                <InfoCircleFilled
                    data-testid={keyIndex}
                    style={{ fontSize: "12px", cursor: "pointer", color: toolTipColor }}
                />
            </Tooltip>
        </>
    );
}

const Widget = () => {

    const seller = 'seller0011';

    const getTooltipTexts = useCallback((name = "") => {
        switch (name) {
            case "progressTooltip":
                return ("SALES_IN_PROGRESS_TOOLTIP");
            case "incomeTooltip":
                return ("SETTLED_INCOME_TOOLTIP");
            case "availableTooltip":
                return ("AVAILABLE_INCOME_TOOLTIP");
            default:
                return "";
        }
    }, []);

    const getWidgetTitleName = useCallback((cardTitle = "") => {
        switch (cardTitle) {
            case "progressTooltip":
                return ("WIDGET_CARD_TITLE_IN_PROGRESS");
            case "incomeTooltip":
                return ("WIDGET_CARD_TITLE_INCOME");
            case "availableTooltip":
                return ("WIDGET_CARD_TITLE_AVAILABLE_INCOME");
            default:
                return "";
        }
    }, []);

    return (
        <Fragment>
            <Card
                style={{
                    border: "none",
                }}
            >
                <div className="seller-cards-information">
                    <Row gutter={16}>
                        <Col span={6}>
                            <Card
                                className="widget-card"
                                loading={false}
                                title={
                                    <CustomToolTip
                                        title={getTooltipTexts("progressTooltip")}
                                        keyIndex={"progressTooltip"}
                                        toolTipColor="#909090"
                                        getWidgetTitleName={getWidgetTitleName}
                                    />
                                }
                                bordered={true}
                            >
                                <strong className="widget-amount-card">
                                    ${" "}
                                    13,78,000 CLP
                                </strong>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </Card>
        </Fragment>
    );
};

export default Widget;
