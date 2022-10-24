import { useReducer, useState } from "react"
import createUseContext from "constate"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"


const reducer = (state, action) => {
    switch (action.type) {
        case "UPDATE_PAGE":
            return {
                ...state,
                page: action.payload,
            }
        default:
            return state
    }
}

const defaultState = {
    page: 1
}

const initFunction = (initialData) => ({
    ...defaultState,
    ...initialData,
})

const fetchColors = (pageNumber) => {
    return axios.get(`http://localhost:4000/colors?_limit=2&_page=${pageNumber}`)
}

const addColor = async (color) => {
    const data = await axios.post('http://localhost:4000/colors', color)
    console.log(data, 'data in queryFn====>>', 7984)
    return data
}

const deleteColor = async (colorId) => {
    const data = await axios.delete(`http://localhost:4000/colors/${colorId}`)
    return data
}

const usePaginatedReactQuery = ({ initialData = {} }) => {
    const [state, dispatch] = useReducer(reducer, initialData, initFunction)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(2)
    // const { page  } = state

    const { isLoading, isError, error, data, isFetching } = useQuery(
        ['colors', page],
        () => fetchColors(page),
        {
            keepPreviousData: true,
            refetchIntervalInBackground: false,
            refetchOnMount: false, //when true the query is fetched or a network call is made every time the component mounts irrespective of stale or not
            refetchOnWindowFocus: false, // this won't let the api re-run when we focus on the input box
            // staleTime: Infinity // means it would never re-run on its own. Had it been 3000 then it would automatically get fired after 3sec
            staleTime: 3000 // means it would never re-run on its own. Had it been 3000 then it would automatically get fired after 3sec
        }
    )

    const useAddColor = () => {
        const queryClient = useQueryClient()

        return useMutation(addColor, {
            onSuccess: () => {
                queryClient.invalidateQueries(['colors', page])
            }
            // onMutate: async color => {
            //     // newHero refers to the argument being passed to the mutate function
            //     await queryClient.cancelQueries(['colors', page])
            //     const previousHeroData = queryClient.getQueryData(['colors', page])
            //     queryClient.setQueryData(['colors', page], (oldQueryData) => {
            //         return {
            //             ...oldQueryData,
            //             data: [...oldQueryData.data, { id: oldQueryData?.data?.length + 1, ...color }]
            //         }
            //     })
            //     return { previousHeroData }
            // },
            // onSuccess: (response, variables, context) => {
            //     queryClient.setQueryData(['colors', page], (oldQueryData) => {
            //         console.log(oldQueryData, 'oldQueryData', response, 'response', variables, 'var', context, 'context',7984)
            //         return {
            //             ...oldQueryData,
            //             data: oldQueryData.data.map(data => data.label === variables.label ? response.data : data)
            //         }
            //     })
            // },
            // onError: (_err, _newTodo, context) => {
            //     queryClient.setQueryData(['colors', page], context.previousHeroData)
            // },
            // onSettled: () => {
            //     queryClient.invalidateQueries(['colors', page])
            // }
        })
    }

    const useDeleteColor = () => {
        const queryClient = useQueryClient()
        console.log(page, 'page while deleting in mutation', 7984)
        return useMutation(deleteColor, {
            // onSuccess: () => {
            //     queryClient.invalidateQueries(['colors', page])
            // }
            onMutate: async colorId => {
                // newHero refers to the argument being passed to the mutate function
                await queryClient.cancelQueries(['colors', page])
                const previousHeroData = queryClient.getQueryData(['colors', page])
                queryClient.setQueryData(['colors', page], (oldQueryData) => {
                    return {
                        ...oldQueryData,
                        data: oldQueryData.data.filter(e => e.id !== colorId)
                    }
                })
                return { previousHeroData }
            },
            onError: (_err, _newTodo, context) => {
                queryClient.setQueryData(['colors', page], context.previousHeroData)
            },
            onSettled: () => {
                queryClient.invalidateQueries(['colors', page])
            }
        })
    }

    return {
        isLoading,
        isError,
        error,
        data,
        isFetching,
        useAddColor,
        useDeleteColor,
        page,
        setPage,
        pageSize,
        setPageSize
    }
}

const [ReactPaginatedQueryProvider, useReactPaginatedQueryContext] = createUseContext(usePaginatedReactQuery)

export { ReactPaginatedQueryProvider, useReactPaginatedQueryContext }

