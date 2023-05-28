import { Button } from "antd"
import { useEffect, useState } from "react"

import InputToDo from "./ToDos/EnterToDo"
import ShowTodos from "./ToDos/ShowTodos"
import { triggerApplicationApi, useApplication } from "slices/ApplicationSlice"
import { useDispatch } from "react-redux"

const ReduxComponent = () => {
    const [, forceFulRender] = useState(false)
    const dispatch = useDispatch();
    const applicationData = useApplication();

    const apiCalls = async () => {
        await dispatch(triggerApplicationApi())
        console.log({ applicationData})
    }

    useEffect(() => {
        apiCalls()
    }, [])

    return (
        <div>
            Redux Component
            <Button onClick={()=>forceFulRender(prev => !prev)}>Re-Render</Button>
            <InputToDo />
            <ShowTodos />
        </div>
    )
}

export default ReduxComponent