import { createTheme, ThemeProvider} from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useReactPaginatedQueryContext } from "../../Context/ReactQueryPaginatedContext";

const theme = createTheme({
    palette: {
        customColor: "#daecf8 "
    }
});
const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4
};

export default function ActionModal({ color, handleClose}) {
    const { useDeleteColor } = useReactPaginatedQueryContext()

    const { mutate: deleteMutate } = useDeleteColor()

    return (
        <ThemeProvider theme={theme}>
            <div>
                <Modal open={color} onClose={handleClose}>
                    <>
                        <Box sx={style}>
                            <Button onClick={() => {deleteMutate(color); handleClose();}}>Delete this color</Button>
                        </Box>
                    </>
                </Modal>
            </div>
        </ThemeProvider>
    );
}
