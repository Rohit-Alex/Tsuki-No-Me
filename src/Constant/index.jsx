import { t } from 'i18next'
import i18next from '../i18n'
import { FaBeer } from 'react-icons/fa';
import { WiCloudDown } from 'react-icons/wi';
import { DiChrome } from 'react-icons/di';
import { DiCodeigniter } from 'react-icons/di';
import { ApiLocations, GET, notificationHandler, POST } from '../Utilies/utils';

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

export const segmentOptions1 = [
  {label: ('TODOS'), value: 'react_query'},
  {label: ('TODO_DETAILS'), value: 'todo_details'},
  {label: ('DYNAMIC_PARALLEL'), value: 'dynamic_parallel'}
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
    setTimeout(()=>{
        console.log("called inside timeout is over")
    }, 500)
}

export const COLUMN_DATA: any = [
    {
        type: 'settlement',
        title: 'Settlement',
        icon: <FaBeer />,
    },
    {
        type: 'calendar',
        title: 'Calendar',
        icon: <WiCloudDown />
    },
    {
        type: 'chrome',
        title: 'Chrome',
        icon: <DiChrome />
    },
    {
        type: 'igniter',
        title: 'Igniter',
        icon: <DiCodeigniter />
    }
]


export const getRuleEventHelper = async () => {
    try {
        const [, url] = ApiLocations.GET_TRANSACTION_SEARCH()
        const response = await GET(url, '2312312')
        return response
    } catch (err) {
        handleErrorNotifications(err)
        return null
    }
}

export const handleErrorNotifications = (error: any) => {
    let { title = "", description = "", duration, url } = error
    if (!title) title = error?.code ? error?.code : ''
    if (!description) description = error?.message ? error?.message : ''
    notificationHandler({
        type: "error",
        title: (title),
        description: (description),
        duration,
        url,
    })
}