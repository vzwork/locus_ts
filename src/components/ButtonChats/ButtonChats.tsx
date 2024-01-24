import { Badge, IconButton, Menu, MenuItem } from "@mui/material";

import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import { useEffect, useState } from "react";
import useAccount from "../../data/_1_ManagerAccount/useAccount";
import ManagerAccount from "../../data/_1_ManagerAccount/ManagerAccount";
import { IAccount } from "../../data/account";
import { useNavigate } from "react-router-dom";
import useOrganizationChats from "../../data/_5_ManagerChats/useOrganizationChats";

export default function ButtonChats() {
  const navigate = useNavigate();
  const account = useAccount();
  const managerAccount = ManagerAccount;
  const organizationChats = useOrganizationChats();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [accounts, setAccount] = useState<IAccount[]>([]);

  useEffect(() => {
    if (account) {
      organizationChats?.idsChatsNewMessages.map(async (idChat) => {
        const idOtherUser = idChat.replace(account.id, "");
        const accountOtherUser = await managerAccount.getAccountOptimized(
          idOtherUser
        );
        if (accounts.find((account) => account.id === idOtherUser)) return;
        if (accountOtherUser) {
          setAccount((accounts) => [...accounts, accountOtherUser]);
        }
      });
    }
  }, [organizationChats, account]);

  return (
    <>
      <></>
      <></>
      <IconButton
        onClick={(e) => {
          setAnchorEl(e.currentTarget);
        }}
      >
        <Badge
          badgeContent={organizationChats?.idsChatsNewMessages.length}
          color="primary"
        >
          <EmailOutlinedIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => {
          setAnchorEl(null);
        }}
      >
        <MenuItem onClick={() => navigate("/chats")}>all chats</MenuItem>
        {organizationChats?.idsChatsNewMessages.map((idChat, idx) => {
          const idOtherUser = idChat.replace(account?.id || "", "");
          const accountOtherUser = accounts.find(
            (account) => account.id === idOtherUser
          );

          return (
            <MenuItem
              key={idx}
              onClick={() => {
                navigate(`/chats/${idChat}`);
              }}
            >
              {accountOtherUser?.username ? accountOtherUser.username : "..."}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
}
