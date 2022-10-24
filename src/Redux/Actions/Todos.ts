
export const addTodo = (todo: {text: string, createdAt: string}) => ({type: "ADD_TODO", payload: todo })
export const updateTodo = (todo: {text: string, createdAt: string}) => ({type: "UPDATE_TODO", payload: todo })
export const deleteTodo = (updatedTodo: any) => ({type: 'DELETE_TODO', payload: updatedTodo})
export const updateIsEditing = (isEditing: any) => ({type: 'UPDATE_IS_EDITING', payload: isEditing})
export const updateEditingTodo = (editingTodo: any) => ({type: 'UPDATE_EDITING_TODO', payload: editingTodo})
