import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [errorEmail, setErrorEmail] = useState("");

  const handleSignIn = () => {
    console.log("handleSignIn");
  };

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
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              maxWidth: "400px",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.8rem",
            }}
          >
            <Typography variant="h4">Reset Password</Typography>
            <TextField
              fullWidth
              label="email*"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrorEmail("");
              }}
              error={errorEmail !== ""}
              helperText={errorEmail}
            />
            <Button onClick={handleSignIn} variant="contained" fullWidth>
              sign in
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
