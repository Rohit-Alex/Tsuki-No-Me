/* eslint-disable prettier/prettier */
import { useSelector } from 'react-redux';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { FetchCardQrEligibitly } from 'Services';
import {
	IAPI_ACTION,
	ICardsQrEligibilityResponse,
	IDispatcherType,
	IGenericInitialState,
	RESPONSE_INITIAL_STATE,
} from 'types';

const setAPIError = (state: ReturnType<typeof RESPONSE_INITIAL_STATE>, action: IAPI_ACTION): void => {
	state.loading = false;
	state.error = action.error.message || 'Something went wrong';
	Toasty.error(state.error);
};

const cardsQrEligibilityThunk = createAsyncThunk('cardsQrEligibility', FetchCardQrEligibitly);

export const CardsQrEligibilitySlice = createSlice({
	name: 'cardsQrEligibility',
	initialState: RESPONSE_INITIAL_STATE<ICardsQrEligibilityResponse>(),
	reducers: {
		CLEAR_ERROR: (state) => {
			state.error = '';
		},
		RESET: (state) => Object.assign(state, RESPONSE_INITIAL_STATE()),
		UPDATE: (state, action) => {
			state.data = action.payload;
		},
	},
	extraReducers: {
		[cardsQrEligibilityThunk.pending.toString()]: (state: ReturnType<typeof RESPONSE_INITIAL_STATE>) => {
			state.data = {};
			state.error = '';
			state.loading = true;
			state.isFetched = false;
		},
		[cardsQrEligibilityThunk.rejected.toString()]: setAPIError,
		[cardsQrEligibilityThunk.fulfilled.toString()]: (
			state: ReturnType<typeof RESPONSE_INITIAL_STATE>,
			action: IAPI_ACTION<ICardsQrEligibilityResponse>,
		) => {
			const { payload } = action;
			state.loading = false;
			state.isFetched = true;
			state.error = '';
			state.data = payload;
		},
	},
});

interface IStates {
	[CardsQrEligibilitySlice.name]: ReturnType<typeof CardsQrEligibilitySlice.reducer>;
}

export const useCardsQrEligibility = (): IGenericInitialState<ICardsQrEligibilityResponse> =>
	useSelector((state: IStates) => state[CardsQrEligibilitySlice.name] || {});

export const triggerQrPlusTransactionsApi =
	(params: any) =>
	async (dispatch: IDispatcherType, getState: () => IStates): Promise<ICardsQrEligibilityResponse> => {
		await dispatch(cardsQrEligibilityThunk(params));
		return getState()[CardsQrEligibilitySlice.name].data as ICardsQrEligibilityResponse;
	};

export const resetCardsQrEligibility =
	() =>
	async (dispatch: IDispatcherType): Promise<void> => {
		await dispatch(CardsQrEligibilitySlice.actions.RESET());
		return;
	};

export const updateCardsQrEligibilityData =
	(payload: boolean) =>
	async (dispatch: IDispatcherType): Promise<void> => {
		await dispatch(CardsQrEligibilitySlice.actions.UPDATE(payload));
		return;
	};
