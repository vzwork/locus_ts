import { Badge, IconButton, Menu, MenuItem } from "@mui/material";

import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import { useEffect, useState } from "react";
import useAccount from "../../data/_1_ManagerAccount/useAccount";
import ManagerAccount from "../../data/_1_ManagerAccount/ManagerAccount";
import { IAccount } from "../../data/account";
import { useNavigate } from "react-router-dom";

export default function ButtonChats() {
  const navigate = useNavigate();
  const account = useAccount();
  const managerAccount = ManagerAccount;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [accounts, setAccount] = useState<IAccount[]>([]);

  // useEffect(() => {
  //   const newAccoutns: IAccount[] = [];

  //   chats.chats.map(async (chat) => {
  //     const idOtherUser =
  //       account?.id === chat.idUserA ? chat.idUserB : chat.idUserA;
  //     const accountOtherUser = await managerAccount.getAccountOptimized(
  //       idOtherUser
  //     );
  //     if (accountOtherUser) {
  //       newAccoutns.push(accountOtherUser);
  //     }
  //   });

  //   setAccount(newAccoutns);
  // }, [chats]);

  return (
    <>
      <></>
      <></>
      <IconButton
        onClick={(e) => {
          setAnchorEl(e.currentTarget);
        }}
      >
        <Badge badgeContent={0} color="primary">
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
        {/* {chats.chats.map((chat, idx) => {
          const idOtherUser =
            account?.id === chat.idUserA ? chat.idUserB : chat.idUserA;
          const accountOtherUser = accounts.find(
            (account) => account.id === idOtherUser
          );

          return (
            <MenuItem
              key={idx}
              onClick={() => {
                navigate(`/chats/${chat.id}`);
              }}
            >
              {accountOtherUser?.username ? accountOtherUser.username : "..."}
            </MenuItem>
          );
        })} */}
      </Menu>
    </>
  );
}
