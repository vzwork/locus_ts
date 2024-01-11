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
import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  GoogleAuthProvider,
  deleteUser,
  getAuth,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { IAccount } from "../data/account";
import ManagerAccount from "../data/_1_ManagerAccount/ManagerAccount";
import { stateCollections } from "../data/db";

export default function SignIn() {
  const db = getFirestore();
  const auth = getAuth();
  const navigate = useNavigate();

  const managerAccount = ManagerAccount;

  const [email, setEmail] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorPassword, setErrorPassword] = useState("");

  useEffect(() => {
    setErrorEmail("");
    setErrorPassword("");
  }, [email, password]);

  const handleSignIn = async () => {
    console.log("handleSignIn");
    const res = await signInWithEmailAndPassword(auth, email, password).catch(
      (error) => {
        if (error.code === "auth/invalid-credential") {
          setErrorEmail("Wrong email or password!");
        } else if (error.code === "auth/missing-password") {
          setErrorPassword("Password is required!");
        } else {
          setErrorEmail("Something went wrong!");
        }
      }
    );

    if (!res) return;

    const docSnap = await getDoc(
      doc(db, stateCollections.accounts, res.user.uid)
    ).catch((error) => {
      console.log(error);
      setErrorEmail("Account doesn't exist!");
      deleteUser(auth.currentUser!);
    });

    if (!docSnap) return;

    const account = docSnap.data() as IAccount;

    managerAccount.setAccount(account);
    navigate(-1);
  };

  const handleSignInGoogle = async () => {
    const res = await signInWithPopup(auth, new GoogleAuthProvider()).catch(
      (error) => {
        console.log(error.message);
      }
    );

    if (!res) return;

    const docSnap = await getDoc(
      doc(db, stateCollections.accounts, res.user.uid)
    ).catch((error) => {
      console.log(error);
      setErrorEmail("Account doesn't exist!");
      deleteUser(auth.currentUser!);
    });

    if (!docSnap?.data()) {
      const account: IAccount = {
        email: res.user.email as string,
        id: res.user.uid as string,
        username: "user",
        firstName: "Mr.",
        lastName: "Anonymous",
        avatarURL: "",
        role: "user",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      managerAccount.setAccount(account);
      navigate("/signup");
    } else {
      const account = docSnap.data() as IAccount;
      managerAccount.setAccount(account);
      navigate(-1);
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
            <Typography variant="h4">Sign In</Typography>
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
            <TextField
              fullWidth
              label="password*"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrorPassword("");
              }}
              error={errorPassword !== ""}
              helperText={errorPassword}
            />
            <Button onClick={handleSignIn} variant="contained" fullWidth>
              sign in
            </Button>
            <Box
              sx={{
                width: "100%",
                display: "flex",
              }}
            >
              <Box
                sx={{ width: "50%", display: "flex", justifyContent: "center" }}
              >
                <Link
                  component="button"
                  onClick={() => navigate("/resetpassword")}
                >
                  forgot password
                </Link>
              </Box>
              <Box
                sx={{ width: "50%", display: "flex", justifyContent: "center" }}
              >
                <Link component="button" onClick={() => navigate("/signup")}>
                  sign up
                </Link>
              </Box>
            </Box>
            <Divider sx={{ width: "100%", paddingY: "1rem" }}>or</Divider>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="inherit"
              onClick={handleSignInGoogle}
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
        </Box>
      </Grid>
    </Grid>
  );
}
