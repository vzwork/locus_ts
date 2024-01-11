import { Box } from "@mui/material";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import ManagerChannels from "../data/_7_ManagerChannels/ManagerChannels";
import useChannelCurrent from "../data/_7_ManagerChannels/useChannelCurrent";

export default function Channels() {
  const managerChannels = ManagerChannels;

  const params = useParams();
  const channelCurrent = useChannelCurrent();

  useEffect(() => {
    if (params.id) {
      managerChannels.setChannelCurrent(params.id);
    }
  });

  return (
    <>
      <></>
      <></>
      <Box>hello</Box>
      {channelCurrent?.name}
    </>
  );
}
