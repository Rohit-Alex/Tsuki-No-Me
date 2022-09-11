import { API_CALLED } from "../ActionConstants/apiDataActionConstants"

const initialValue = {
    loading: false,
    pagination: {},
    responseData: []
}

const apiDataReducer = (state = initialValue, action) => {
    switch (action.type) {
        case API_CALLED: return {
            ...state,
            loading: true
        }
        default: return state
    }
}

export default apiDataReducer