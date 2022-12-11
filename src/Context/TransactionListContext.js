// reducer file
//context file
import { useReducer, useState } from "react"
import createUseContext from "constate"
import { ApiLocations, GET, POST } from "../Utilies/utils"
import {  getRuleEventHelper, handleErrorNotifications } from "../Constant"


const reducer = (state, action) => {
    switch (action.type) {
        case "UPDATE_TRANSACTION_DATA":
            return {
                ...state,
                transactionData: [...state.transactionData, ...action.payload],
            }
        case 'UPDATE_PAGINATION':
            return {
                ...state,
                pagination: action.payload
            }
        case "RESET":
            return {
                transactionData: [],
                pagination: {},
            }
        default:
            return state
    }
}

//some where in constants file
const requiredKeys = [ "number", "name", "mode", "netAmount", "sellerId", "sellerOrderLineId", "createdAt", "traceId", "transactionId"]
const token = '213213123123'


const defaultState = {
    transactionData: [],
    pagination: {},
}

const initFunction = (initialData) => ({
    ...defaultState,
    ...initialData,
})


const useTransactionSearch = ({ initialData = {} }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [state, dispatch] = useReducer(reducer, initialData, initFunction)

    const { transactionData, pagination } = state

    const formRowData = (responseData) => {
        const rowData = responseData.map((x, index) => {
            let obj = {
                key: index,
            }
            Object.keys(x).forEach(key => {
                if (requiredKeys.includes(key)) {
                    if (key == "netAmount") obj[key] = JSON.stringify(x[key])
                    else obj[key] = x[key]
                }

                if (typeof x[key] === "object") {
                    Object.keys(x[key]).forEach(innerKey => {
                        if (requiredKeys.includes(innerKey)) {
                            obj[innerKey] = x[key][innerKey]
                        }
                    })
                }
            })
            return obj
        })
        return rowData
    }

    const updateTransactionSearch = (response) => {
        const requiredResposes = formRowData(response?.data?.transactions)
        dispatch({
            type: "UPDATE_TRANSACTION_DATA",
            payload: requiredResposes,
        })
        dispatch({
            type: "UPDATE_PAGINATION",
            payload: response?.data?.pagination,
        })
    }

    const resetDataOnSearch = () => {
        dispatch({
            type: 'RESET',
        })
    }

    const getTransactionSearch = async (payload) => {
        setIsLoading(true)
        try {
            const [error, url] = ApiLocations.GET_TRANSACTION_SEARCH()
            if (error) {
                return handleErrorNotifications(error)
            }
            const response = await POST(url, token, payload)
            updateTransactionSearch(response)
        } catch (error) {
            //title aur description
            handleErrorNotifications(error)
        } finally {
            console.log("inside finally")
            setIsLoading(false)
        }
    }

    const getRuleEvents = async () => {
        const response = await getRuleEventHelper()
        if (response) {
            // updateRuleEvents(response)
        }
    }

    const getRule = async (payload) => {
        try {
            const [, url] = ApiLocations.GET_TRACE_DETAILS()
            const response = await POST(url, '2342425', payload)
            // updateRuleEvents(response)
        } catch (err) {
            handleErrorNotifications(err)
            return null
        }
    }

    const getAllRules = async (status, page = 4, name) => {
        setIsLoading(true)
        await Promise.all([getRuleEvents(), getRule(status, page, name)])
        .then(() => {
            setIsLoading(false)
        }).catch((err) => {
            console.log(err, 'inside error promise.all')
            handleErrorNotifications(err)
        })
    }

    return {
        isLoading,
        transactionData,
        pagination,
        getTransactionSearch,
        resetDataOnSearch,
        getAllRules,
        getRule
    }
}

const [TransactionSearchProvider, useTransactionSearchContext] = createUseContext(useTransactionSearch)

export { TransactionSearchProvider, useTransactionSearchContext }

