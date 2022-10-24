import { IReducerFun } from "../../Utilies/typescriptTypes"
const { v4: uuidv4 } = require('uuid')
const initialValue = {
    todos: [],
    length: 0,
    isEditing: false,
    editingTodo: {}
}

const todoReducer: IReducerFun = (state = initialValue, action) => {
    switch (action.type) {
        case "ADD_TODO": return {
            ...state,
            todos: [action.payload, ...state.todos],
            length: state.length + 1
        }
        case "UPDATE_TODO": {
            const previousTodos = state.todos
            const updatedTodos = previousTodos.map((e: any) => {
                if (e.createdAt === action.payload.createdAt) {
                    return { text: action.payload.text, createdAt: action.payload.createdAt }
                }
                return e
            })
            return {
                ...state,
                todos: updatedTodos,
                length: updatedTodos.length
            }
        }
        case "DELETE_TODO": {
            return {
                ...state,
                todos: action.payload,
                length: action.payload.length
            }
        }
        case "UPDATE_EDITING_TODO": {
            return {
                ...state,
                editingTodo: action.payload
            }
        }
        default: return state
    }
}

export default todoReducer