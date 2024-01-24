import {
  Box,
  Button,
  Grid,
  Menu,
  MenuItem,
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
import { render } from "@testing-library/react";

export default function Chats() {
  const managerChats = ManagerChats;
  const [width, height] = useWindowSize();
  const params = useParams();

  useEffect(() => {
    if (params.idChat) {
      managerChats.setChatCurrent(params.idChat);
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
        <Grid container spacing="0.5rem">
          <Grid item xs={4} lg={3} xl={2}>
            <NavigationChats />
          </Grid>
          <Grid item xs={8} lg={9} xl={10}>
            <Chat />
          </Grid>
        </Grid>
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

interface IChatOther {
  idChat: string;
  username: string;
}

function NavigationChats() {
  const params = useParams();
  const navigate = useNavigate();
  const organizationChats = useOrganizationChats();
  const account = useAccount();
  const managerAccount = ManagerAccount;

  const [chatsNewMessagesOther, setChatsNewMessagesOther] = useState<
    IChatOther[]
  >([]);
  const [chatsOther, setChatsOther] = useState<IChatOther[]>([]);
  const [chatsRequestsOther, setChatsRequestsOther] = useState<IChatOther[]>(
    []
  );

  useEffect(() => {
    if (!account) return;

    organizationChats?.idsChatsNewMessages?.map(async (idChat) => {
      const idOther = idChat.replace(account.id, "");
      const accountOther = await managerAccount.getAccountOptimized(idOther);
      if (!accountOther) console.log("couldn't find account other");
      if (!accountOther) return;
      if (chatsNewMessagesOther.find((chat) => chat.idChat === idChat)) return;
      setChatsNewMessagesOther((prev) => [
        ...prev,
        { idChat, username: accountOther.username },
      ]);
    });

    organizationChats?.idsChats?.map(async (idChat) => {
      const idOther = idChat.replace(account.id, "");
      const accountOther = await managerAccount.getAccountOptimized(idOther);
      if (!accountOther) console.log("couldn't find account other");
      if (!accountOther) return;
      if (chatsOther.find((chat) => chat.idChat === idChat)) return;
      setChatsOther((prev) => [
        ...prev,
        { idChat, username: accountOther.username },
      ]);
    });

    organizationChats?.idsRequestsChats?.map(async (idChat) => {
      const idOther = idChat.replace(account.id, "");
      const accountOther = await managerAccount.getAccountOptimized(idOther);
      if (!accountOther) console.log("couldn't find account other");
      if (!accountOther) return;
      if (chatsRequestsOther.find((chat) => chat.idChat === idChat)) return;
      setChatsRequestsOther((prev) => [
        ...prev,
        { idChat, username: accountOther.username },
      ]);
    });
  }, [organizationChats, account]);

  useEffect(() => {
    // console.log(chatsNewMessagesOther);
    // console.log(chatsOther);
    // console.log(chatsRequestsOther);
  }, [chatsNewMessagesOther, chatsOther, chatsRequestsOther]);

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
          {chatsNewMessagesOther.map((chat, idx) => {
            return (
              <Button
                color={params.idChat === chat.idChat ? "inherit" : "info"}
                key={idx}
                fullWidth
                variant="outlined"
                onClick={() => {
                  navigate(`/chats/${chat.idChat}`);
                }}
                sx={{
                  backdropFilter: "blur(2px)",
                }}
              >
                {chat.username}
              </Button>
            );
          })}
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {chatsOther.map((chat, idx) => {
            return (
              <Button
                color={params.idChat === chat.idChat ? "inherit" : "info"}
                key={idx}
                fullWidth
                variant="outlined"
                onClick={() => {
                  navigate(`/chats/${chat.idChat}`);
                }}
                sx={{
                  backdropFilter: "blur(2px)",
                }}
              >
                {chat.username}
              </Button>
            );
          })}
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {chatsRequestsOther.map((chat, idx) => {
            return (
              <Button
                color={params.idChat === chat.idChat ? "inherit" : "info"}
                key={idx}
                fullWidth
                variant="outlined"
                onClick={() => {
                  navigate(`/chats/${chat.idChat}`);
                }}
                sx={{
                  backdropFilter: "blur(2px)",
                }}
              >
                {chat.username}
              </Button>
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

  let dateLastRendered = 0;

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
        <Box>
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
            overflowY: "auto",
            height: "50vh",
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
                  const lastRenderedDate = new Date(dateLastRendered);
                  const dateMessage = new Date(message.timestampCreated);
                  if (lastRenderedDate.getDay() !== dateMessage.getDay()) {
                    renderDate = true;
                    dateLastRendered = message.timestampCreated;
                  }

                  return (
                    <Box key={message.timestampCreated}>
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        {renderDate ? (
                          <Box>
                            {dateMessage.getMonth() + 1}/{dateMessage.getDate()}
                            /{dateMessage.getFullYear()}
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
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
}
