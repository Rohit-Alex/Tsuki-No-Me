import { Tooltip } from "antd";
import { InfoCircleFilled } from "@ant-design/icons";

export default function CustomToolTip({
    title,
    keyIndex,
    toolTipColor,
    getWidgetTitleName,
}) {
    console.log("inside tooltip", getWidgetTitleName(`${keyIndex}`), title, 'title', '--------->>>')
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