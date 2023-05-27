import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, CancelToken } from "axios";

interface IError {
    name: string;
    message: string;
    code: string;
    stack: string;
    data?: unknown
}

interface IApiResponse<T> {
    success: boolean;
    message: string;
    data: T
}

interface IHttpWithApiRes<T> {
    status: number;
    statusText: string;
    data: IApiResponse<T>
}

interface IGetParams {
    [field: string]: string | number | boolean
}

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
    const err = {} 
    const { response } = error;
    if (!response) throw error;

}

const tokenInjection = (config: AxiosRequestConfig): AxiosRequestConfig => {
    const token = localStorage.getItem('token')
    if (!token) return config
    config.headers!.Authorization = `Bearer ${token}`
    config.headers!.token = token
    return config
}

const handleSuccessResponse = (response: AxiosResponse) => {

}

const handleErrorResponse = (error: AxiosError) => {
    if (error?.response?.status === 401) {
        // if at any time we get unauthorize then logout the user
        import('store').then(module => module.default.dispatch({type: 'auth/logout' }))
    }
    throw serializeError(error)

}

axiosConfig.interceptors.request.use(tokenInjection)
axiosConfig.interceptors.response.use(handleSuccessResponse, handleErrorResponse)

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
    return response
}

const postExtractor = <T>(response: AxiosResponse<IApiResponse<T>>) => {
    const { status, data, statusText } = response;
    if (status !== 200) throw new Error(statusText)
    if (!data || !data.success) throw new Error(data.message)
    return data.message
}


const GET_API_1 = <T>(url: string, params?: Partial<IGetParams>, cancelToken?: CancelToken): Promise<T> => axiosConfig.get<IApiResponse<T>>(url, { params, cancelToken}).then(getExtractor1)
const GET_API_2 =  <T>(url: string, params?: Partial<IGetParams>, cancelToken?: CancelToken): Promise<IHttpWithApiRes<T>> => axiosConfig.get<IApiResponse<T>>(url, { params, cancelToken}).then(getExtractor2)
const POST_API_1 = <T>(url: string, params?: Partial<IGetParams>, cancelToken?: CancelToken): Promise<T> => axiosConfig.post<IApiResponse<T>>(url, { params, cancelToken}).then(getExtractor1)
const POST_API_2 = (url: string, params?: Partial<IGetParams>, cancelToken?: CancelToken): Promise<string> => axiosConfig.post<IApiResponse<string>>(url, { params, cancelToken}).then(postExtractor)


// USAGE
export const AddCouponAPI = async (payload: IAddUpdateCouponPayload): Promise<string> =>
	POST_API_2(`/crm/addCoupon`, payload);

    export const CouponListApi = async (
	refreshList?: boolean,
	filters?: ICouponListFilter,
	cancelToken?: CancelToken,
): Promise<ICouponList[]> => GET_API_1<ICouponList[]>(`/crm/listCoupon`, { ...filters }, cancelToken);