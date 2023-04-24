export interface IStatementNo {
  id?: string;
  number?: string;
}

export interface IInputData {
  note?: string;
  paymentReference?: string;
}

export interface IProps {
  statementNoList: IStatementNo[];
  open: boolean;
  handleClose: () => void;
}

export type IUpdatedStatementNoList = IStatementNo & {
  isDisable?: boolean;
};

export type IAddedListDetails = IStatementNo & {
  note?: string;
  referenceId?: string;
};

// Note above IAddedListDetails can also be made using the below statemnt

interface IAddedListDetails extends IStatementNo {
  note?: string;
  referenceId?: string;
}

export interface IIndividualInputData {
  translatedKey: string;
  placeholder: string;
  ariaLabelText: string;
  name: string;
}

export interface IInputTypeObj {
  paymentReference: IIndividualInputData;
  note: IIndividualInputData;
}

export interface IInitialState {
	loading: boolean;
	isFetched: boolean;
	error: string;
	data: unknown;
}
export interface IYearlyCashbackApiData {
	is_cashback_given: boolean;
	device_serial: string | null;
	cashback_id: number | null;
	cashback_amount: number | null;
	cashback_date: string | null;
	terminal_activation_date: string | null;
	terminal_order_date: null;
	payment_utr: string | null;
}
interface IResponse extends Omit<IInitialState, 'data'> {
	data: IYearlyCashbackApiData;
}
