import { Box, Grid, IconButton } from "@mui/material";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function Onboarding({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <Grid item xs={false} sm={4} md={6} lg={7} xl={8} />
      <Grid
        item
        xs={12}
        sm={8}
        md={6}
        lg={5}
        xl={4}
        bgcolor={"background.transperent"}
        sx={{
          backdropFilter: "blur(4px)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box>
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBackIcon fontSize="large" />
          </IconButton>
        </Box>
        <Box></Box>
        {children}
      </Grid>
    </Grid>
  );
}
