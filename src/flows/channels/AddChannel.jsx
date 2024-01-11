import { useEffect, useState } from "react";
import { Box, Button, Dialog, DialogTitle, TextField } from "@mui/material";
import ChannelsManager from "../../data/channels/channelsManager";
import { getAuth } from "firebase/auth";
import useChannelCurrent from "../../data/channels/useChannelCurrent";

export default function AddChannel({ setAddChannel, addChannel }) {
  const auth = getAuth();

  const channelsManager = ChannelsManager.getInstance();
  const channelCurrent = useChannelCurrent();

  const [nameChannel, setNameChannel] = useState("");
  const [errorNameChannel, setErrorNameChannel] = useState("");

  useEffect(() => {
    setErrorNameChannel("");
    const timer = setTimeout(() => {
      if (nameChannel.length > 0) {
        if (nameChannel.length < 3) {
          setErrorNameChannel("3+ characters");
        }
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [nameChannel]);

  const createChannel = () => {
    if (nameChannel.length === 0) {
      setErrorNameChannel("name is required");
      return;
    }
    channelsManager.createChannel(
      auth.currentUser.uid,
      auth.currentUser.displayName,
      nameChannel
    );
    setNameChannel("");
    setErrorNameChannel("");
    setAddChannel(false);
  };

  return (
    <Dialog
      onClose={() => {
        setNameChannel("");
        setAddChannel(false);
      }}
      open={addChannel}
    >
      <DialogTitle>
        <Box sx={{ display: "flex", gap: "0.5rem" }}>
          Create sub channel for
          <Box color="primary.main">{channelCurrent?.name}</Box>
        </Box>
      </DialogTitle>
      <Box
        p="1rem"
        sx={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
      >
        <TextField
          error={errorNameChannel.length > 0}
          label="name"
          p="1rem"
          value={nameChannel}
          onChange={(e) => {
            setNameChannel(e.target.value);
          }}
          sx={{ minWidth: "300px" }}
          helperText={errorNameChannel}
        />
        <Button variant="contained" onClick={createChannel}>
          create
        </Button>
      </Box>
    </Dialog>
  );
}
