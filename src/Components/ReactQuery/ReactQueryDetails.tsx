import { useParams } from "react-router-dom"
import { useTodoDetailsQuery } from "../Hooks/useTodoDetailsQuery"

const ReactQueryDetails = () => {
    const { todoId } = useParams()
    const { data, error, isError, isLoading } = useTodoDetailsQuery(todoId)
    if (isLoading) {
        return <h2>Loading...</h2>
    }
    if (isError) {
        return <div>Error: {(error as any).message}</div>
    }
    return (
        <div>Details page
            <div>{data.title}</div>
        </div>
    )
}
export default ReactQueryDetails