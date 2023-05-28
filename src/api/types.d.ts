export interface IGENERALIZED_RESPONSE <T>{
    loading: boolean;
    fetched: boolean;
    data: T;
    error: {
        message: string;
    }
}

interface IError {
    name: string;
    message: string;
    code: string;
    stack: string;
    data?: unknown
}

interface IApiResponse<T> {
    status: number,
    success: boolean;
    message: string;
    data: T
}

interface IHttpWithApiRes<T> {
    httpStatus: number;
    httpStatusText: string;
    data: IApiResponse<T>
}

interface IGetParams {
    [field: string]: string | number | boolean
}

export interface IDispatcherType {
    type: string;
    payload: string;
}

export interface IACTION<T = unknown> {
	type: string | symbol;
	payload: T;
    error?: {
        message: string;
    }
}

export interface IApplicationData  {
    "status": string,
    "id": number,
    "activation_date": number
}
