import { Button } from "antd"
import axios from "axios"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { apiCalled, getApiData } from "../../Redux/Actions/GetApiData"
import InputToDo from "./ToDos/EnterToDo"
import ShowTodos from "./ToDos/ShowTodos"

const ReduxComponent = () => {
    const [, forceFulRender] = useState(false)
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