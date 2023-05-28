import { useSelector } from 'react-redux';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { GENERALIZED_RESPONSE } from 'api/constants';
import { getApplicationData } from 'api/apiCalls';
import { IACTION, IApplicationData, IHttpWithApiRes } from 'api/types';
import Toasty from 'Components/Toasty';

const setAPIError = (state: ReturnType<typeof GENERALIZED_RESPONSE>, action: IACTION): void => {
	state.loading = false;
	state.error = action?.error?.message || 'Something went wrong';
	action?.error?.message !== 'Please contact your KAM to process your order.' && Toasty.error(state.error);
};

const application = createAsyncThunk('get/application', getApplicationData);

export const ApplicationSlice = createSlice({
	name: 'application',
	initialState: GENERALIZED_RESPONSE(),
	reducers: {
		CLEAR_ERROR: (state) => {
			state.error = '';
		},
		RESET: (state) => Object.assign(state, GENERALIZED_RESPONSE()),
	},
	// extraReducers: {
	// 	[application.pending.toString()]: (state: ReturnType<typeof GENERALIZED_RESPONSE>) => {
	// 		state.data = {};
	// 		state.error = '';
	// 		state.loading = true;
	// 		state.fetched = false;
	// 	},
	// 	[application.rejected.toString()]: setAPIError,
	// 	[application.fulfilled.toString()]: (state, action: IACTION<IApplicationData>) => {
	// 		state.loading = false;
	// 		state.fetched = true;
	// 		state.error = '';
	// 		state.data = action.payload;
	// 	},
	// },
	extraReducers: (builder) => {
		builder
		.addCase(application.pending, (state) => {
			state.data = {};
			state.error = '';
			state.loading = true;
			state.fetched = false;
		})
		.addCase(application.rejected, (state, action) => {
			state.loading = false;
			state.error = action.error?.message || 'Something went wrong';
			action.error?.message !== 'Please contact your KAM to process your order.' && Toasty.error(state.error);
		})
		.addCase(application.fulfilled, (state, action) => {
			state.loading = false;
			state.fetched = true;
			state.error = '';
			state.data = action.payload.data;
		});
	},
});

interface IApplicationStates {
	[ApplicationSlice.name]: ReturnType<typeof ApplicationSlice.reducer>;
}

export const useApplication = () => useSelector((state: IApplicationStates) => state[ApplicationSlice.name] || {});

export const triggerApplicationApi = () => async (dispatch: any): Promise<void> => {
	await dispatch(application());
};

export const resetApplication = () => async (dispatch: any): Promise<void> => {
	await dispatch(ApplicationSlice.actions.RESET());
};