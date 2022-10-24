import { Button } from "antd"
import { useEffect, useRef } from "react"
import { useLocation } from "react-router-dom"
import { useFormContext } from "../Context/FormContext"

const RuleSubmit = () => {
    const { formState } = useFormContext()
    const { data: formData, previousData } = formState
    const formDataRef = useRef(formData)
    const {state: {data = {}} = {}} = useLocation()
    const initialData = data
    useEffect(()=>{
        formDataRef.current = formData
    },[])
    return (
        <>
            <Button>Add</Button>
            <Button>Cancel</Button>

        </>
    )
}
export default RuleSubmit