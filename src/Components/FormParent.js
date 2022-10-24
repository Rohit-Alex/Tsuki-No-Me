import React from 'react'
import { useFormContext } from '../Context/FormContext'
import RuleGeneral from './RuleGeneral'
import RuleSubmit from './RuleSubmit'
const FormParent = () => {
    const { setFormData, setFormValidity, formState } = useFormContext()
    return (
        <>
            <RuleGeneral/>
            
            <RuleSubmit />
        </>
    )
}
export default FormParent