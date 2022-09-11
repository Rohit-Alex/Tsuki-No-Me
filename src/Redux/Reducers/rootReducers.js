import { combineReducers } from "redux";
import dashboardReducer from "./dashboardReducers";
import apiDataReducer from "./getApiDataReducers";

const rootReducer = combineReducers({
    apiData: apiDataReducer,
    dashboard: dashboardReducer
})

export default rootReducer