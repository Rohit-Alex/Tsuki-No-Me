import { useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { updateEditingTodo, deleteTodo } from "../../../Redux/Actions/Todos"
import { isEqual } from 'lodash'
import usePrevious from "../../Project/Hooks/usePreviousValue"
const ShowTodos = () => {
    const { todos = [] } = useSelector(state => state.todos)
    const dispatch = useDispatch()
    const previousTodoVal = usePrevious(todos)

    const deleteTodoFn = (deletingTodo) => {
        const copied = [...todos];
        dispatch(deleteTodo(copied.filter(ele => deletingTodo.createdAt !== ele.createdAt)))
    }
    const editTodo = (updatingTodo) => {
        dispatch(updateEditingTodo(updatingTodo))
    }

    const useEffectDependency = isEqual(previousTodoVal, todos)

    useEffect(()=>{
        console.log("useEffect dependency ------>>>", previousTodoVal, todos)
        if (!useEffectDependency) console.log("modified useEffect dependency ------>>>")
    }, [todos])

    return todos.map(e => <div key={e.createdOn} style={{display: 'flex', justifyContent: 'space-between', columnGap: '20px'}}>
        <h4>{e.text}</h4> <div style={{ display: 'flex', justifyContent: 'space-between', columnGap: '20px' }}><span onClick={() => editTodo(e)}>Edit</span> <span onClick={() => deleteTodoFn(e)}>Delete</span></div>
    </div>)
}
export default ShowTodos