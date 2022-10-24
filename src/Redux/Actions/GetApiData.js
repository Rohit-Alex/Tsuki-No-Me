import axios from "axios"
import { API_CALLED, API_DATA_FETCHED, API_ERROR } from "../ActionConstants/apiDataActionConstants"

export const apiCalled = () => {
    return {
        type: API_CALLED
    }
}

export const apiFetchedSuccessful = (data) => {
    return {
        type: API_DATA_FETCHED,
        payload: data
    }
}

export const apiHandleError = (err) => {
    return {
        type: API_ERROR,
        payload: err
    }
}

export const getApiData = () => {
    return (dispatch) => {
        console.log("inside dispatch")
        dispatch(apiCalled())
        axios.get('https://jsonplaceholder.typicode.com/users')
        .then(res => {
            const users = res.data
            dispatch(apiFetchedSuccessful(users))
        })
        .catch(error => {
            const errMsg = error.message
            dispatch(apiHandleError(errMsg))
        })
    }
}