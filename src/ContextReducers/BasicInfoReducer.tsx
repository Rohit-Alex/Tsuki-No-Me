type IState = {
    currentLang: string 
    userDetails: {[key: string]: string}
}
export const basicInfoReducer = (state: IState, action: { type: string, payload?: any}) => {
    switch (action.type) {
        case "UPDATE_CURRENT_LANG":
            return {
                ...state,
                currentLang: action.payload,
            }
        case 'UPDATE_USER_DETAILS':
            return {
                ...state,
                userDetails: action.payload
            }
        default:
            return state
    }
}