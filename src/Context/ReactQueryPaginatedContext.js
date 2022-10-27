import { useReducer, useState } from "react"
import createUseContext from "constate"
import { useFetchColorHook } from "./ReactQueryCustomHooks/usePaginationReactQuery"


// const reducer = (state, action) => {
//     switch (action.type) {
//         case "UPDATE_PAGE":
//             return {
//                 ...state,
//                 page: action.payload,
//             }
//         default:
//             return state
//     }
// }

// const defaultState = {
//     page: 1
// }

// const initFunction = (initialData) => ({
//     ...defaultState,
//     ...initialData,
// })

const usePaginatedReactQuery = ({ initialData = {} }) => {
    // const [state, dispatch] = useReducer(reducer, initialData, initFunction)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(2)
    // const { page  } = state

    const { isLoading, isError, error, data, isFetching } = useFetchColorHook(page)

    return {
        isLoading,
        isError,
        error,
        data,
        isFetching,
        // useAddColor,
        // useDeleteColor,
        page,
        setPage,
        pageSize,
        setPageSize
    }
}

const [ReactPaginatedQueryProvider, useReactPaginatedQueryContext] = createUseContext(usePaginatedReactQuery)

export { ReactPaginatedQueryProvider, useReactPaginatedQueryContext }

