// reducer file
//context file
import { useReducer, useState } from "react"
import createUseContext from "constate"
import { ApiLocations, notificationHandler, POST } from "../Utilies/utils"

jest.mock("../Utilies/utils")

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
    const token = '213213123123'

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

    const handleErrorNotifications = (error) => {
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
            setIsLoading(false)
        }
    }

    return {
        isLoading,
        transactionData,
        pagination,
        getTransactionSearch,
        resetDataOnSearch,
    }
}

const [TransactionSearchProvider, useTransactionSearchContext] = createUseContext(useTransactionSearch)

export { TransactionSearchProvider, useTransactionSearchContext }

