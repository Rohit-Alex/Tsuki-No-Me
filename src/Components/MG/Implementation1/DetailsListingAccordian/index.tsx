import * as React from "react";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Badge from "@mui/material/Badge";
import DeleteIcon from "@mui/icons-material/Delete";
import MailIcon from "@mui/icons-material/Mail";

import IconButton from "@mui/material/IconButton";
import { IProps } from "./types";

const DetailsListingAccordian: React.FC<IProps> = ({
  addedListDetails,
  handleDelete,
}) => {
  const [expanded, setExpanded] = React.useState(false);

  React.useEffect(() => {
    if (addedListDetails.length === 0) setExpanded(false);
  }, [addedListDetails.length]);
  return (
    <Accordion
      disableGutters
      elevation={0}
      expanded={expanded}
      className="accordion_ctn"
    >
      <AccordionSummary className="accordion_summary_ctn">
        <Typography>
          <>
            Added items
            <Badge
              data-testid="badge-count-testid"
              badgeContent={addedListDetails.length}
              color="secondary"
              style={{ marginLeft: "8px" }}
            >
              <MailIcon color="action" />
            </Badge>
          </>
        </Typography>
        <Button
          variant="outlined"
          aria-label="expand-accordion"
          size="small"
          onClick={() => setExpanded((prev) => !prev)}
          endIcon={
            <ArrowForwardIosSharpIcon
              sx={{
                fontSize: "0.9rem",
                ...(expanded && { transform: "rotate(90deg)" }),
              }}
            />
          }
        >
          {expanded ? "Collapse" : "Expand"}
        </Button>
      </AccordionSummary>
      <AccordionDetails className="acc_details_ctn">
        <List
          sx={{ width: "100%", bgcolor: "background.paper" }}
          className="acc_details_ctn-list_ctn"
        >
          {addedListDetails.map((value) => (
            <ListItem
              key={value.id}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDelete(value)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={`${value.number} ${value.note} ${value.referenceId}`}
              />
            </ListItem>
          ))}
        </List>
      </AccordionDetails>
    </Accordion>
  );
};

export default DetailsListingAccordian;
