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

export type IUpdatedStatementNoList = (IStatementNo & {
  isDisable?: boolean;
})[];

export type IAddedListDetails = IStatementNo & {
  note?: string;
  referenceId?: string;
};

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
