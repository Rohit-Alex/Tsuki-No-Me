import { useReducer } from 'react'
import createUseContext from 'constate'
import { isEmpty, findLast, cloneDeep } from 'lodash'

import formReducer from '../ContextReducers/FormReducer'

const defaultState = {
    isFormValid: true,
    data: {},
    errors: [],
    previousData: {},
}

const init = (initialData) => ({
    ...defaultState,
    data: {
        ...initialData,
    },
})

const useFormState = ({ initialData = {} }) => {
    const [formState, dispatch] = useReducer(formReducer, initialData, init)

    const previousData = (value) => {
        dispatch({
            type: 'SET_PREVIOUS_FORM_DATA',
            payload: cloneDeep(value),
        })
    }

    const setFormData = (key, value) => {
        previousData(formState.data)
        dispatch({
            type: 'SET_FORM_DATA',
            payload: { key, value },
        })
    }

    const setFormValidity = (key, isValid, error = {}) => {
        dispatch({
            type: 'SET_FORM_VALIDITY',
            payload: {
                key,
                isValid,
                error,
            },
        })
    }

    const deleteFormData = (key) => {
        dispatch({
            type: 'DELETE_FORM_DATA',
            payload: key,
        })
    }

    const deleteRuleData = (key) => {
        dispatch({
            type: 'DELETE_RULE_DATA',
            payload: key,
        })
    }

    const reloadForm = () => {
        dispatch({ type: 'RELOAD_FORM' })
    }

    const getFormError = () => {
        const { errors } = formState

        return findLast(errors, ([, errObject]) => !isEmpty(errObject)) || []
    }

    const getFormErrorByKey = (key) => {
        const { errors } = formState

        return errors.find(([errorKey]) => errorKey === key)
    }

    const isFormError = () => {
        const { errors } = formState
        return errors.length > 0
    }

    return {
        formState,
        setFormData,
        setFormValidity,
        getFormError,
        isFormError,
        deleteFormData,
        deleteRuleData,
        reloadForm,
        getFormErrorByKey,
    }
}

const [FormProvider, useFormContext] = createUseContext(useFormState)
export { FormProvider, useFormContext }