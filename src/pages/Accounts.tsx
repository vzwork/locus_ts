import {
  Box,
  Button,
  Container,
  IconButton,
  MenuItem,
  Select,
  Tooltip,
  useTheme,
} from "@mui/material";
import { IAccount } from "../data/account";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAccount from "../data/_1_ManagerAccount/useAccount";
import ManagerAccount from "../data/_1_ManagerAccount/ManagerAccount";
import useStatsUser from "../data/_4_ManagerTraceUser/useStatsUser";
import ManagerContent from "../data/_9_ManagerContent/ManagerContent";
import { QueryOrder, QueryTimeframe } from "../data/query";

import HomeIcon from "@mui/icons-material/Home";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import PhotoCameraFrontIcon from "@mui/icons-material/PhotoCameraFront";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import useStateStars from "../data/_4_ManagerTraceUser/useStateStars";
import usePosts from "../data/_9_ManagerContent/usePosts";
import Post from "../components/Post/Post";

function formatNumber(num: number | undefined) {
  if (!num) return "0";
  if (num < 1000) {
    return num.toString();
  } else if (num < 1000000) {
    return (num / 1000).toFixed(1) + "k";
  } else {
    return (num / 1000000).toFixed(1) + "m";
  }
}

export default function Accounts() {
  const params = useParams();
  const navigate = useNavigate();
  const account = useAccount();
  const managerAccount = ManagerAccount;
  const statsUser = useStatsUser();
  const theme = useTheme();
  const [thisAccount, setThisAccount] = useState<IAccount | undefined>(
    undefined
  );

  useEffect(() => {
    if (!params.idAccount) {
      setThisAccount(account);
    } else {
      managerAccount.getAccountOptimized(params.idAccount).then((account) => {
        if (account) {
          setThisAccount(account);
        }
      });
    }
  }, [params.idAccount, account]);

  useEffect(() => {
    // console.log(statsUser);
  });

  return (
    <>
      <></>
      <></>
      <Container maxWidth="md">
        <Box pt="1rem" />
        <Box sx={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <Box sx={{ display: "flex", gap: "0.5rem" }}>
            <Box
              borderRadius="0.5rem"
              padding="0.5rem"
              bgcolor="background.transperent"
              sx={{ backdropFilter: "blur(2px)", height: "min-content" }}
            >
              <IconButton
                onClick={() => {
                  navigate("/");
                }}
              >
                <HomeIcon />
              </IconButton>
            </Box>
            {thisAccount ? (
              <>
                <></>
                <></>
                <Box
                  borderRadius="0.5rem"
                  padding="0.5rem"
                  bgcolor="background.transperent"
                  sx={{
                    backdropFilter: "blur(2px)",
                    flex: 1,
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    gap: "1rem",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Box sx={{ display: "flex", gap: "1rem" }}>
                      <Box>urlAvatar</Box>
                      <Box>{thisAccount.username}</Box>
                    </Box>
                    <Box sx={{ display: "flex", gap: "1rem" }}>
                      <Box>{thisAccount.firstName}</Box>
                      <Box>{thisAccount.lastName}</Box>
                    </Box>
                  </Box>
                  <Box>
                    <Box sx={{ display: "flex", gap: "0.5rem" }}>
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
                        {formatNumber(statsUser?.countStarsByOtherUsers)}
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
                </Box>
              </>
            ) : null}
          </Box>
          <ContentFilterOrder thisAccount={thisAccount} />
          <Content />
        </Box>
      </Container>
    </>
  );
}

function ContentFilterOrder({
  thisAccount,
}: {
  thisAccount: IAccount | undefined;
}) {
  const managerContent = ManagerContent;
  const account = useAccount();

  const [filterQuotes, setFilterQuotes] = useState(
    localStorage.getItem("filterQuotes") === "true" ? true : false
  );
  const [filterArticles, setFilterArticles] = useState(
    localStorage.getItem("filterArticles") === "true" ? true : false
  );
  const [filterPhotos, setFilterImages] = useState(
    localStorage.getItem("filterPhotos") === "true" ? true : false
  );
  const [filterVideos, setFilterVideos] = useState(
    localStorage.getItem("filterVideos") === "true" ? true : false
  );
  const [filterStreams, setFilterStreams] = useState(
    localStorage.getItem("filterStreams") === "true" ? true : false
  );

  const [option, setOption] = useState<string>("user posts");

  useEffect(() => {
    const typesConetentActive = [];
    if (!filterQuotes) typesConetentActive.push("quote");
    if (!filterArticles) typesConetentActive.push("article");
    if (!filterPhotos) typesConetentActive.push("photo");
    if (!filterVideos) typesConetentActive.push("video");
    managerContent.setTypesContentActive(typesConetentActive);
  }, [filterQuotes, filterArticles, filterPhotos, filterVideos]);

  useEffect(() => {
    if (option === "user posts") {
      if (thisAccount) managerContent.setQueryUsersPosts(thisAccount.id);
    } else if (option === "starred") {
      if (thisAccount) managerContent.setQueryUsersStars(thisAccount.id);
    } else if (option === "booked") {
      if (thisAccount) managerContent.setQueryUsersBooks(thisAccount.id);
    }
  }, [option, thisAccount]);

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
          display: "flex",
          justifyContent: "space-between",
          backdropFilter: "blur(2px)",
        }}
        borderRadius="0.5rem"
      >
        <Box>
          <Tooltip title="quotes" arrow>
            <IconButton
              color={filterQuotes ? "info" : "primary"}
              onClick={() => {
                setFilterQuotes(!filterQuotes);
                localStorage.setItem(
                  "filterQuotes",
                  (!filterQuotes).toString()
                );
              }}
            >
              <FormatQuoteIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="articles" arrow>
            <IconButton
              color={filterArticles ? "info" : "primary"}
              onClick={() => {
                setFilterArticles(!filterArticles);
                localStorage.setItem(
                  "filterArticles",
                  (!filterArticles).toString()
                );
              }}
            >
              <NewspaperIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="photos" arrow>
            <IconButton
              color={filterPhotos ? "info" : "primary"}
              onClick={() => {
                setFilterImages(!filterPhotos);
                localStorage.setItem(
                  "filterPhotos",
                  (!filterPhotos).toString()
                );
              }}
            >
              <PhotoCameraIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="videos" arrow>
            <IconButton
              color={filterVideos ? "info" : "primary"}
              onClick={() => {
                setFilterVideos(!filterVideos);
                localStorage.setItem(
                  "filterVideos",
                  (!filterVideos).toString()
                );
              }}
            >
              <OndemandVideoIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="developing..." arrow>
            {/* <IconButton color={filterStreams ? "info" : "primary"}> */}
            <IconButton color={"info"}>
              <PhotoCameraFrontIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Box sx={{ display: "flex", gap: "0.5rem" }}>
          <Select
            variant="standard"
            size="small"
            value={option}
            onChange={(e) => setOption(e.target.value)}
          >
            <MenuItem value={"user posts"}>user posts</MenuItem>
            <MenuItem value={"starred"}>starred</MenuItem>
            <MenuItem value={"booked"}>booked</MenuItem>
          </Select>
        </Box>
      </Box>
    </>
  );
}

function Content() {
  const posts = usePosts();

  return (
    <>
      <></>
      <></>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        {posts.map((post, idx) => (
          <Box key={idx} sx={{ width: "100%" }}>
            <Post post={post} />
          </Box>
        ))}
      </Box>
    </>
  );
}
