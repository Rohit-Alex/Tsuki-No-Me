import { createSlice } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { IDispatcherType } from 'types';

const INITIAL_STATE = {
	loading: false,
};

export const LoaderSlice = createSlice({
	name: 'loader',
	initialState: INITIAL_STATE,
	reducers: {
		showLoader() {
			return {
				loading: true,
			};
		},
		hideLoader() {
			return {
				loading: false,
			};
		},
	},
});

const { showLoader, hideLoader } = LoaderSlice.actions;

export const dispatchShowLoader =
	() =>
	async (dispatch: IDispatcherType): Promise<void> => {
		await dispatch(showLoader());
		return;
	};

export const dispatchHideLoader =
	() =>
	async (dispatch: IDispatcherType): Promise<void> => {
		await dispatch(hideLoader());
		return;
	};

interface ISampleStates {
	[LoaderSlice.name]: ReturnType<typeof LoaderSlice.reducer>;
}

const loaderSelector = (state: ISampleStates): boolean => {
	return state[LoaderSlice.name]?.loading || false;
};

export const useLoader = (): boolean => useSelector(loaderSelector);
