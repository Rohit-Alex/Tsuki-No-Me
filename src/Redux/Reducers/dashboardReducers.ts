import { IReducerFun } from "../../Utilies/typescriptTypes"
import { SIDEBAR_LAYOUT_CHANGED } from "../ActionConstants/dashboardActionConstants"

const initialValue = {
    isExpanded: true
}

const dashboardReducer: IReducerFun = (state = initialValue, action) => {
    switch (action.type) {
        case SIDEBAR_LAYOUT_CHANGED: return {
            ...state,
            isExpanded: action.payload
        }
        default: return state
    }
}

export default dashboardReducer