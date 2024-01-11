import { combineReducers } from '@reduxjs/toolkit';
// import { ApplicationSlice } from "slices/ApplicationSlice";
import dashboardReducer from "./dashboardReducers";
import apiDataReducer from "./getApiDataReducers";
import todoReducer from "./todoReducers";

const rootReducer = combineReducers({
    apiData: apiDataReducer,
    dashboard: dashboardReducer,
    todos: todoReducer,
    // [ApplicationSlice.name]: ApplicationSlice.reducer,
})

export default rootReducer