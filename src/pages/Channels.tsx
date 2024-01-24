import {
  Box,
  Button,
  Container,
  Dialog,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import ManagerChannels from "../data/_7_ManagerChannels/ManagerChannels";
import useChannelCurrent from "../data/_7_ManagerChannels/useChannelCurrent";
import useChannelParent from "../data/_7_ManagerChannels/useChannelParent";
import useChannelCurrentChildren from "../data/_7_ManagerChannels/useChannelCurrentChildren";
import useChannelParentChildren from "../data/_7_ManagerChannels/useChannelParentChildren";
import useWindowSize from "../hooks/useWindowSize";

import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import PhotoCameraFrontIcon from "@mui/icons-material/PhotoCameraFront";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

import { IChannel } from "../data/channel";
import ManagerContent from "../data/_9_ManagerContent/ManagerContent";
import { QueryOrder, QueryTimeframe } from "../data/query";
import { idRoot } from "../data/db";
import useAccount from "../data/_1_ManagerAccount/useAccount";
import usePosts from "../data/_9_ManagerContent/usePosts";
import Post from "../components/Post/Post";
import ButtonNotifications from "../components/ButtonNotifications/ButtonNotifications";
import WindowChannelsMostTimeSpent from "../components/WindowChannelsMostTimeSpent/WindowChannelsMostTimeSpent";
import { ButtonSignedInSmall } from "../components/ButtonSignedIn/ButtonSignedIn";
import ButtonChats from "../components/ButtonChats/ButtonChats";

function formatNumber(num: number) {
  if (num < 1000) {
    return num.toString();
  } else if (num < 1000000) {
    return (num / 1000).toFixed(1) + "k";
  } else {
    return (num / 1000000).toFixed(1) + "m";
  }
}

export default function Channels() {
  const managerChannels = ManagerChannels;
  const params = useParams();
  const [width, height] = useWindowSize();

  useEffect(() => {
    if (params.idChannel) {
      managerChannels.setChannelCurrent(params.idChannel);
    }
    // console.log("params.idChannel", params.idChannel);
    // console.log("params.idPost", params.idPost);
  });

  return (
    <>
      <Box
        sx={{
          zIndex: "1",
          position: "fixed",
          width: "100vw",
          height: "100vh",
          overflow: "auto",
        }}
      >
        {width > 600 ? (
          <>{width > 1100 ? <ChannelsDesktop /> : <ChannelsCompact />}</>
        ) : (
          <ChannelsMobile />
        )}
      </Box>
      <Outlet />
    </>
  );
}

function ChannelsMobile() {
  return (
    <>
      <></>
      <></>
      <Box>
        <Grid container>
          <Grid item>navigation</Grid>
          <Grid item>content</Grid>
        </Grid>
      </Box>
    </>
  );
}

function ChannelsCompact() {
  const navigate = useNavigate();

  return (
    <>
      <></>
      <></>
      <Box>
        <Grid container>
          <Grid item sm={4} md={3}>
            <Box
              p={1}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                position: "sticky",
                top: "0",
              }}
            >
              <ChannelsNavigation />
              <Search />
              <Tree />
            </Box>
          </Grid>
          <Grid item sm={8} md={9}>
            <Box
              p={1}
              sx={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
            >
              <ContentFilterOrder />
              <DialogAddContent />
              <Content />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

function ChannelsDesktop() {
  return (
    <>
      <></>
      <></>
      <Box>
        <Container maxWidth="xl">
          <Grid container>
            <Grid item md={3} lg={2.5} xl={2}>
              <Box
                p={1}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                  position: "sticky",
                  top: "0",
                }}
              >
                <ChannelsNavigation />
                <Search />
                <Tree />
              </Box>
            </Grid>
            <Grid item md={6} lg={7} xl={8}>
              <Box
                p={1}
                sx={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
              >
                <ContentFilterOrder />
                <DialogAddContent />
                <Content />
              </Box>
            </Grid>
            <Grid item md={3} lg={2.5} xl={2}>
              <Box p={1} sx={{ position: "sticky", top: "0" }}>
                <WindowChannelsMostTimeSpent />
              </Box>
            </Grid>
          </Grid>
        </Container>
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

function randomCommentsLabel(): string {
  const labels = [
    "Dr. Harris, do you concur?",
    "Ah... here we go again...",
    "You can't handle the truth!",
    "I've got a bad feeling about this.",
    "Why so serious?",
    "You had me at ~hello~.",
    "I solemnly swear that I am up to no good.",
    "Sometimes you gotta run before you can walk.",
    "It's not what happens to you, but how you react to it that matters.",
    "Where's the money, Lebowski?",
    "English, ..., do you speak it?",
    "I am the one who knocks!",
    "I'm gonna make him an offer he can't refuse.",
    "I am the Dude, man",
    "They call it a Royale with cheese.",
    "What ain't no country I ever heard of!",
    "Say what again. Say what again, I dare you, I double dare you!",
    "Don't go gentle into that good night.",
    "The things you own end up owning you.",
    "I am not arguing, I'm just explaining why I am right.",
    "I am not a monster. I'm just ahead of the curve.",
    "There is no spoon.",
  ];
  return labels[Math.floor(Math.random() * labels.length)];
}

function DialogAddContent() {
  const [dialogAddContent, setDialogAddContent] = useState(false);
  const [dialogAddQuote, setDialogAddQuote] = useState(false);
  const [dialogAddArticle, setDialogAddArticle] = useState(false);
  const [dialogAddPhoto, setDialogAddPhoto] = useState(false);
  const [dialogAddVideo, setDialogAddVideo] = useState(false);

  return (
    <>
      <DialogAddQuote
        dialogAddQuote={dialogAddQuote}
        setDialogAddQuote={setDialogAddQuote}
      />
      <DialogAddArticle
        dialogAddArticle={dialogAddArticle}
        setDialogAddArticle={setDialogAddArticle}
      />
      <DialogAddPhoto
        dialogAddPhoto={dialogAddPhoto}
        setDialogAddPhoto={setDialogAddPhoto}
      />
      <DialogAddVideo
        dialogAddVideo={dialogAddVideo}
        setDialogAddVideo={setDialogAddVideo}
      />
      <></>
      <></>
      <Button
        fullWidth
        variant="outlined"
        color="primary"
        onClick={() => setDialogAddContent(true)}
        sx={{
          marginTop: "0.4rem",
          marginBottom: "0.3rem",
          backdropFilter: "blur(2px)",
        }}
      >
        share
      </Button>
      <Dialog
        open={dialogAddContent}
        onClose={() => setDialogAddContent(false)}
      >
        <Box
          sx={{
            width: "400px",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            alignItems: "center",
            padding: "0.5rem",
            boxSizing: "border-box",
          }}
        >
          <DialogTitle>Select Content Type</DialogTitle>
          <Divider sx={{ width: "100%" }} />
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            <Button
              startIcon={<FormatQuoteIcon />}
              variant="contained"
              onClick={() => {
                setDialogAddContent(false);
                setDialogAddQuote(true);
              }}
            >
              quote
            </Button>
            <Button
              startIcon={<NewspaperIcon />}
              variant="contained"
              onClick={() => {
                setDialogAddContent(false);
                setDialogAddArticle(true);
              }}
            >
              article
            </Button>
            <Button
              startIcon={<PhotoCameraIcon />}
              variant="contained"
              onClick={() => {
                setDialogAddContent(false);
                setDialogAddPhoto(true);
              }}
            >
              photo
            </Button>
            <Button
              startIcon={<OndemandVideoIcon />}
              variant="contained"
              onClick={() => {
                setDialogAddContent(false);
                setDialogAddVideo(true);
              }}
            >
              video
            </Button>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}

function DialogAddQuote({
  dialogAddQuote,
  setDialogAddQuote,
}: {
  dialogAddQuote: boolean;
  setDialogAddQuote: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const managerContent = ManagerContent;
  const account = useAccount();

  const [text, setText] = useState("");
  const [textError, setTextError] = useState("");

  useEffect(() => {
    setTextError("");
  }, [text]);

  const handleAddQuote = () => {
    if (text === "") {
      setTextError("quote is empty");
      return;
    }

    if (!account) return;

    managerContent.addQuote(text, account.id, account.username);

    setText("");
    setDialogAddQuote(false);
  };

  return (
    <>
      <></>
      <></>
      <Dialog
        open={dialogAddQuote}
        onClose={() => {
          setDialogAddQuote(false);
          setText("");
        }}
      >
        <Box
          sx={{
            width: "400px",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            alignItems: "center",
            padding: "0.5rem",
            boxSizing: "border-box",
          }}
        >
          <DialogTitle>Add Quote</DialogTitle>
          <Divider sx={{ width: "100%" }} />
          <TextField
            fullWidth
            multiline
            label={`chars: ${text.length}/200`}
            error={textError !== ""}
            helperText={textError}
            variant="outlined"
            placeholder={`quote`}
            value={text}
            onChange={(e) => {
              setText(e.target.value.slice(0, 200));
            }}
          />
          <Divider sx={{ width: "100%" }} />
          <Box sx={{ width: "100%", display: "flex", justifyContent: "end" }}>
            <Button variant="contained" onClick={handleAddQuote}>
              post
            </Button>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}

function DialogAddArticle({
  dialogAddArticle,
  setDialogAddArticle,
}: {
  dialogAddArticle: boolean;
  setDialogAddArticle: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const managerContent = ManagerContent;
  const account = useAccount();
  const [text, setText] = useState("");
  const [textError, setTextError] = useState("");

  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    setTextError("");
  }, [text]);

  const handleAddArticle = () => {
    if (text === "") {
      setTextError("article is empty");
      return;
    }

    if (!file) return;
    if (!account) return;

    setText("");
    setDialogAddArticle(false);
    managerContent.addArticle(file, text, account.id, account.username);
  };

  return (
    <>
      <></>
      <></>
      <Dialog
        open={dialogAddArticle}
        onClose={() => {
          setDialogAddArticle(false);
          setFile(null);
          setText("");
        }}
      >
        <Box
          sx={{
            width: "400px",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            alignItems: "center",
            padding: "0.5rem",
            boxSizing: "border-box",
          }}
        >
          <DialogTitle>Add Article</DialogTitle>
          <Divider sx={{ width: "100%" }} />

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              width: "100%",
            }}
          >
            <Box sx={{ display: "flex" }}>
              <NewspaperIcon color="primary" />
              <Box sx={{ flex: "1" }}>{file?.name}</Box>
              <Button
                size="small"
                variant="contained"
                component="label"
                color={file ? "inherit" : "primary"}
              >
                upload
                <input
                  accept="application/pdf"
                  type="file"
                  name="myArticle"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setFile(file);
                  }}
                />
              </Button>
            </Box>
            <TextField
              fullWidth
              label={`chars: ${text.length}/200`}
              error={textError !== ""}
              helperText={textError}
              variant="outlined"
              placeholder={`caption`}
              value={text}
              onChange={(e) => {
                setText(e.target.value.slice(0, 200));
              }}
            />
          </Box>
          <Divider sx={{ width: "100%" }} />
          <Box sx={{ width: "100%", display: "flex", justifyContent: "end" }}>
            <Button variant="contained" onClick={handleAddArticle}>
              post
            </Button>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}

function DialogAddPhoto({
  dialogAddPhoto,
  setDialogAddPhoto,
}: {
  dialogAddPhoto: boolean;
  setDialogAddPhoto: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const managerContent = ManagerContent;
  const account = useAccount();
  const [text, setText] = useState("");
  const [textError, setTextError] = useState("");

  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    setTextError("");
  }, [text]);

  const handleAddArticle = () => {
    if (text === "") {
      setTextError("article is empty");
      return;
    }

    if (!file) return;
    if (!account) return;

    setText("");
    setDialogAddPhoto(false);
    managerContent.addPhoto(file, text, account.id, account.username);
  };

  return (
    <>
      <></>
      <></>
      <Dialog
        open={dialogAddPhoto}
        onClose={() => {
          setDialogAddPhoto(false);
          setFile(null);
          setText("");
        }}
      >
        <Box
          sx={{
            width: "400px",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            alignItems: "center",
            padding: "0.5rem",
            boxSizing: "border-box",
          }}
        >
          <DialogTitle>Add Photo</DialogTitle>
          <Divider sx={{ width: "100%" }} />

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              width: "100%",
            }}
          >
            <img
              alt="upload"
              src={file ? URL.createObjectURL(file) : "/placeholder.jpg"}
              style={{
                opacity: file ? "1.0" : "0.2",
                height: "18vh",
                objectFit: "cover",
              }}
            />
            <Box sx={{ display: "flex" }}>
              <PhotoCameraIcon color="primary" />
              <Box sx={{ flex: "1" }}>{file?.name}</Box>
              <Button
                size="small"
                variant="contained"
                component="label"
                color={file ? "inherit" : "primary"}
              >
                upload
                <input
                  accept="image/*"
                  type="file"
                  name="myArticle"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setFile(file);
                  }}
                />
              </Button>
            </Box>
            <TextField
              fullWidth
              label={`chars: ${text.length}/200`}
              error={textError !== ""}
              helperText={textError}
              variant="outlined"
              placeholder={`caption`}
              value={text}
              onChange={(e) => {
                setText(e.target.value.slice(0, 200));
              }}
            />
          </Box>
          <Divider sx={{ width: "100%" }} />
          <Box sx={{ width: "100%", display: "flex", justifyContent: "end" }}>
            <Button variant="contained" onClick={handleAddArticle}>
              post
            </Button>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}

const apiKey = "AIzaSyD29hxSTwTWZhpKG315tda47fy2HOny2v8";

async function isYouTubeVideoValid(videoId: string) {
  // Construct the API request URL
  const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet`;

  try {
    // Make the API request using fetch
    const response = await fetch(apiUrl);

    if (!response.ok) {
      // Handle API request error
      console.error("YouTube API request failed");
      return false;
    }

    const data = await response.json();

    // Check if the API response contains information about the video
    if (data.items && data.items.length > 0) {
      // Video exists
      return true;
    } else {
      // Video does not exist
      return false;
    }
  } catch (error) {
    // Handle network error
    console.error("Network error", error);
    return false;
  }
}

function DialogAddVideo({
  dialogAddVideo,
  setDialogAddVideo,
}: {
  dialogAddVideo: boolean;
  setDialogAddVideo: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const managerContent = ManagerContent;
  const account = useAccount();

  const [videoId, setVideoId] = useState("");
  const [videoIdError, setVideoIdError] = useState("");

  const [text, setText] = useState("");
  const [textError, setTextError] = useState("");

  useEffect(() => {
    setTextError("");
  }, [text]);

  useEffect(() => {
    setVideoIdError("");
  }, [videoId]);

  const handleAddVideo = async () => {
    if (text === "") {
      setTextError("caption is empty");
      return;
    }

    const id = videoId.split("=")[1];
    if (!(await isYouTubeVideoValid(id))) {
      setVideoIdError("invalid video");
      return;
    }

    if (!account) return;

    setVideoId("");
    setText("");
    setDialogAddVideo(false);

    managerContent.addVideo(id, text, account.id, account.username);
  };

  return (
    <>
      <></>
      <></>
      <Dialog
        open={dialogAddVideo}
        onClose={() => {
          setDialogAddVideo(false);
          setText("");
        }}
      >
        <Box
          sx={{
            width: "400px",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            alignItems: "center",
            padding: "0.5rem",
            boxSizing: "border-box",
          }}
        >
          <DialogTitle>Add Video</DialogTitle>
          <Divider sx={{ width: "100%" }} />
          <TextField
            fullWidth
            error={videoIdError !== ""}
            helperText={videoIdError}
            variant="outlined"
            label="video id or url"
            value={videoId}
            onChange={async (e) => {
              setVideoId(e.target.value);
            }}
          />
          <TextField
            fullWidth
            error={textError !== ""}
            helperText={textError}
            variant="outlined"
            placeholder={`caption`}
            value={text}
            label={`chars: ${text.length}/200`}
            onChange={(e) => {
              setText(e.target.value.slice(0, 200));
            }}
          />
          <Divider sx={{ width: "100%" }} />
          <Box sx={{ width: "100%", display: "flex", justifyContent: "end" }}>
            <Button variant="contained" onClick={handleAddVideo}>
              add
            </Button>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}

function ContentFilterOrder() {
  const managerContent = ManagerContent;

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

  const [order, setOrder] = useState<QueryOrder>(QueryOrder.popular);
  const [timeframe, setTimeframe] = useState<QueryTimeframe>(
    QueryTimeframe.week
  );

  useEffect(() => {
    const typesConetentActive = [];
    if (!filterQuotes) typesConetentActive.push("quote");
    if (!filterArticles) typesConetentActive.push("article");
    if (!filterPhotos) typesConetentActive.push("photo");
    if (!filterVideos) typesConetentActive.push("video");
    managerContent.setTypesContentActive(typesConetentActive);
  }, [filterQuotes, filterArticles, filterPhotos, filterVideos]);

  useEffect(() => {
    managerContent.setOrder(order);
  }, [order]);

  useEffect(() => {
    managerContent.setTimeframe(timeframe);
  }, [timeframe]);

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
            value={order}
            onChange={(e) => setOrder(e.target.value as QueryOrder)}
          >
            <MenuItem value={QueryOrder.new}>new</MenuItem>
            <MenuItem value={QueryOrder.popular}>popular</MenuItem>
            <MenuItem value={QueryOrder.inspiring}>inspiring</MenuItem>
            <MenuItem value={QueryOrder.educational}>educational</MenuItem>
          </Select>
          <Select
            variant="standard"
            size="small"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as QueryTimeframe)}
          >
            <MenuItem value={QueryTimeframe.day}>day</MenuItem>
            <MenuItem value={QueryTimeframe.week}>week</MenuItem>
            <MenuItem value={QueryTimeframe.month}>month</MenuItem>
            <MenuItem value={QueryTimeframe.year}>year</MenuItem>
            <MenuItem value={QueryTimeframe.all}>all</MenuItem>
          </Select>
        </Box>
      </Box>
    </>
  );
}

function ChannelsNavigation() {
  const navigate = useNavigate();
  const account = useAccount();

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
        }}
        borderRadius="0.5rem"
      >
        <IconButton
          onClick={() => {
            navigate("/");
          }}
        >
          <HomeIcon />
        </IconButton>
        <ButtonChats />
        <ButtonNotifications />
        <ButtonSignedInSmall />
      </Box>
    </>
  );
}

function Search() {
  const [text, setText] = useState("");

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
        }}
        borderRadius="0.5rem"
      >
        <TextField
          variant="standard"
          placeholder="search channel"
          fullWidth
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </>
  );
}

function Tree() {
  const account = useAccount();

  const navigate = useNavigate();

  const channelCurrent = useChannelCurrent();
  const channelParent = useChannelParent();

  const channelCurrentChildren = useChannelCurrentChildren();
  const channelParentChildren = useChannelParentChildren();

  const [change, setChange] = useState(false);
  const [order, setOrder] = useState("views");
  const [timeframe, setTimeframe] = useState("week");

  const [sortedCurrentChildren, setSortedCurrentChildren] =
    useState<IChannel[]>();
  const [sortedParentChildren, setSortedParentChildren] =
    useState<IChannel[]>();

  const [dialogChannelAdd, setDialogChannelAdd] = useState(false);
  const [dialogChannelRemove, setDialogChannelRemove] = useState(false);

  useEffect(() => {
    // console.log(channelParentChildren);

    if (order === "alphabetical") {
      setSortedCurrentChildren(
        channelCurrentChildren.sort((a, b) => {
          return a.name.localeCompare(b.name);
        })
      );
      setSortedParentChildren(
        channelParentChildren.sort((a, b) => {
          return a.name.localeCompare(b.name);
        })
      );
    } else if (order === "views") {
      if (timeframe === "day") {
        setSortedCurrentChildren(
          channelCurrentChildren.sort((a, b) => {
            return b.statistics.countViewsDay - a.statistics.countViewsDay;
          })
        );
        setSortedParentChildren(
          channelParentChildren.sort((a, b) => {
            return b.statistics.countViewsDay - a.statistics.countViewsDay;
          })
        );
      } else if (timeframe === "week") {
        setSortedCurrentChildren(
          channelCurrentChildren.sort((a, b) => {
            return b.statistics.countViewsWeek - a.statistics.countViewsWeek;
          })
        );
        setSortedParentChildren(
          channelParentChildren.sort((a, b) => {
            return b.statistics.countViewsWeek - a.statistics.countViewsWeek;
          })
        );
      } else if (timeframe === "month") {
        setSortedCurrentChildren(
          channelCurrentChildren.sort((a, b) => {
            return b.statistics.countViewsMonth - a.statistics.countViewsMonth;
          })
        );
        setSortedParentChildren(
          channelParentChildren.sort((a, b) => {
            return b.statistics.countViewsMonth - a.statistics.countViewsMonth;
          })
        );
      } else if (timeframe === "year") {
        setSortedCurrentChildren(
          channelCurrentChildren.sort((a, b) => {
            return b.statistics.countViewsYear - a.statistics.countViewsYear;
          })
        );
        setSortedParentChildren(
          channelParentChildren.sort((a, b) => {
            return b.statistics.countViewsYear - a.statistics.countViewsYear;
          })
        );
      } else if (timeframe === "all") {
        setSortedCurrentChildren(
          channelCurrentChildren.sort((a, b) => {
            return b.statistics.countViewsAll - a.statistics.countViewsAll;
          })
        );
        setSortedParentChildren(
          channelParentChildren.sort((a, b) => {
            return b.statistics.countViewsAll - a.statistics.countViewsAll;
          })
        );
      }
    } else if (order === "posts") {
      if (timeframe === "day") {
        setSortedCurrentChildren(
          channelCurrentChildren.sort((a, b) => {
            return b.statistics.countPostsDay - a.statistics.countPostsDay;
          })
        );
        setSortedParentChildren(
          channelParentChildren.sort((a, b) => {
            return b.statistics.countPostsDay - a.statistics.countPostsDay;
          })
        );
      } else if (timeframe === "week") {
        setSortedCurrentChildren(
          channelCurrentChildren.sort((a, b) => {
            return b.statistics.countPostsWeek - a.statistics.countPostsWeek;
          })
        );
        setSortedParentChildren(
          channelParentChildren.sort((a, b) => {
            return b.statistics.countPostsWeek - a.statistics.countPostsWeek;
          })
        );
      } else if (timeframe === "month") {
        setSortedCurrentChildren(
          channelCurrentChildren.sort((a, b) => {
            return b.statistics.countPostsMonth - a.statistics.countPostsMonth;
          })
        );
        setSortedParentChildren(
          channelParentChildren.sort((a, b) => {
            return b.statistics.countPostsMonth - a.statistics.countPostsMonth;
          })
        );
      } else if (timeframe === "year") {
        setSortedCurrentChildren(
          channelCurrentChildren.sort((a, b) => {
            return b.statistics.countPostsYear - a.statistics.countPostsYear;
          })
        );
        setSortedParentChildren(
          channelParentChildren.sort((a, b) => {
            return b.statistics.countPostsYear - a.statistics.countPostsYear;
          })
        );
      } else if (timeframe === "all") {
        setSortedCurrentChildren(
          channelCurrentChildren.sort((a, b) => {
            return b.statistics.countPostsAll - a.statistics.countPostsAll;
          })
        );
        setSortedParentChildren(
          channelParentChildren.sort((a, b) => {
            return b.statistics.countPostsAll - a.statistics.countPostsAll;
          })
        );
      }
    }
    if (!change) setChange(true);
  }, [order, timeframe, channelCurrentChildren, channelParentChildren]);

  useEffect(() => {
    if (change) {
      setChange(false);
    }
  });

  useEffect(() => {
    // console.log(sortedParentChildren);
    // console.log(sortedCurrentChildren);
  }, [sortedCurrentChildren, sortedParentChildren, order, timeframe]);

  return (
    <>
      <Box
        bgcolor="background.transperent"
        sx={{
          width: "100%",
          padding: "0.5rem",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          backdropFilter: "blur(2px)",
        }}
        borderRadius="0.5rem"
      >
        <Grid container>
          <Grid item xs={2} sx={{ display: "flex" }} pr="5px">
            <IconButton
              color="info"
              onClick={() => {
                navigate(`/channels/${channelParent?.id}`);
              }}
            >
              <ArrowBackIosNewIcon sx={{ fontSize: "0.8rem" }} />
            </IconButton>
          </Grid>
          <Grid item xs={5} pr="5px">
            <Select
              variant="standard"
              fullWidth
              color="info"
              size="small"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={order}
              // label="Age"
              onChange={(e) => {
                setOrder(e.target.value);
              }}
            >
              <MenuItem value={"alphabetical"}>alphabetical</MenuItem>
              <MenuItem value={"views"}>views</MenuItem>
              <MenuItem value={"posts"}>posts</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={5}>
            <Select
              variant="standard"
              fullWidth
              color="info"
              size="small"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={timeframe}
              // label="Age"
              onChange={(e) => {
                setTimeframe(e.target.value);
              }}
            >
              <MenuItem value={"day"}>day</MenuItem>
              <MenuItem value={"week"}>week</MenuItem>
              <MenuItem value={"month"}>month</MenuItem>
              <MenuItem value={"year"}>year</MenuItem>
              <MenuItem value={"all"}>all</MenuItem>
            </Select>
          </Grid>
        </Grid>
        <Divider />
        <Grid container sx={{ width: "100%" }}>
          <Grid
            item
            xs={6}
            sx={{
              borderRight: "1px solid #222",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              paddingRight: "0.1rem",
              gap: "0.3rem",
            }}
          >
            {sortedParentChildren?.map((channel, idx) => (
              <Box key={idx} sx={{ display: "flex" }}>
                <Button
                  variant={
                    channel.id === channelCurrent?.id ? "contained" : "outlined"
                  }
                  fullWidth
                  color={channel.id === channelCurrent?.id ? "primary" : "info"}
                  size="small"
                  sx={{
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    display: "flex",
                    justifyContent: "left",
                    borderRadius: "2rem",
                  }}
                  onClick={() => {
                    navigate(`/channels/${channel.id}`);
                  }}
                >
                  {order === "views" && timeframe === "day"
                    ? channel?.statistics?.countViewsDay
                    : null}
                  {order === "views" && timeframe === "week"
                    ? channel?.statistics?.countViewsWeek
                    : null}
                  {order === "views" && timeframe === "month"
                    ? channel?.statistics?.countViewsMonth
                    : null}
                  {order === "views" && timeframe === "year"
                    ? channel?.statistics?.countViewsYear
                    : null}
                  {order === "views" && timeframe === "all"
                    ? channel?.statistics?.countViewsAll
                    : null}
                  {order === "posts" && timeframe === "day"
                    ? formatNumber(channel?.statistics?.countPostsDay)
                    : null}
                  {order === "posts" && timeframe === "week"
                    ? formatNumber(channel?.statistics?.countPostsWeek)
                    : null}
                  {order === "posts" && timeframe === "month"
                    ? formatNumber(channel?.statistics?.countPostsMonth)
                    : null}
                  {order === "posts" && timeframe === "year"
                    ? formatNumber(channel?.statistics?.countPostsYear)
                    : null}
                  {order === "posts" && timeframe === "all"
                    ? formatNumber(channel?.statistics?.countPostsAll)
                    : null}
                  {order !== "alphabetical" ? " " : null}
                  {channel.name}
                </Button>
              </Box>
            ))}
            <Box p={2} />
            <Button
              fullWidth
              color="info"
              size="small"
              onClick={() => {
                if (!account) navigate("/signin");
                if (!account) return;
                setDialogChannelRemove(true);
              }}
            >
              <RemoveCircleOutlineIcon fontSize="small" />
            </Button>
          </Grid>
          <Grid
            item
            xs={6}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              paddingLeft: "0.2rem",
              gap: "0.3rem",
            }}
          >
            {sortedCurrentChildren?.map((channel, idx) => (
              <Box key={idx} sx={{ display: "flex" }}>
                <Button
                  variant="outlined"
                  fullWidth
                  color={channel.id === channelCurrent?.id ? "primary" : "info"}
                  size="small"
                  sx={{
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    display: "flex",
                    justifyContent: "left",
                    borderRadius: "2rem",
                  }}
                  onClick={() => {
                    navigate(`/channels/${channel.id}`);
                  }}
                >
                  {order === "views" && timeframe === "day"
                    ? channel?.statistics?.countViewsDay
                    : null}
                  {order === "views" && timeframe === "week"
                    ? channel?.statistics?.countViewsWeek
                    : null}
                  {order === "views" && timeframe === "month"
                    ? channel?.statistics?.countViewsMonth
                    : null}
                  {order === "views" && timeframe === "year"
                    ? channel?.statistics?.countViewsYear
                    : null}
                  {order === "views" && timeframe === "all"
                    ? channel?.statistics?.countViewsAll
                    : null}
                  {order === "posts" && timeframe === "day"
                    ? formatNumber(channel?.statistics?.countPostsDay)
                    : null}
                  {order === "posts" && timeframe === "week"
                    ? formatNumber(channel?.statistics?.countPostsWeek)
                    : null}
                  {order === "posts" && timeframe === "month"
                    ? formatNumber(channel?.statistics?.countPostsMonth)
                    : null}
                  {order === "posts" && timeframe === "year"
                    ? formatNumber(channel?.statistics?.countPostsYear)
                    : null}
                  {order === "posts" && timeframe === "all"
                    ? formatNumber(channel?.statistics?.countPostsAll)
                    : null}
                  {order !== "alphabetical" ? " " : null}
                  {channel.name}
                </Button>
              </Box>
            ))}
            <Box p={2} />
            <Button
              fullWidth
              color="info"
              size="small"
              sx={{ overflow: "hidden" }}
              onClick={() => {
                if (!account) navigate("/signin");
                if (!account) return;
                setDialogChannelAdd(true);
              }}
            >
              <AddCircleOutlineIcon fontSize="small" />
            </Button>
          </Grid>
        </Grid>
      </Box>
      <></>
      <></>

      <DialogChannelAdd
        dialogChannelAdd={dialogChannelAdd}
        setDialogChannelAdd={setDialogChannelAdd}
      />
      <DialogChannelRemove
        dialogChannelRemove={dialogChannelRemove}
        setDialogChannelRemove={setDialogChannelRemove}
      />
    </>
  );
}

function DialogChannelAdd({
  dialogChannelAdd,
  setDialogChannelAdd,
}: {
  dialogChannelAdd: boolean;
  setDialogChannelAdd: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const account = useAccount();
  const managerChannels = ManagerChannels;
  const channelCurrent = useChannelCurrent();
  const channelCurrentChildren = useChannelCurrentChildren();

  const [text, setText] = useState("");
  const [textError, setTextError] = useState("");

  useEffect(() => {
    setTextError("");
  }, [text]);

  const handleAddChannel = () => {
    if (text === "") {
      setTextError("channel name is empty");
      return;
    }

    if (channelCurrentChildren.find((channel) => channel.name === text)) {
      setTextError("channel name already exists");
      return;
    }

    if (!account) return;

    managerChannels.addChannel(text, account.username, account.id);
    setText("");
    setDialogChannelAdd(false);
  };

  return (
    <>
      <></>
      <></>
      <Dialog
        open={dialogChannelAdd}
        onClose={() => {
          setDialogChannelAdd(false);
          setText("");
        }}
      >
        <Box
          sx={{
            width: "400px",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            alignItems: "center",
            padding: "0.5rem",
            boxSizing: "border-box",
          }}
        >
          <DialogTitle>Add sub channel to "{channelCurrent?.name}"</DialogTitle>
          <Divider sx={{ width: "100%" }} />
          <TextField
            fullWidth
            error={textError !== ""}
            helperText={textError}
            variant="outlined"
            placeholder={`new channel name`}
            value={text}
            onChange={(e) => {
              setText(e.target.value.toLowerCase());
            }}
          />
          <Divider sx={{ width: "100%" }} />
          <Box sx={{ width: "100%", display: "flex", justifyContent: "end" }}>
            <Button
              variant="contained"
              color="success"
              onClick={handleAddChannel}
            >
              add
            </Button>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}

function DialogChannelRemove({
  dialogChannelRemove,
  setDialogChannelRemove,
}: {
  dialogChannelRemove: boolean;
  setDialogChannelRemove: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const managerChannels = ManagerChannels;

  const [text, setText] = useState("");
  const [textError, setTextError] = useState("");
  const channelCurrent = useChannelCurrent();

  useEffect(() => {
    setTextError("");
  }, [text]);

  const handleRemoveChannel = () => {
    if (text !== channelCurrent?.name) {
      setTextError("channel name doesn't match");
      return;
    }

    if (channelCurrent?.id === idRoot) {
      setTextError("cannot remove root channel");
      return;
    }

    if (channelCurrent?.idsChildren.length > 0) {
      setTextError("channel must have no children");
      return;
    }

    managerChannels.removeChannelCurrent();
    setText("");
    setDialogChannelRemove(false);
  };

  return (
    <>
      <></>
      <></>
      <Dialog
        open={dialogChannelRemove}
        onClose={() => {
          setDialogChannelRemove(false);
          setText("");
        }}
      >
        <Box
          sx={{
            width: "400px",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            alignItems: "center",
            padding: "0.5rem",
            boxSizing: "border-box",
          }}
        >
          <DialogTitle>Remove Channel</DialogTitle>
          <Divider sx={{ width: "100%" }} />
          <TextField
            fullWidth
            error={textError !== ""}
            helperText={textError}
            variant="outlined"
            placeholder={`type channel name - "${channelCurrent?.name}"`}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
            }}
          />
          <Divider sx={{ width: "100%" }} />
          <Box sx={{ width: "100%", display: "flex", justifyContent: "end" }}>
            <Button
              variant="contained"
              color="error"
              onClick={handleRemoveChannel}
            >
              remove
            </Button>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}
