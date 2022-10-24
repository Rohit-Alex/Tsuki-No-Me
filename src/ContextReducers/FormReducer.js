import { findIndex, isEmpty, set as _set } from 'lodash'

const setFormValidity = (state, payload) => {
    const { key, isValid, error } = payload
    const { isFormValid: oldIsFormValid, errors: oldErrors } = state

    const errors = [...oldErrors]
    const errorKeyIndex = findIndex(oldErrors, (err) => err[0] === key)

    if (errorKeyIndex >= 0) {
        errors.splice(errorKeyIndex, 1)
    }

    if (!isValid) {
        errors.push([key, error])
    }

    return {
        ...state,
        errors,
        isFormValid: (isEmpty(errors) || oldIsFormValid) && isValid,
    }
}

const formReducer = (state, { type, payload }) => {
    switch (type) {
        case 'SET_FORM_DATA': {
            const data = _set(state.data, payload.key, payload.value)

            return {
                ...state,
                data,
            }
        }

        case 'SET_PREVIOUS_FORM_DATA': {
            return {
                ...state,
                previousData: payload,
            }
        }

        case 'SET_FORM_VALIDITY':
            return setFormValidity(state, payload)

        case 'DELETE_FORM_DATA': {
            const newData = state.data

            payload.forEach((e) => delete newData[e])

            return {
                ...state,
                data: newData,
            }
        }

        case 'RESET_FORM_DATA':
            return {
                ...state,
                isFormValid: true,
                data: {},
                errors: [],
            }

        case 'RELOAD_FORM':
            return {
                ...state,
                isFormValid: true,
            }

        default:
            return state
    }
}

export default formReducer