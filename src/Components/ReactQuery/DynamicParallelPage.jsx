/*
Here we want to fetch details for multiple todos, and it depends on user
He can send how many numbers of Ids as he like to get the details.
*/
import { useQueries } from "@tanstack/react-query"
import axios from "axios"
import { useTodoDetailsMultipleIds } from "../Hooks/useTodoDetailsQuery"

const DynamicParallelPage = ({todoIds}) => {
    const result = useTodoDetailsMultipleIds(todoIds)
    const [res1, res2] = result   
    if (res1.isLoading) {
        return <h2>Loading...</h2>
    }
    if (res1.isError) {
        return <span>Error: </span>
    }

    const combinedData = [res1.data ?? {}, res2.data ?? {}]
    return (
        <>
        {combinedData.map(e => (
            <div>{e.title}</div>    
        ))}
        </>
    )
}

export default DynamicParallelPage
