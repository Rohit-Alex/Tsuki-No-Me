import { useReducer } from "react"
import createUseContext from "constate"
import { basicInfoReducer } from "../../ContextReducers/BasicInfoReducer"

const defaultState = {
    currentLang: 'en-us',
    userDetails: {
        firstName: '',
        lastName: '',
        city: '',
        state: '',
        country: '',
        gender: ''
    }
}

const initFunction = (initialData: object) => ({
    ...defaultState,
    ...initialData,
})

const BasicInfoFunc = ({ initialData = {} }) => {
    const [state, dispatch] = useReducer(basicInfoReducer, initialData, initFunction)

    const { currentLang, userDetails } = state

    const updateCurrentLang = (langCode: string) => {
        dispatch({
            type: 'UPDATE_CURRENT_LANG',
            payload: langCode
        })
    }

    return { currentLang, userDetails, updateCurrentLang }
}

const [BasicInfoProvider, useBasicInfoContext] = createUseContext(BasicInfoFunc)

export { BasicInfoProvider, useBasicInfoContext }

