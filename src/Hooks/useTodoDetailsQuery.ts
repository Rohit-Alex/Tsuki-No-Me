import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
const getTodoDetails1 = async (id: any) => {
    try {
        const { data } = await axios.get(`https://jsonplaceholder.typicode.com/posts/${id}`)
        return data
    } catch (err) {
        console.log(err)
    }
}

const getTodoDetails = async ({ queryKey }: any) => {
    const [, id] = queryKey
    const { data } = await axios.get(`https://jsonplaceholder.typicode.com/posts/${id}`)
    return data
}

export const useTodoDetailsQuery = (todoId: any) => {
    const queryClient = useQueryClient() as any
    return useQuery({
        queryKey: ['todos', todoId],
        // queryFn: () => getTodoDetails1(todoId),
        queryFn: getTodoDetails,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        initialData: () => {
            const todoData = queryClient.getQueryData(['todos'])?.find((todo: any) => todo.id === parseInt(todoId))
            if (todoData) {
                return todoData
            } else {
                return undefined
            }
        }
    })
}

export const useTodoDetailsMultipleIds = (todoIds: any) => {
    return useQueries({
        queries: todoIds.map((id: any) => ({
            queryKey: ['todos', id],
            queryFn: () => getTodoDetails1(id)
        }))
    })
}

const addSuperHero = async (hero: any) => {
    const data =  await axios.post('http://localhost:4000/superheroes', hero)
    console.log(data, 'data returned', 7984)
    return data
}

export const useAddSuperHeroData = () => {
    return useMutation(addSuperHero)
}

export const useAddSuperHeroData1 = () => {
    const queryClient = useQueryClient()
    return useMutation(addSuperHero,
        // If we want to run the super-hereos query on it's own after it succeeds)
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['super-heroes'])
            },
        })
}

export const useAddSuperHeroData2 = () => {
    const queryClient = useQueryClient()
    return useMutation(addSuperHero,
        {
            onSuccess: (data: any) => {
                // data refers to the response we get after the api is fetched
                queryClient.setQueryData(['super-heroes'], (oldQueryData: any) => {
                    console.log(oldQueryData, 'oldQueryData', 7984)
                    return {
                        ...oldQueryData,
                        data: [...oldQueryData.data, data.data]
                    }
                })
            }
        }
    )
}

export const useAddSuperHeroData3 = () => {
    const queryClient = useQueryClient()
    return useMutation(addSuperHero, {
                onMutate: async newHero => {
                    // newHero refers to the argument being passed to the mutate function
                await queryClient.cancelQueries(['super-heroes'])
                const previousHeroData = queryClient.getQueryData(['super-heroes'])
                queryClient.setQueryData(['super-heroes'], (oldQueryData: any) => {
                    return {
                        ...oldQueryData,
                        data: [...oldQueryData.data,{ id: oldQueryData?.data?.length + 1, ...newHero }]
                    }
                })
            return { previousHeroData }
            },
            onError: (_err, _newTodo, context: any) => {
                queryClient.setQueryData(['super-heroes'], context.previousHeroData)
            },
            onSettled: () => {
                queryClient.invalidateQueries(['super-heroes'])
            }
        }
    )
}

export const useGetSuperHeroesData = () => {
    return useQuery(['super-heroes'], () => axios.get('http://localhost:4000/superheroes'))
}