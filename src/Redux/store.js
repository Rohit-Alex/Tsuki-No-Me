import rootReducer from "./Reducers/rootReducers";
import { configureStore } from "@reduxjs/toolkit";
import logger from 'redux-logger'

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger)
})

export default store;