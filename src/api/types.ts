import { Dispatch } from '@reduxjs/toolkit';

export interface IError {
	name: string;
	message: string;
	code: string;
	stack: string;
	data?: unknown;
}

export interface ICommonApiResponse {
	success?: boolean;
	status?: boolean;
	message: string;
	status_code: string;
}

export interface IAPIResponse<T> extends ICommonApiResponse {
	data: T;
}

export interface IInitialState<T> {
	loading: boolean;
	isFetched: boolean;
	error: string;
	data?: T;
}

interface IACTION<T = unknown> {
	type: string | symbol;
	payload: T;
}

export interface IAPI_ACTION<T = unknown> extends IACTION<T> {
	meta: unknown;
	error: {
		name: string;
		message: string;
		stack: string;
	};
}

export type IDispatcherType = Dispatch<any>;

export type ILanguage = 'en' | 'hi' | 'kn' | 'te' | 'ta' | 'bn' | 'gu' | 'ml' | 'mr';

export interface IGetParams {
	[field: string]: string | number;
}