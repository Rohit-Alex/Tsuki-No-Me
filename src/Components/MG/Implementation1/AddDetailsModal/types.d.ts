export interface IStatementNo {
  id?: string;
  number?: string;
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
  note: string;
  referenceId: string;
};
