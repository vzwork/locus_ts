import { Box, Fab, IconButton, Menu, MenuItem } from "@mui/material";
import useAccount from "../../data/_1_ManagerAccount/useAccount";
import PersonIcon from "@mui/icons-material/Person";
import ManagerAccount from "../../data/_1_ManagerAccount/ManagerAccount";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ButtonSignedInBig() {
  const navigate = useNavigate();
  const account = useAccount();

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
        <MenuItem
          onClick={() => {
            navigate("/account");
          }}
        >
          my page
        </MenuItem>
        <MenuItem onClick={handleSignOut}>sign out</MenuItem>
      </Menu>
    </>
  );
}

function ButtonSignedInSmall() {
  const navigate = useNavigate();
  const account = useAccount();

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
      <IconButton size="small" onClick={handleClick}>
        <ManageAccountsIcon />
      </IconButton>
      <Menu open={open} anchorEl={anchorEl} onClose={handleClose}>
        <MenuItem
          onClick={() => {
            navigate("/account");
          }}
        >
          my page
        </MenuItem>
        <MenuItem onClick={handleSignOut}>sign out</MenuItem>
      </Menu>
    </>
  );
}

export { ButtonSignedInBig, ButtonSignedInSmall };
