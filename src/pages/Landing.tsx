import {
  AppBar,
  Box,
  Button,
  ButtonGroup,
  Fab,
  IconButton,
  Menu,
  MenuItem,
  MenuList,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import useAccount from "../data/_1_ManagerAccount/useAccount";

import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import useThemeMode from "../data/_0_ManagerTheme/useThemeMode";
import ManagerTheme from "../data/_0_ManagerTheme/ManagerTheme";
import ManagerAccount from "../data/_1_ManagerAccount/ManagerAccount";
import PersonIcon from "@mui/icons-material/Person";
import { useState } from "react";
import { idRoot } from "../data/db";

export default function Landing() {
  const account = useAccount();
  const theme = useTheme();
  const navigate = useNavigate();
  const themeMode = useThemeMode();
  const managerTheme = ManagerTheme;

  return (
    <>
      <Box>
        <AppBar
          position="static"
          sx={{
            bgcolor: theme.palette.background.transperent,
            backgroundImage: "none",
          }}
          // sx={{ bgcolor: "rgba(0, 0, 0, 0.0)", backgroundImage: "none" }}
        >
          <Toolbar
            sx={{
              backdropFilter: "blur(2px)",
              background: "rgba(0, 0, 0, 0.0)",
            }}
          >
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" color="text.primary">
                Locus
              </Typography>
              <Box sx={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <IconButton
                  color="secondary"
                  onClick={() => {
                    managerTheme.toggleTheme();
                  }}
                >
                  {themeMode === "light" ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
                {account ? (
                  <AccountAuthenticated />
                ) : (
                  <ButtonGroup>
                    <Button
                      onClick={() => navigate("/signin")}
                      variant="contained"
                    >
                      sign in
                    </Button>
                    <Button
                      onClick={() => navigate("/signup")}
                      variant="outlined"
                    >
                      sign up
                    </Button>
                  </ButtonGroup>
                )}
              </Box>
            </Box>
          </Toolbar>
        </AppBar>
        <Typography variant="h5" color="text.primary">
          Landing
        </Typography>
        <Button
          onClick={() => {
            navigate(`/channels/${idRoot}`);
          }}
        >
          root channel
        </Button>
      </Box>
    </>
  );
}

function AccountAuthenticated() {
  const managerAccount = ManagerAccount;
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  const handleSignOut = () => {
    managerAccount.setAccount(null);
  };

  return (
    <>
      <Fab
        variant="extended"
        size="small"
        onClick={handleClick}
        color="secondary"
      >
        <PersonIcon />
        account
      </Fab>
      <Menu open={open} anchorEl={anchorEl} onClose={handleClose}>
        <MenuItem onClick={handleSignOut}>sign out</MenuItem>
      </Menu>
    </>
  );
}
