import { Button } from "@mui/material";
import { selectOptions } from "Constant";
import { Suspense, useState } from "react";
import AddDetailsModal from "./AddDetailsModal";

const Implementation1: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Button
          onClick={() => setIsModalOpen(true)}
          aria-label="modal-state-trigger"
          variant="outlined"
        >
          Click to view Details
        </Button>
        {isModalOpen && (
          <AddDetailsModal
            statementNoList={selectOptions}
            open={isModalOpen}
            handleClose={() => setIsModalOpen(false)}
          />
        )}
      </Suspense>
    </>
  );
};

export default Implementation1;
