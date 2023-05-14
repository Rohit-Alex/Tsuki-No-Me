import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

const axiosConfig = axios.create({
    baseURL: 'https://merchant-bp.in/api',
    headers: { 'content-type': 'application/json'}
})

const tokenInjection = (config: AxiosRequestConfig): AxiosRequestConfig => {
    const token = localStorage.getItem('token')
    if (!token) return config
    config.headers.token = token
    return config
}

const handleSuccessResponse = (response: AxiosResponse) => {

}

const handleErrorResponse = (error: AxiosError) => {

}

axiosConfig.interceptors.request.use(tokenInjection)
axiosConfig.interceptors.response.use(handleSuccessResponse, handleErrorResponse)

const getExtractor1 = (response: any) => {
    return response
}

const getExtractor2 = (response: any) => {
    return response
}


const GET_API_1 = (url: string, params: any, cancelToken: any) => axiosConfig.get(url, { params, cancelToken}).then(getExtractor1)
const GET_API_2 = (url: string, params: any, cancelToken: any) => axiosConfig.get(url, { params, cancelToken}).then(getExtractor2)