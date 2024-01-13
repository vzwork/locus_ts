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
  SelectChangeEvent,
  TextField,
  Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import VisibilityIcon from "@mui/icons-material/Visibility";

import { IChannel } from "../data/channel";
import ManagerContent from "../data/_9_ManagerContent/ManagerContent";
import { QueryOrder } from "../data/query";
import { idRoot } from "../data/db";
import useAccount from "../data/_1_ManagerAccount/useAccount";

export default function Channels() {
  const managerChannels = ManagerChannels;
  const params = useParams();
  const [width, height] = useWindowSize();

  useEffect(() => {
    if (params.id) {
      managerChannels.setChannelCurrent(params.id);
    }
  });

  return (
    <>
      {width > 600 ? (
        <>{width > 1100 ? <ChannelsDesktop /> : <ChannelsCompact />}</>
      ) : (
        <ChannelsMobile />
      )}
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
              sx={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
            >
              <ChannelsNavigation />
              <Search />
              <Tree />
            </Box>
          </Grid>
          <Grid item sm={8} md={9}>
            <Box p={1}>
              <ContentFilterOrder />
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
                sx={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
              >
                <ChannelsNavigation />
                <Search />
                <Tree />
              </Box>
            </Grid>
            <Grid item md={6} lg={7} xl={8}>
              <Box p={1}>
                <ContentFilterOrder />
              </Box>
            </Grid>
            <Grid item md={3} lg={2.5} xl={2}>
              <Box p={1}>side</Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
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

  const [sort, setSort] = useState<QueryOrder>(QueryOrder.popular);
  const [timeframe, setTimeframe] = useState("week");

  useEffect(() => {
    const typesConetentActive = [];
    if (!filterQuotes) typesConetentActive.push("quote");
    if (!filterArticles) typesConetentActive.push("article");
    if (!filterPhotos) typesConetentActive.push("photo");
    if (!filterVideos) typesConetentActive.push("video");
    managerContent.setTypesContentActive(typesConetentActive);
  }, [filterQuotes, filterArticles, filterPhotos, filterVideos]);

  return (
    <>
      <></>
      <></>
      <Box
        bgcolor="background.paper"
        sx={{
          width: "100%",
          padding: "0.5rem",
          boxSizing: "border-box",
          display: "flex",
          justifyContent: "space-between",
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
            value={sort}
            onChange={(e) => setSort(e.target.value as QueryOrder)}
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
            onChange={(e) => setTimeframe(e.target.value)}
          >
            <MenuItem value={"day"}>day</MenuItem>
            <MenuItem value={"week"}>week</MenuItem>
            <MenuItem value={"month"}>month</MenuItem>
            <MenuItem value={"year"}>year</MenuItem>
            <MenuItem value={"all"}>all</MenuItem>
          </Select>
        </Box>
      </Box>
    </>
  );
}

function ChannelsNavigation() {
  const navigate = useNavigate();

  return (
    <>
      <></>
      <></>
      <Box
        bgcolor="background.paper"
        sx={{ width: "100%", padding: "0.5rem", boxSizing: "border-box" }}
        borderRadius="0.5rem"
      >
        <IconButton
          onClick={() => {
            navigate("/");
          }}
        >
          <HomeIcon />
        </IconButton>
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
        bgcolor="background.paper"
        sx={{
          width: "100%",
          padding: "0.5rem",
          boxSizing: "border-box",
        }}
        borderRadius="0.5rem"
      >
        <TextField
          variant="standard"
          placeholder="search"
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
  function formatNumber(num: number) {
    if (num < 1000) {
      return num.toString();
    } else if (num < 1000000) {
      return (num / 1000).toFixed(1) + "k";
    } else {
      return (num / 1000000).toFixed(1) + "m";
    }
  }

  const navigate = useNavigate();

  const channelCurrent = useChannelCurrent();
  const channelParent = useChannelParent();

  const channelCurrentChildren = useChannelCurrentChildren();
  const channelParentChildren = useChannelParentChildren();

  const [sort, setSort] = useState("views");
  const [timeframe, setTimeframe] = useState("week");

  const [sortedCurrentChildren, setSortedCurrentChildren] =
    useState<IChannel[]>();
  const [sortedParentChildren, setSortedParentChildren] =
    useState<IChannel[]>();

  const handleChange = (event: SelectChangeEvent) => {
    setSort(event.target.value as string);
  };

  const [dialogChannelAdd, setDialogChannelAdd] = useState(false);
  const [dialogChannelRemove, setDialogChannelRemove] = useState(false);

  useEffect(() => {
    // console.log(channelParentChildren);

    if (sort === "alphabetical") {
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
    } else if (sort === "views") {
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
    } else if (sort === "posts") {
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
    }
  });

  return (
    <>
      <Box
        bgcolor="background.paper"
        sx={{
          width: "100%",
          padding: "0.5rem",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
        borderRadius="0.5rem"
      >
        <Grid container>
          {/* <Grid xs={6}>
            {channelGrandParent?.id !== channelParent?.id ? (
              <Button
                size="small"
                fullWidth
                color="inherit"
                onClick={() => {
                  navigate(`/channels/${channelGrandParent?.id}`);
                }}
              >
                # {channelGrandParent?.name}
              </Button>
            ) : null}
          </Grid> */}
          <Grid item xs={2} sx={{ display: "flex" }} pr="5px">
            <IconButton
              // size="small"
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
              value={sort}
              // label="Age"
              onChange={handleChange}
            >
              <MenuItem value={"alphabetical"}>alphabetical</MenuItem>
              <MenuItem value={"views"}>views</MenuItem>
              {/* <MenuItem value={"posts"}>Posts</MenuItem> */}
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
            }}
          >
            {sortedParentChildren?.map((channel, idx) => (
              <Box key={idx} sx={{ display: "flex" }}>
                {sort === "views" ? (
                  <Box
                    color="info.main"
                    sx={{
                      fontSize: "0.8rem",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {formatNumber(channel?.statistics?.countViewsDay)}
                  </Box>
                ) : null}
                <Button
                  fullWidth
                  color={channel.id === channelCurrent?.id ? "primary" : "info"}
                  size="small"
                  sx={{
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    display: "flex",
                    justifyContent: "left",
                  }}
                  onClick={() => {
                    navigate(`/channels/${channel.id}`);
                  }}
                >
                  {channel.name}
                </Button>
              </Box>
            ))}
            <Box p={2} />
            <Button
              fullWidth
              color="info"
              size="small"
              onClick={() => setDialogChannelRemove(true)}
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
            }}
          >
            {sortedCurrentChildren?.map((channel, idx) => (
              <Box key={idx} sx={{ display: "flex" }}>
                {sort === "views" ? (
                  <Box
                    color="info.main"
                    sx={{
                      fontSize: "0.8rem",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {channel?.statistics?.countViewsWeek}
                  </Box>
                ) : null}
                <Button
                  fullWidth
                  color={channel.id === channelCurrent?.id ? "primary" : "info"}
                  size="small"
                  sx={{
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    display: "flex",
                    justifyContent: "left",
                  }}
                  onClick={() => {
                    navigate(`/channels/${channel.id}`);
                  }}
                >
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
