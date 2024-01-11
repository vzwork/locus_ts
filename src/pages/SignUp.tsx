import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useEffect, useState } from "react";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { IAccount } from "../data/account";
import ManagerAccount from "../data/_1_ManagerAccount/ManagerAccount";
import useAccount from "../data/_1_ManagerAccount/useAccount";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { stateCollections } from "../data/db";

export default function SignUp() {
  const managerAccount = ManagerAccount;
  const db = getFirestore();
  const account = useAccount();
  const auth = getAuth();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  const [email, setEmail] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorPassword, setErrorPassword] = useState("");

  const handleProceed = async () => {
    const res = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    ).catch((error) => {
      if (error.code === "auth/email-already-in-use") {
        setErrorEmail("That email address is already in use!");
      } else if (error.code === "auth/invalid-email") {
        setErrorEmail("That email address is invalid!");
      } else if (error.code === "auth/weak-password") {
        setErrorPassword("That password is weak!");
      } else if (error.code === "auth/missing-password") {
        setErrorPassword("Password is required!");
      } else {
        setErrorEmail("Something went wrong!");
      }
    });

    if (!res) return;

    const newAccount: IAccount = {
      email: email,
      id: res.user.uid,
      username: "user",
      firstName: "Mr.",
      lastName: "Anonymous",
      avatarURL: "",
      role: "user",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    managerAccount.setAccount(newAccount);
    navigate(-2);
  };

  useEffect(() => {
    setErrorEmail("");
  }, [email, password]);

  useEffect(() => {
    setErrorPassword("");
  }, [email, password]);

  useEffect(() => {
    if (account) {
      console.log(account);
      setActiveStep(1);
    }
  }, [account]);

  const [username, setUsername] = useState("");
  const [errorUsername, setErrorUsername] = useState("");

  useEffect(() => {
    setErrorUsername("");
    if (username.length < 2) {
      setErrorUsername("Username must be at least 2 characters!");
    }
  }, [username]);

  const handleSave = () => {
    if (errorUsername === "" && account) {
      account.username = username;
      managerAccount.setAccount(account);
      navigate("/");
    }
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
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h4">Sign Up</Typography>
          <Stepper
            activeStep={activeStep}
            orientation="vertical"
            sx={{ maxWidth: "400px", width: "100%" }}
          >
            <Step>
              <StepLabel>Email</StepLabel>
              <StepContent>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.8rem",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                    }}
                  >
                    <TextField
                      fullWidth
                      error={errorEmail !== ""}
                      helperText={errorEmail}
                      label="email*"
                      variant="outlined"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                      fullWidth
                      error={errorPassword !== ""}
                      helperText={errorPassword}
                      label="password*"
                      variant="outlined"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "end" }}>
                    <Button onClick={handleProceed} variant="contained">
                      proceed
                    </Button>
                  </Box>
                  <Divider>or</Divider>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="inherit"
                    onClick={() => {
                      // signInGoogle();
                    }}
                  >
                    <img
                      src="/Google__G__Logo.svg.png"
                      alt="google"
                      width="20px"
                      style={{ paddingRight: "0.6rem" }}
                    />
                    account
                  </Button>
                </Box>
              </StepContent>
            </Step>
            <Step>
              <StepLabel>Profile</StepLabel>
              <StepContent>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  <TextField
                    fullWidth
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    label="username*"
                    variant="outlined"
                    type="text"
                  />
                  <Box sx={{ display: "flex", justifyContent: "end" }}>
                    <Button variant="contained" onClick={handleSave}>
                      save
                    </Button>
                  </Box>
                </Box>
              </StepContent>
            </Step>
          </Stepper>
        </Box>
      </Grid>
    </Grid>
  );
}
