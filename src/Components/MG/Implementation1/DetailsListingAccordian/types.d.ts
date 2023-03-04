import { IAddedListDetails } from "../AddDetailsModal/types";

export interface IProps {
  addedListDetails: IAddedListDetails[];
  handleDelete: (v: IAddedListDetails) => void;
}
