import { useQuery } from "@tanstack/react-query"
import { fetchMethod } from "../../Utilies/utils"
const getTodos = async () => {
    const { data } = await fetchMethod('https://jsonplaceholder.typicode.com/posts')
    return data
}
export const useQueryCustomHook = () => {
    return useQuery({
        queryKey: ['todos'],
        queryFn: getTodos,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        // enabled: false,
        // select: (data: any) => {
        //     const titles = data.map((e: any) => e.title)
        //     return titles
        // }
        // cacheTime: 5000, this is 5 sec => implies the data will be cached for 5 sec
        // staleTime: 3000, this is 3 sec => implies that the network call will be made after 3 sec of each call when the component mounts
        // refetchInterval: 2000, the query gets fired after every 2 sec
        // refetchIntervalInBackground: true , the query is re-ran even though the tab isn't in focussed. Used with refetchInterval
    })
}