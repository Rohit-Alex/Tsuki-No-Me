import { t } from "i18next";
import i18next from "../i18n";
import { FaBeer } from "react-icons/fa";
import { WiCloudDown } from "react-icons/wi";
import { DiChrome } from "react-icons/di";
import { DiCodeigniter } from "react-icons/di";
import { ApiLocations, GET, notificationHandler, POST } from "../Utilies/utils";

export type ILocation = {
  state: {
    name: "string",
    age: "number",
  },
};

/*
  This is made a function instead of normal variable as the translations need to be updated whenever the user changes the languages
*/
export const segmentOptions = () => [
  { label: t("TODOS"), value: "react_query" },
  { label: t("TODO_DETAILS"), value: "todo_details" },
  { label: t("DYNAMIC_PARALLEL"), value: "dynamic_parallel" },
  { label: t("PAGINATED"), value: "pagination" },
  { label: t("INFINITE"), value: "infinte" },
  { label: t("MUTATION"), value: "mutation" },
];

export const segmentOptions1 = [
  { label: "TODOS", value: "react_query" },
  { label: "TODO_DETAILS", value: "todo_details" },
  { label: "DYNAMIC_PARALLEL", value: "dynamic_parallel" },
];

export const columnsMG = () => [
  {
    title: t("NAME"),
    dataIndex: "name",
    key: "name",
  },
  {
    title: t("AGE"),
    dataIndex: "age",
    key: "age",
  },
  {
    title: t("ADDRESS"),
    dataIndex: "address",
    key: "address",
  },
];

export const columnList = [
  {
    title: "Transaction Number ",
    value: "number",
    dataIndex: "number",
  },
  {
    title: "Transaction Type Name",
    value: "name",
    dataIndex: "name",
  },
  {
    title: "Transaction Type Mode",
    value: "mode",
    dataIndex: "mode",
  },
  {
    title: "Net Amount",
    value: "netAmount",
    dataIndex: "netAmount",
  },
  {
    title: "Seller Name",
    value: "sellerId",
    dataIndex: "sellerId",
  },
  {
    title: "Seller Order Line Id",
    value: "sellerOrderLineId",
    dataIndex: "sellerOrderLineId",
  },
  {
    title: "Transaction Created At",
    value: "createdAt",
    dataIndex: "createdAt",
  },
  {
    title: "Trace Id ",
    value: "traceId",
    dataIndex: "traceId",
  },
  {
    title: "Action",
    value: "action",
    dataIndex: "action",
  },
];

export const callAfterTimeout = () => {
  setTimeout(() => {
    console.log("called inside timeout is over");
  }, 500);
};

export const COLUMN_DATA: any = [
  {
    type: "settlement",
    title: "Settlement",
    icon: <FaBeer />,
  },
  {
    type: "calendar",
    title: "Calendar",
    icon: <WiCloudDown />,
  },
  {
    type: "chrome",
    title: "Chrome",
    icon: <DiChrome />,
  },
  {
    type: "igniter",
    title: "Igniter",
    icon: <DiCodeigniter />,
  },
];

export const getRuleEventHelper = async () => {
  try {
    const [, url] = ApiLocations.GET_TRANSACTION_SEARCH();
    const response = await GET(url, "2312312");
    return response;
  } catch (err) {
    handleErrorNotifications(err);
    return null;
  }
};

export const handleErrorNotifications = (error: any) => {
  let { title = "", description = "", duration, url } = error;
  if (!title) title = error?.code ? error?.code : "";
  if (!description) description = error?.message ? error?.message : "";
  notificationHandler({
    type: "error",
    title: title,
    description: description,
    duration,
    url,
  });
};

export const IS_CAPITALIZE = true;

export const TRANSACTION_DATA_COLUMN = [
  {
    dataIndex: "one",
    title: "One",
    label: "ONE",
  },
];

export const selectOptions = [
  {
    id: "d88aac44-05d7-4c69-acc5-be87a54d11e6",
    number: "BP-CL-9aklx",
  },
  {
    id: "595771fd-c4cc-4511-9c9f-1a96bd2eb48f",
    number: "BP-CL-salbl",
  },
  {
    id: "dae28b71-d748-411b-8cd3-8a69a85a910e",
    number: "BP-CL-w2owx",
  },
  {
    id: "eab77ed8-928d-4d31-ab83-7ed50721c644",
    number: "BP-CL-z747c",
  },
  {
    id: "dc23e238-cf3b-404b-93c4-5d6bd5655fc3",
    number: "BP-CL-stujt",
  },
  {
    id: "b495a489-f0e0-4a53-8c34-99607447ee3d",
    number: "BP-CL-flco0",
  },
  {
    id: "ea9caef2-9021-4325-9fe7-30e7338dff3b",
    number: "BP-CL-gnyxr",
  },
  {
    id: "558d2734-d143-4f6d-8dec-3c5f0eee9d38",
    number: "BP-CL-ubs5n",
  },
  {
    id: "354cd6ce-3394-450f-9326-e84178689ced",
    number: "BP-CL-qt2x3",
  },
  {
    id: "3f38234f-99a1-4f4b-8e78-a3bebe176747",
    number: "BP-CL-q1c53",
  },
];
