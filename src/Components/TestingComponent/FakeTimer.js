import * as React from "react";
import Box from "@mui/material/Box";
import { Button, Typography } from "@mui/material";

export default function FakeTimer() {
    const [flag, setFlag] = React.useState(false);

    const btnClickHandler = () => {
        console.log("Inside handler fn")
        setTimeout(() => {
            console.log("Inside setTimeout fn")
            setFlag((prev) => !prev);
        }, 1800);
    };

    return (
        <Box sx={{ height: 400, width: "100%" }}>
            <Button onClick={btnClickHandler}>Timeout</Button>
            {flag && <Typography variant="h4"> I am visible</Typography>}
        </Box>
    );
}
