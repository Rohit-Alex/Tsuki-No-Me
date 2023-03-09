import { ChangeEvent, FC, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import OutlinedInput from "@mui/material/OutlinedInput";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import DetailsListingAccordian from "../DetailsListingAccordian";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import FormHelperText from "@mui/material/FormHelperText";
import CloseIcon from "@mui/icons-material/Close";
import {
  IAddedListDetails,
  IInputData,
  IInputTypeObj,
  IProps,
  IStatementNo,
  IUpdatedStatementNoList,
} from "./types";
import "./styles.scss";

const inputTypeObj: IInputTypeObj = {
  paymentReference: {
    translatedKey: "PAYMENT_REFERENCE",
    placeholder: "Enter Payment reference",
    ariaLabelText: "payment-reference-input",
    name: "paymentReference",
  },
  note: {
    translatedKey: "NOTE",
    placeholder: "Enter Note",
    ariaLabelText: "note-input",
    name: "note",
  },
};

const AddDetailsModal: FC<IProps> = ({
  statementNoList,
  open,
  handleClose,
}) => {
  const [updatedStatementNoList, setUpdatedStatementNoList] =
    useState<IUpdatedStatementNoList[]>(statementNoList);
  const [inputData, setInputData] = useState<IInputData>({});
  const [statementNo, setStatementNo] = useState<IStatementNo[]>([]);
  const [addedListDetails, setAddedListDetails] = useState<IAddedListDetails[]>(
    []
  );

  const { t } = useTranslation();

  const activeMenus = useMemo(
    () => updatedStatementNoList.filter((e) => !e.isDisable),
    [updatedStatementNoList]
  );

  const sanitizedOptions = useMemo(() => {
    const disabledOptions = updatedStatementNoList.filter(
      (obj) => obj?.isDisable
    );
    const enabledOptions = updatedStatementNoList.filter(
      (obj) => !obj.isDisable
    );
    return [...enabledOptions, ...disabledOptions];
  }, [addedListDetails.length]);

  const handleChange = (data: IStatementNo | "all") => {
    if (data === "all") {
      setStatementNo((prev) => {
        if (prev.length === activeMenus.length) return [];
        return activeMenus;
      });
      return;
    }

    setStatementNo((prev) => {
      const cloned = [...prev];
      const requiredIndex = prev.findIndex(
        (e: IStatementNo) => e.id === data.id
      );
      if (requiredIndex !== -1) {
        cloned.splice(requiredIndex, 1);
        return cloned;
      } else {
        return [...cloned, data];
      }
    });
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAdd = () => {
    const updatedList = statementNo.map((selectedData) => ({
      ...selectedData,
      note: inputData.note,
      referenceId: inputData.paymentReference,
    }));
    setAddedListDetails((prev) => [...prev, ...updatedList]);

    setUpdatedStatementNoList((prev) => {
      // const prevCloned = structuredClone(prev);
      const prevCloned = [...prev];
      statementNo.forEach((e) => {
        const addedOptionIndex = prevCloned.findIndex(
          (item: IStatementNo) => item.id === e.id
        );
        const requiredDataCloned = { ...prevCloned[addedOptionIndex] };
        requiredDataCloned.isDisable = true;
        prevCloned[addedOptionIndex] = requiredDataCloned;
        // prevCloned[addedOptionIndex].isDisable = true;
      });
      return prevCloned;
    });
    setStatementNo([]);
    setInputData({});
  };

  const handleDelete = (itemToBeRemoved: IAddedListDetails) => {
    setAddedListDetails((prev) => {
      const prevCloned = [...prev];
      const requiredIndex = prevCloned.findIndex(
        (item: IAddedListDetails) => item.id === itemToBeRemoved.id
      );
      prevCloned.splice(requiredIndex, 1);
      return prevCloned;
    });

    setUpdatedStatementNoList((prev) => {
      // const prevCloned = structuredClone(prev);
      const prevCloned = [...prev];
      const addedOptionIndex = prevCloned.findIndex(
        (item: IStatementNo) => item.id === itemToBeRemoved.id
      );
      // prevCloned[addedOptionIndex].isDisable = false;
      // return prevCloned;
      const requiredDataCloned = { ...prevCloned[addedOptionIndex] };
      requiredDataCloned.isDisable = false;
      prevCloned[addedOptionIndex] = requiredDataCloned;
      return prevCloned;
    });
  };

  const handleSave = () => {
    console.log(addedListDetails);
    setAddedListDetails([]);
  };

  return (
    <Dialog
      className="modalbox-mutliSelector"
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={handleClose}
    >
      <DialogTitle>
        {t("PAYOUT_TITLE")}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <FormControl fullWidth sx={{ marginTop: "24px" }}>
          <FormLabel>Statement No</FormLabel>
          <Select
            inputProps={{ "aria-label": "Statement No" }}
            multiple
            displayEmpty
            size="small"
            value={statementNo}
            input={<OutlinedInput />}
            renderValue={(selected: IStatementNo[]) =>
              `${
                selected.length === 0
                  ? "Placeholder"
                  : `${selected.length} item selected`
              }`
            }
            MenuProps={{
              BackdropProps: { "aria-label": "backdrop-select" },
            }}
          >
            <MenuItem
              value="all"
              onClick={() => handleChange("all")}
              aria-label={"select-all"}
              disabled={
                addedListDetails.length === updatedStatementNoList.length
              }
            >
              <Checkbox
                indeterminate={
                  statementNo.length > 0 &&
                  statementNo.length < activeMenus.length
                }
                checked={
                  addedListDetails.length === updatedStatementNoList.length
                    ? false
                    : statementNo.length === activeMenus.length
                }
              />
              <ListItemText primary="Select All" />
            </MenuItem>
            {sanitizedOptions.map(
              (statementData: IUpdatedStatementNoList, index: number) => (
                <MenuItem
                  key={statementData.id}
                  value={statementData.id}
                  onClick={() => handleChange(statementData)}
                  disabled={statementData.isDisable}
                  aria-label={`option-${index + 1}`}
                >
                  <Checkbox
                    checked={
                      statementNo.findIndex(
                        (e: IStatementNo) => e.id === statementData.id
                      ) !== -1
                    }
                  />
                  <ListItemText primary={statementData.number} />
                </MenuItem>
              )
            )}
          </Select>
        </FormControl>
        {["paymentReference", "note"].map((type: string) => {
          const currentInputData = inputTypeObj[type as keyof IInputTypeObj];
          return (
            <FormControl key={type} fullWidth sx={{ marginTop: "24px" }}>
              <FormLabel sx={{ marginBottom: "6px" }} component="legend">
                {t(`${currentInputData.translatedKey}`)}
              </FormLabel>
              <OutlinedInput
                placeholder={`${currentInputData.placeholder}`} // Should you translated placeholder
                inputProps={{
                  "aria-label": currentInputData.ariaLabelText,
                  name: currentInputData.name,
                }}
                type="text"
                value={inputData[type as keyof IInputData] ?? ""}
                onChange={handleInputChange}
              />
              <FormHelperText>Some text</FormHelperText>
            </FormControl>
          );
        })}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "24px",
          }}
        >
          <Stack spacing={1.5} direction="row">
            <Button
              aria-label="btn-add"
              variant="outlined"
              size="small"
              onClick={handleAdd}
              disabled={statementNo.length === 0}
            >
              {"ADD +"}
            </Button>
          </Stack>
        </Box>

        <DetailsListingAccordian
          addedListDetails={addedListDetails}
          handleDelete={handleDelete}
        />

        <Box
          sx={{
            marginBlock: "24px",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Stack spacing={1.5} direction="row">
            <Button variant="contained" size="small" onClick={handleSave}>
              {"SAVE"}
            </Button>
            <Button variant="outlined" size="small" onClick={handleClose}>
              {"CANCEL"}
            </Button>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddDetailsModal;
