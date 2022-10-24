import { combineReducers } from "redux";
import dashboardReducer from "./dashboardReducers";
import apiDataReducer from "./getApiDataReducers";
import todoReducer from "./todoReducers";

const rootReducer = combineReducers({
    apiData: apiDataReducer,
    dashboard: dashboardReducer,
    todos: todoReducer
})

export default rootReducer