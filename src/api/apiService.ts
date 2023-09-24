import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, CancelToken } from 'axios';


import { IAPIResponse, IError, IGetParams } from './types';

const Request = axios.create({
	baseURL: process.env.REACT_APP_BASEPATH_MERCHANT,
	headers: { 'Content-Type': 'application/json' },
});

const serializeError = (error: AxiosError): IError => {
	const { response } = error;
	if (!response) throw error;
	const { status, statusText, data } = response;
	const { message, responseMessage } = data;
	let errorMsg = '';
	try {
		errorMsg = JSON.parse(message || responseMessage).error.debug_msg;
	} catch (e) {
		errorMsg = message || responseMessage;
	}
	const errorObj = {
		name: 'API ERROR',
		message: errorMsg || statusText || `API FAILED (${status})`,
		code: status.toString(),
		stack: JSON.stringify(error.toJSON()),
	};
	return errorObj;
};

const tokenHeaderInterceptor = (config: AxiosRequestConfig): AxiosRequestConfig => {
	const token = loadState(TOKEN_SESSION_KEY);
	if (!token) return config;
	config.headers['token'] = token;
	if (config?.url?.includes('https://cards-qr.bharatpe')) {
		config.headers['entity'] = 'MERCHANT';
	}
	return config;
};

const onErrorInterceptor = (error: AxiosError): IError => {
	throw serializeError(error);
};

Request.interceptors.request.use(tokenHeaderInterceptor);
Request.interceptors.response.use(undefined, onErrorInterceptor);

const responseExtractor = <T>(response: AxiosResponse<IAPIResponse<T>>) => {
	const { status, data, statusText } = response;
	const { message, success, status: externalStatus } = data;
	if (!data || !status || status !== 200) throw new Error(statusText);
	if (!success && !externalStatus) throw new Error(message);
	return data.data;
};

const httpResponseExtractor = <T>(response: AxiosResponse<T>) => {
	const { status, data, statusText } = response;
	if (!data || !status || status !== 200) throw new Error(statusText);
	return data;
};

export const Get = <T>(path: string, params?: Partial<IGetParams>, cancelToken?: CancelToken): Promise<T> =>
	Request.get<IAPIResponse<T>>(path, { params, cancelToken }).then(responseExtractor);

export const HttpGet = <T>(path: string, params?: Partial<IGetParams>, cancelToken?: CancelToken): Promise<T> =>
	Request.get<T>(path, { params, cancelToken }).then(httpResponseExtractor);

export const Post = <T>(path: string, payload: unknown, cancelToken?: CancelToken): Promise<T> =>
	Request.post<IAPIResponse<T>>(path, payload, { cancelToken }).then(responseExtractor);

export const HttpPost = <T>(path: string, payload: unknown, cancelToken?: CancelToken): Promise<T> =>
	Request.post<T>(path, payload, { cancelToken }).then(httpResponseExtractor);
