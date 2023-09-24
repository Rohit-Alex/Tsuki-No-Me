import { useSelector } from 'react-redux';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { Get } from 'api/apiService';
import { IGetParams, IInitialState, IDispatcherType, IAPI_ACTION } from 'api/types';

const RESPONSE_INITIAL_STATE = <T>(isDataPresent = true, data: T = {} as T): IInitialState<T> => ({
	loading: false,
	isFetched: false,
	error: '',
	...(isDataPresent && { data }),
});

const validateScannedQr = (params: IGetParams): Promise<IValidateResponse> =>
	Get<IValidateResponse>(`${BASE_PATH_CARD_QR}/${API_URL.validate}`, params);

const validateScannedQrThunk = createAsyncThunk('validateQr', validateScannedQr);

export const ValidateScannedQrSlice = createSlice({
	name: 'validateScannedQr',
	initialState: RESPONSE_INITIAL_STATE<IValidateResponse>(),
	reducers: {
		CLEAR_ERROR: (state) => {
			state.error = '';
		},
		RESET: (state) => Object.assign(state, RESPONSE_INITIAL_STATE()),
	},
	extraReducers: {
		[validateScannedQrThunk.pending.toString()]: (state: ReturnType<typeof RESPONSE_INITIAL_STATE>) => {
			state.loading = true;
		},
		[validateScannedQrThunk.rejected.toString()]: (
			state: ReturnType<typeof RESPONSE_INITIAL_STATE>,
			action: IAPI_ACTION,
		) => {
			state.loading = false;
			state.error = action.error.message || 'Something went wrong';
			Toasty.error(state.error);
		},
		[validateScannedQrThunk.fulfilled.toString()]: (state, action: IAPI_ACTION<IValidateResponse>) => {
			state.loading = false;
			state.data = action.payload;
			state.isFetched = true;
		},
	},
});

interface IStates {
	[ValidateScannedQrSlice.name]: ReturnType<typeof ValidateScannedQrSlice.reducer>;
}

export const useValidateScannedQr = (): IInitialState<IValidateResponse> =>
	useSelector((state: IStates) => state[ValidateScannedQrSlice.name] || {});

export const triggerValidateScannedQrApi =
	(params: any) =>
	async (dispatch: IDispatcherType, getState: () => IStates): Promise<IValidateResponse> => {
		await dispatch(validateScannedQrThunk(params));
		return getState()[ValidateScannedQrSlice.name].data as IValidateResponse;
	};

export const resetValidateScannedQr =
	() =>
	async (dispatch: IDispatcherType): Promise<void> => {
		await dispatch(ValidateScannedQrSlice.actions.RESET());
		return;
	};
