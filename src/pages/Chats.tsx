import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  TextField,
  useTheme,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import useWindowSize from "../hooks/useWindowSize";
import useAccount from "../data/_1_ManagerAccount/useAccount";
import ManagerAccount from "../data/_1_ManagerAccount/ManagerAccount";
import { useEffect, useRef, useState } from "react";
import ManagerChats from "../data/_5_ManagerChats/ManagerChats";
import useOrganizationChats from "../data/_5_ManagerChats/useOrganizationChats";
import useActiveChat from "../data/_5_ManagerChats/useActiveChat";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { IAccount } from "../data/account";

export default function Chats() {
  const managerChats = ManagerChats;
  const [width, height] = useWindowSize();
  const params = useParams();

  useEffect(() => {
    if (params.idChat) {
      managerChats.setChatCurrent(params.idChat);
    } else {
      managerChats.setChatCurrent(null);
    }
  }, [params.idChat]);

  return (
    <>
      <></>
      <></>
      <Box
        sx={{
          zIndex: "1",
          position: "fixed",
          width: "100vw",
          height: "100vh",
          overflow: "auto",
        }}
      >
        {width > 600 ? <ChatsDesktop /> : <ChatsMobile />}
      </Box>
    </>
  );
}

function ChatsDesktop() {
  return (
    <>
      <></>
      <></>
      <Box>
        <Container>
          <Grid container spacing="0.5rem">
            <Grid item xs={4} lg={3} xl={2}>
              <NavigationChats />
            </Grid>
            <Grid item xs={8} lg={9} xl={10}>
              <Chat />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}

function ChatsMobile() {
  return (
    <>
      <></>
      <></>
    </>
  );
}

function NavigationChats() {
  const params = useParams();
  const navigate = useNavigate();
  const organizationChats = useOrganizationChats();
  const account = useAccount();
  const managerAccount = ManagerAccount;
  const managerChats = ManagerChats;
  const [accounts, setAccounts] = useState<IAccount[]>([]);

  useEffect(() => {
    if (!account) return;
    if (!organizationChats) return;

    organizationChats.idsChatsNewMessages.map(async (idChat) => {
      const idOtherUser = idChat.replace(account.id, "");
      const accountOtherUser = await managerAccount.getAccountOptimized(
        idOtherUser
      );
      if (accounts.find((account) => account.id === idOtherUser)) return;
      if (accountOtherUser) {
        setAccounts([...accounts, accountOtherUser]);
      }
    });
    organizationChats.idsChats.map(async (idChat) => {
      const idOtherUser = idChat.replace(account.id, "");
      const accountOtherUser = await managerAccount.getAccountOptimized(
        idOtherUser
      );
      if (accounts.find((account) => account.id === idOtherUser)) return;
      if (accountOtherUser) {
        setAccounts([...accounts, accountOtherUser]);
      }
    });
    organizationChats.idsRequestsChats.map(async (idChat) => {
      const idOtherUser = idChat.replace(account.id, "");
      const accountOtherUser = await managerAccount.getAccountOptimized(
        idOtherUser
      );
      if (accounts.find((account) => account.id === idOtherUser)) return;
      if (accountOtherUser) {
        setAccounts([...accounts, accountOtherUser]);
      }
    });
  }, [organizationChats, account]);

  useEffect(() => {
    // console.log(accounts);
  }, [accounts]);

  return (
    <>
      <></>
      <></>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => {
            navigate("/");
          }}
          sx={{
            backdropFilter: "blur(2px)",
          }}
        >
          home
        </Button>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {organizationChats?.idsChatsNewMessages?.length || 0 > 0
            ? "new messages:"
            : null}
          {organizationChats?.idsChatsNewMessages?.map((idChat, idx) => {
            return (
              <Button
                color={params.idChat === idChat ? "inherit" : "info"}
                key={idx}
                fullWidth
                variant="outlined"
                onClick={() => {
                  navigate(`/chats/${idChat}`);
                }}
                sx={{
                  backdropFilter: "blur(2px)",
                }}
              >
                {accounts.find(
                  (accountOther) =>
                    accountOther.id === idChat.replace(account?.id || "", "")
                )?.username || "..."}
              </Button>
            );
          })}
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          chats:
          {organizationChats?.idsChats?.map((idChat, idx) => {
            return (
              <Button
                color={params.idChat === idChat ? "inherit" : "info"}
                key={idx}
                fullWidth
                variant="outlined"
                onClick={() => {
                  navigate(`/chats/${idChat}`);
                }}
                sx={{
                  backdropFilter: "blur(2px)",
                }}
              >
                {accounts.find(
                  (accountOther) =>
                    accountOther.id === idChat.replace(account?.id || "", "")
                )?.username || "..."}
              </Button>
            );
          })}
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          requests:
          {organizationChats?.idsRequestsChats?.map((idChat, idx) => {
            return (
              <Box sx={{ display: "flex" }} key={idx}>
                <Button
                  color={params.idChat === idChat ? "inherit" : "info"}
                  key={idx}
                  fullWidth
                  variant="outlined"
                  onClick={() => {
                    navigate(`/chats/${idChat}`);
                  }}
                  sx={{
                    backdropFilter: "blur(2px)",
                  }}
                >
                  {accounts.find(
                    (accountOther) =>
                      accountOther.id === idChat.replace(account?.id || "", "")
                  )?.username || "..."}
                </Button>
                <IconButton
                  onClick={() => {
                    managerChats.acceptChat(idChat);
                  }}
                >
                  <AddCircleOutlineIcon />
                </IconButton>
              </Box>
            );
          })}
        </Box>
      </Box>
    </>
  );
}

function Chat() {
  const account = useAccount();
  const theme = useTheme();
  const params = useParams();
  const managerChats = ManagerChats;
  const messages = useActiveChat();
  const messagesRef = useRef<HTMLDivElement>(null);

  const [text, setText] = useState<string>("");
  const [shiftDown, setShiftDown] = useState<boolean>(false);

  let datePreviousPreviousRendered = new Date();
  let datePreviousRendered = new Date();

  // Q: how to make it so that at the beginning it is scrolled al the way down?
  // A: use a ref and scroll to the bottom of the ref

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      <></>
      <></>
      <Box
        sx={{
          maxHeight: "100vh",
          height: "100vh",
          display: "flex",
          flexDirection: "column-reverse",
          gap: "1rem",
        }}
      >
        <Box pr="2rem">
          <TextField
            placeholder="return - send"
            label="message..."
            sx={{ backdropFilter: "blur(2px)" }}
            variant="outlined"
            multiline
            rows={4}
            fullWidth
            value={text}
            onChange={(e) => {
              setText(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Shift") {
                setShiftDown(true);
              }
              if (
                e.key === "Enter" &&
                !shiftDown &&
                text !== "" &&
                params.idChat
              ) {
                e.preventDefault();
                setText("");
                managerChats.sendMessage(params.idChat, text);
              }
            }}
            onKeyUp={(e) => {
              if (e.key === "Shift") {
                setShiftDown(false);
              }
            }}
          />
        </Box>
        <Box
          ref={messagesRef}
          sx={{
            flex: "1",
            overflowY: "scroll",
            height: "100%",
            paddingRight: "2rem",
            display: "flex",
            flexDirection: "column-reverse",
          }}
        >
          {messages?.length === 0 ? (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              no messages
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column-reverse",
              }}
            >
              {messages
                ?.sort((a, b) => b.timestampCreated - a.timestampCreated)
                .map((message) => {
                  let renderDate = false;
                  const dateMessage = new Date(message.timestampCreated);
                  if (datePreviousRendered.getDay() !== dateMessage.getDay()) {
                    renderDate = true;
                  }
                  datePreviousPreviousRendered = datePreviousRendered;
                  datePreviousRendered = dateMessage;

                  return (
                    <Box key={message.timestampCreated}>
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        {renderDate ? (
                          <Box>
                            {datePreviousPreviousRendered.getMonth() + 1}/
                            {datePreviousPreviousRendered.getDate()}/
                            {datePreviousPreviousRendered.getFullYear()}
                          </Box>
                        ) : null}
                      </Box>
                      <Box
                        p="0.2rem"
                        my="0.2rem"
                        sx={{
                          background:
                            account?.id !== message.idUser
                              ? theme.palette.background.transperentHover
                              : theme.palette.background.transperent,
                          backdropFilter: "blur(2px)",
                          borderRadius: "0.2rem",
                          textAlign:
                            account?.id === message.idUser ? "right" : "left",
                        }}
                      >
                        <></>
                        {message.message}
                      </Box>
                    </Box>
                  );
                })}
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                {datePreviousRendered ? (
                  <Box>
                    {datePreviousRendered.getMonth() + 1}/
                    {datePreviousRendered.getDate()}/
                    {datePreviousRendered.getFullYear()}
                  </Box>
                ) : null}
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
}
