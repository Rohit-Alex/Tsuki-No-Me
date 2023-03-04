import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import DetailsListingAccordian from "../DetailsListingAccordian";
import {
  IAddedListDetails,
  IProps,
  IStatementNo,
  IUpdatedStatementNoList,
} from "./types";
import "./styles.scss";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 550,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const AddDetailsModal: React.FC<IProps> = ({
  statementNoList,
  open,
  handleClose,
}) => {
  const [updatedStatementNoList, setUpdatedStatementNoList] =
    React.useState<IUpdatedStatementNoList>(statementNoList);
  const [paymentReference, setPaymentReference] = React.useState("");
  const [note, setNote] = React.useState("");
  const [statementNo, setStatementNo] = React.useState<IStatementNo>({});
  const [addedListDetails, setAddedListDetails] = React.useState<
    IAddedListDetails[]
  >([]);

  const { t } = useTranslation();

  const handleChange = (statementData: IStatementNo) => {
    setStatementNo(statementData);
  };

  const handleAdd = () => {
    // First add it to the details list
    setAddedListDetails((prev) => [
      ...prev,
      { ...statementNo, note, referenceId: paymentReference },
    ]);
    // Now added statementNo should be disabled so that it can't be added again
    setUpdatedStatementNoList((prev) => {
      // const prevCloned = structuredClone(prev);
      const prevCloned = [...prev];

      const addedOptionIndex = prevCloned.findIndex(
        (item: IStatementNo) => item.id === statementNo.id
      );
      // prevCloned[addedOptionIndex].isDisable = true;
      // return prevCloned;
      const requiredDataCloned = { ...prevCloned[addedOptionIndex] };
      requiredDataCloned.isDisable = true;
      prevCloned[addedOptionIndex] = requiredDataCloned;
      return prevCloned;
    });
    // Now clear every fields
    setStatementNo({});
    setPaymentReference("");
    setNote("");
  };

  const handleDelete = (itemToBeRemoved: IAddedListDetails) => {
    //Remove the item from added list:
    setAddedListDetails((prev) => {
      const prevCloned = [...prev];
      const requiredIndex = prevCloned.findIndex(
        (item: IAddedListDetails) => item.id === itemToBeRemoved.id
      );
      prevCloned.splice(requiredIndex, 1);
      return prevCloned;
    });

    // Now enable the statementNo options that got removed
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

  return (
    <Modal
      className="modalbox-mutliSelector"
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Box sx={style}>
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
          <Typography id="transition-modal-title" variant="h6" component="h2">
            {t("PAYOUT_TITLE")}
          </Typography>
          <FormControl fullWidth sx={{ marginTop: "24px" }}>
            <InputLabel id="demo-controlled-open-select-label">
              Statement No
            </InputLabel>
            <Select
              aria-label="select-ctn-statement-no"
              labelId="demo-controlled-open-select-label"
              id="demo-controlled-open-select"
              value={statementNo.number ?? ""}
              label="Statement No"
            >
              {updatedStatementNoList.map((statementData, index) => (
                <MenuItem
                  key={statementData.id}
                  value={statementData.number}
                  disabled={statementData?.isDisable}
                  onClick={() => handleChange(statementData)}
                  aria-label={`option-${index + 1}`}
                >
                  {statementData.number}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ margin: "24px 0" }}>
            <TextField
              id="payment-reference-id"
              label={t("PAYMENT_REFERENCE")}
              placeholder="Enter Payment reference"
              variant="outlined"
              onChange={(e) => setPaymentReference(e.target.value)}
              value={paymentReference}
            />
          </FormControl>
          <FormControl fullWidth sx={{ marginBottom: "24px" }}>
            <TextField
              id="note-id"
              label="NOTE"
              placeholder="Enter note"
              variant="outlined"
              onChange={(e) => setNote(e.target.value)}
              value={note}
            />
          </FormControl>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Stack spacing={1.5} direction="row">
              <Button
                variant="outlined"
                size="small"
                onClick={handleAdd}
                disabled={Object.keys(statementNo).length === 0}
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
              paddingTop: "10px",
              marginTop: "15px",
            }}
          >
            <Stack spacing={1.5} direction="row">
              <Button
                variant="contained"
                size="small"
                onClick={() => console.log(addedListDetails)}
              >
                {"SAVE"}
              </Button>
              <Button variant="outlined" size="small" onClick={handleClose}>
                {"CANCEL"}
              </Button>
            </Stack>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default AddDetailsModal;
