import { t } from 'i18next'
import i18next from '../i18n'
export type ILocation  = {
  state: {
    name: 'string',
    age: 'number'
  }
}

/*
  This is made a function instead of normal variable as the translations need to be updated whenever the user changes the languages
*/
export const segmentOptions = () => [
  {label: t('TODOS'), value: 'react_query'},
  {label: t('TODO_DETAILS'), value: 'todo_details'},
  {label: t('DYNAMIC_PARALLEL'), value: 'dynamic_parallel'},
  {label: t('PAGINATED'), value: 'pagination'},
  {label: t('INFINITE'), value: 'infinte'},
  {label: t('MUTATION'), value: 'mutation'},
]


export const columnsMG = () =>[
  {
    title: t('NAME'),
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: t('AGE'),
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: t('ADDRESS'),
    dataIndex: 'address',
    key: 'address',
  },
];

export const columnList = [
    {
        title: "Transaction Number ",
        value: "number",
        dataIndex: "number"
    },
    {
        title: "Transaction Type Name",
        value: "name",
        dataIndex: "name"
    },
    {
        title: "Transaction Type Mode",
        value: "mode",
        dataIndex: "mode"
    },
    {
        title: "Net Amount",
        value: "netAmount",
        dataIndex: "netAmount"
    },
    {
        title: "Seller Name",
        value: "sellerId",
        dataIndex: "sellerId"
    },
    {
        title: "Seller Order Line Id",
        value: "sellerOrderLineId",
        dataIndex: "sellerOrderLineId"
    },
    {
        title: "Created At",
        value: "createdAt",
        dataIndex: "createdAt"
    },
    {
        title: "Trace Id ",
        value: "traceId",
        dataIndex: "traceId"
    },
    {
     title: "Action",
     value: "action",
     dataIndex: "action"
    },
];

export const callAfterTimeout = () => {
    console.log("before timeout")
    setTimeout(()=>{
        console.log("called inside timeout is over")
    }, 500)
}