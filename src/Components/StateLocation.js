import { useLocation } from "react-router-dom"

const StateLocation = () => {
    const location = useLocation()
    const { state: { isEditable = true } } = location
    return (
        <div>
            {isEditable ? <div>Edit</div> : <div>Add</div>}
        </div>
    )
}
export default StateLocation