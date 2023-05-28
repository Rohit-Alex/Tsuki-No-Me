import React from 'react';
import { ToastOptions, toast } from 'react-toastify';

interface Props {
	message: string;
}

const ToastMessage: React.FC<Props> = ({ message }) => {
	return <div>{message}</div>;
};

export default {
	error: (message: string, options?: ToastOptions) =>
		toast.error(<ToastMessage message={message} />, options),
	info: (message: string, options?: ToastOptions) =>
		toast.info(<ToastMessage message={message} />, options),
	success: (message: string, options?: ToastOptions) =>
		toast.success(<ToastMessage message={message} />, options),
};