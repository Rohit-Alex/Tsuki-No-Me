import { Button, Input } from "antd"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addTodo, updateTodo } from "../../../Redux/Actions/Todos"
import { v4 as uuidv4 } from 'uuid';

const InputToDo = () => {
    const [inputVal, setInputVal] = useState('')
    const inputRef = useRef(null)
    const {  editingTodo } = useSelector(state => state.todos)
    const dispatch = useDispatch()
    const isEditing = Object.keys(editingTodo).length > 0
    useEffect(()=>{
        if (isEditing) {
            inputRef.current.focus()
            setInputVal()
            setInputVal(editingTodo.text)
        }
    }, [isEditing])


    const handleAddUpdate = () => {
        const newTodo = {
            createdAt: isEditing ? editingTodo.createdAt : uuidv4(),
            text: inputVal
        }
        isEditing ? dispatch(updateTodo(newTodo)) : dispatch(addTodo(newTodo))
        setInputVal('')
    }

    return (
        <div>
            <Input ref={inputRef} value={inputVal} style={{width: '260px'}} onChange={e => setInputVal(e.target.value)} placeholder='Enter a todo' />
            <Button disabled={!inputVal.trim()} onClick={handleAddUpdate}>{isEditing ? 'Update' : 'Add'}</Button>
        </div>
    )
}
export default InputToDo