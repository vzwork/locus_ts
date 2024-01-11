import { useEffect, useState } from "react";
import { Box, Button, Dialog, DialogTitle, TextField } from "@mui/material";
import ChannelsManager from "../../data/channels/channelsManager";
import { getAuth } from "firebase/auth";
import useChannelCurrent from "../../data/channels/useChannelCurrent";

export default function DeleteChannel({ setDeleteChannel, deleteChannel }) {
  const auth = getAuth();

  const channelsManager = ChannelsManager.getInstance();
  const channelCurrent = useChannelCurrent();

  const [nameChannel, setNameChannel] = useState("");
  const [errorNameChannel, setErrorNameChannel] = useState("");

  useEffect(() => {
    setErrorNameChannel("");
    const timer = setTimeout(() => {
      if (nameChannel.length > 0) {
        if (channelCurrent.idsChildren.length > 0) {
          setErrorNameChannel("channel must be empty");
        } else if (nameChannel.length < 3) {
          setErrorNameChannel("name must match");
        }
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [nameChannel]);

  const removeChannel = () => {
    if (channelCurrent.idsChildren.length > 0) {
      setErrorNameChannel("channel must be empty");
      return;
    } else if (nameChannel !== channelCurrent?.name) {
      setErrorNameChannel("name must match");
      return;
    }
    channelsManager.deleteChannelCurrent();
    setNameChannel("");
    setErrorNameChannel("");
    setDeleteChannel(false);
  };

  return (
    <Dialog
      onClose={() => {
        setNameChannel("");
        setDeleteChannel(false);
      }}
      open={deleteChannel}
    >
      <DialogTitle>
        <Box sx={{ display: "flex", gap: "0.5rem" }}>
          Delete channel
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
        <Button
          variant="contained"
          onClick={removeChannel}
          color={nameChannel !== channelCurrent?.name ? "inherit" : "primary"}
        >
          delete
        </Button>
      </Box>
    </Dialog>
  );
}
