import { Box, Button, Paper } from "@mui/material";
import useCompetencyChannelsMostTimeSpent from "../../data/_6_ManagerCompetencyUser/useCompetencyChannelsMostTimeSpent";
import { useEffect, useState } from "react";
import { IChannel } from "../../data/channel";
import ManagerChannels from "../../data/_7_ManagerChannels/ManagerChannels";
import { useNavigate } from "react-router-dom";

export default function WindowChannelsMostTimeSpent() {
  const navigate = useNavigate();
  const managerChannels = ManagerChannels;
  const competencyChannelsMostTimeSpent = useCompetencyChannelsMostTimeSpent();
  const [channels, setChannels] = useState<(IChannel | undefined)[]>([]);

  useEffect(() => {
    // channelsManager didn't boot up yet
    setTimeout(() => {
      const buildingChannels: (IChannel | undefined)[] = [];
      competencyChannelsMostTimeSpent.forEach(async (competency) => {
        // console.log("competency", competency.idChannel);
        const channel = await managerChannels.getChannelOptimized(
          competency.idChannel
        );
        buildingChannels.push(channel);
      });
      setChannels(buildingChannels);
    }, 1000);
  }, [competencyChannelsMostTimeSpent]);

  useEffect(() => {
    // console.log("channels", channels);
  }, [channels]);

  return (
    <>
      <></>
      <></>
      <Box
        bgcolor="background.transperent"
        sx={{
          width: "100%",
          padding: "0.5rem",
          boxSizing: "border-box",
          backdropFilter: "blur(2px)",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
        borderRadius="0.5rem"
      >
        <Box>
          <Box>minutes spent</Box>
        </Box>
        <Box>
          <Box>
            {competencyChannelsMostTimeSpent.map((competency, idx) => (
              <Box
                key={idx}
                sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <Box>{competency.minutesSpent}</Box>
                <Button
                  variant={
                    // channel.id === channelCurrent?.id ? "contained" : "outlined"
                    "outlined"
                  }
                  color={
                    // channel.id === channelCurrent?.id ? "primary" : "info"
                    "info"
                  }
                  size="small"
                  sx={{
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    display: "flex",
                    justifyContent: "left",
                    borderRadius: "2rem",
                  }}
                  onClick={() => {
                    navigate(`/channels/${channels.at(idx)?.id}`);
                  }}
                >
                  {channels.at(idx)?.name}
                </Button>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </>
  );
}
