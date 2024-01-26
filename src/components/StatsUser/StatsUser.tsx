import { Box, Button, useTheme } from "@mui/material";
import useStatsUser from "../../data/_4_ManagerTraceUser/useStatsUser";

import StarOutlineIcon from "@mui/icons-material/StarOutline";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

function formatNumber(num: number) {
  if (num < 1000) {
    return num.toString();
  } else if (num < 1000000) {
    return (num / 1000).toFixed(1) + "k";
  } else {
    return (num / 1000000).toFixed(1) + "m";
  }
}

export default function StatsUser() {
  const theme = useTheme();
  const statsUser = useStatsUser();

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
          gap: "1rem",
        }}
        borderRadius="0.5rem"
      >
        <Box color="info.main">
          other people starring, booking, upvoting your content or comments
        </Box>
        <Box>your stats:</Box>
        <Box sx={{ display: "flex", justifyContent: "space-around" }}>
          <Button
            size="small"
            variant="outlined"
            color="info"
            startIcon={<StarOutlineIcon />}
            sx={{
              borderRadius: "2rem",
              backgroundColor: theme.palette.background.transperent,
            }}
          >
            {formatNumber(statsUser?.countStarsByOtherUsers || 0)}
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="info"
            startIcon={<MenuBookIcon />}
            sx={{
              borderRadius: "2rem",
              backgroundColor: theme.palette.background.transperent,
            }}
          >
            {formatNumber(statsUser?.countBooksByOtherUsers || 0)}
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="info"
            startIcon={<ChatBubbleOutlineIcon />}
            sx={{
              borderRadius: "2rem",
              backgroundColor: theme.palette.background.transperent,
            }}
          >
            {formatNumber(statsUser?.countUpvotesComments || 0)}
          </Button>
        </Box>
      </Box>
    </>
  );
}
