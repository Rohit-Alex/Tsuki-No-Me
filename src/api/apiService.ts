import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, CancelToken } from "axios";
import { IApiResponse, IError, IGetParams, IHttpWithApiRes } from "./types";

export interface ICouponList {
	id?: string;
	couponCode: string;
	planId: number;
	eligibleFrom: string;
}

const axiosConfig = axios.create({
    baseURL: 'https://merchant-bp.in/api',
    headers: { 'content-type': 'application/json'}
})

const serializeError = (error: AxiosError): IError => {
    const err = {} as IError
    const { response } = error;
    if (!response) throw error;
    return err

}

const tokenInjection = (config: AxiosRequestConfig): AxiosRequestConfig => {
    const token = localStorage.getItem('token')
    if (!token) return config
    config.headers!.Authorization = `Bearer ${token}`
    config.headers!.token = token
    return config
}

const handleSuccessResponse = (response: AxiosResponse) => {
    return response
}

const handleErrorResponse = (error: AxiosError) => {
    if (error?.response?.status === 401) {
        // if at any time we get unauthorize then logout the user
        // import('store').then(module => module.default.dispatch({type: 'auth/logout' }))
    }
    throw serializeError(error)

}

axiosConfig.interceptors.request.use(tokenInjection)
axiosConfig.interceptors.response.use(handleSuccessResponse, handleErrorResponse) // First argument here if for each success response


const getExtractor1 = <T>(response: AxiosResponse<IApiResponse<T>>) => {
    const { status, data, statusText } = response;
    if (status !== 200) throw new Error(statusText)
    if (!data || !data.success) throw new Error(data.message)
    return data.data
}

const getExtractor2 =  <T>(response: AxiosResponse<IApiResponse<T>>): IHttpWithApiRes<T> => {
    const { status, data, statusText } = response;
    if (status !== 200) throw new Error(statusText)
    if (!data || !data.success) throw new Error(data.message)
    return { httpStatus: status, httpStatusText: statusText, data }
}

const postExtractor = <T>(response: AxiosResponse<IApiResponse<T>>) => {
    const { status, data, statusText } = response;
    if (status !== 200) throw new Error(statusText)
    if (!data || !data.success) throw new Error(data.message)
    return data.message
}


export const GET_API_1 = <T>(url: string, params?: Partial<IGetParams>, cancelToken?: CancelToken): Promise<T> => axiosConfig.get<IApiResponse<T>>(url, { params, cancelToken}).then(getExtractor1)
export const GET_API_2 =  <T>(url: string, params?: Partial<IGetParams>, cancelToken?: CancelToken): Promise<IHttpWithApiRes<T>> => axiosConfig.get<IApiResponse<T>>(url, { params, cancelToken}).then(getExtractor2)

export const POST_API_1 = <T>(url: string, params?: Partial<IGetParams>, cancelToken?: CancelToken): Promise<T> => axiosConfig.post<IApiResponse<T>>(url, { params, cancelToken}).then(getExtractor1)
export const POST_API_2 = (url: string, params?: Partial<IGetParams>, cancelToken?: CancelToken): Promise<string> => axiosConfig.post<IApiResponse<string>>(url, { params, cancelToken}).then(postExtractor)
