import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

const fetchColors = async (pageNumber) => {
    const data = await axios.get(`http://localhost:4000/colors?_limit=2&_page=${pageNumber}`)
    return data
}

const addColor = async (color) => {
    const data = await axios.post('http://localhost:4000/colors', color)
    return data
}

const deleteColor = async (colorId) => {
    const data = await axios.delete(`http://localhost:4000/colors/${colorId}`)
    return data
}

export const useFetchColorHook = (page) => {
    return useQuery(
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
}

export const useAddColorHook = (page) => {
    const queryClient = useQueryClient()
    return useMutation(addColor, {
        // onSuccess: () => {
        //     queryClient.invalidateQueries(['colors', page])
        // }
        onMutate: async color => {
            // newHero refers to the argument being passed to the mutate function
            await queryClient.cancelQueries(['colors', page])
            const previousColorData = queryClient.getQueryData(['colors', page])
            if (previousColorData) {
                queryClient.setQueryData(['colors', page], (oldQueryData) => {
                    return {
                        ...oldQueryData,
                        data: [...oldQueryData.data, { id: oldQueryData?.data?.length + 1, ...color }]
                    }
                })
            }
            return { previousColorData }
        },
        onSuccess: (response, variables, context) => {
            queryClient.setQueryData(['colors', page], (oldQueryData) => {
                if (oldQueryData) {
                    return {
                        ...oldQueryData,
                        data: oldQueryData.data.map(data => data.label === variables.label ? response.data : data)
                    }
                } else {
                    return {
                        data: response.data
                    }
                }

            })
        },
        onError: (err, _newTodo, context) => {
            console.log(err, 'in error of addColorHook')
            queryClient.setQueryData(['colors', page], context.previousColorData)
        },
        onSettled: () => {
            queryClient.invalidateQueries(['colors', page])
        }
    })
}

export const useDeleteColorHook = (page) => {
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