import {
  Box,
  Button,
  Collapse,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  useTheme,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import ManagerContent from "../../data/_9_ManagerContent/ManagerContent";
import ManagerTraceUser from "../../data/_4_ManagerTraceUser/ManagerTraceUser";
import useAccount from "../../data/_1_ManagerAccount/useAccount";
import useIdsUsersComments from "../../data/_10_ManagerComments/useIdsUsersComments";
import { useEffect, useRef, useState } from "react";
import useStateStars from "../../data/_4_ManagerTraceUser/useStateStars";
import useStateBooks from "../../data/_4_ManagerTraceUser/useStateBooks";
import useStateComments from "../../data/_4_ManagerTraceUser/useStateComments";
import { IDataPhoto, IDataVideo, IPost } from "../../data/post";
import YouTube from "react-youtube";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { ICommentBuilt } from "../../data/comment";
import ManagerComments from "../../data/_10_ManagerComments/ManagerComments";

import VisibilityIcon from "@mui/icons-material/Visibility";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import StarIcon from "@mui/icons-material/Star";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import useComments from "../../data/_10_ManagerComments/useComments";
import Article from "../Article/Article";
import ManagerChats from "../../data/_5_ManagerChats/ManagerChats";

export default function Post({
  post,
  propExpanded = false,
  propOpenComments = false,
}: {
  post: IPost;
  propExpanded?: boolean;
  propOpenComments?: boolean;
}) {
  const params = useParams();

  // general
  const theme = useTheme();
  const navigate = useNavigate();
  const managerContent = ManagerContent;
  const managerTraceUser = ManagerTraceUser;
  const account = useAccount();
  const idsUsersComments = useIdsUsersComments(post.id);

  // open wide
  const refUser = useRef(null);

  // post specific
  const stars = useStateStars();
  const books = useStateBooks();
  const comments = useStateComments();

  // comments
  const [openComments, setOpenComments] = useState(propOpenComments);
  const [textComment, setTextComment] = useState("");

  // post expansion logic
  const [expanded, setExpanded] = useState(propExpanded);

  // user menu
  const managerChats = ManagerChats;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClickBox = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target !== refUser.current) {
      setExpanded(!expanded);
    }
  };

  return (
    <>
      <></>
      <></>
      <Box
        p="0.5rem"
        bgcolor={"background.transperent"}
        borderRadius="0.5rem"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          backdropFilter: "blur(2px)",
          border: `2px solid ${theme.palette.info.main}`,

          "&:hover": {
            border: openComments
              ? null
              : `2px solid ${theme.palette.info.dark}`,
            background: openComments
              ? null
              : theme.palette.background.transperentHover,
            cursor: "pointer",
          },
        }}
        onClick={(e) => handleClickBox(e)}
      >
        <Box color="info.main" sx={{ display: "flex", alignItems: "center" }}>
          <Button
            size="small"
            variant="outlined"
            color="info"
            onClick={(e) => {
              e.stopPropagation();
              setAnchorEl(e.currentTarget);
            }}
            sx={{
              borderRadius: "2rem",
              backgroundColor: theme.palette.background.transperent,
              textTransform: "none",
            }}
          >
            {post.nameCreator}
          </Button>
          <Menu
            open={!!anchorEl}
            anchorEl={anchorEl}
            onClose={(e) => {
              setAnchorEl(null);
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <MenuItem
              onClick={() => {
                if (account && post.idCreator !== account.id) {
                  managerChats.createChat(post.idCreator);
                  const idChat = account.id.localeCompare(post.idCreator)
                    ? account.id + post.idCreator
                    : post.idCreator + account.id;
                  navigate(`/chats/${idChat}`);
                }
              }}
            >
              {post.idCreator !== account?.id ? "send message" : "this is you"}
            </MenuItem>
          </Menu>
          <Divider sx={{ flex: "1", marginX: "1rem" }} />
          <Box
            sx={{ display: "flex", alignItems: "center", gap: "0.2rem" }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <VisibilityIcon sx={{ fontSize: "1rem" }} />
            <Box>{formatNumber(post.countViews)}</Box>
            <IconButton size="small" color="info">
              <MoreVertIcon sx={{ fontSize: "1.2rem" }} />
            </IconButton>
            <IconButton
              size="small"
              color="info"
              onClick={() => {
                navigate(`/channels/${params.idChannel}/posts/${post.id}`);
              }}
            >
              <OpenInFullIcon sx={{ fontSize: "1.2rem" }} />
            </IconButton>
          </Box>
        </Box>
        {post.type === "quote" ? <Quote post={post} /> : null}
        {post.type === "article" ? (
          <Article post={post} expanded={expanded} />
        ) : null}
        {post.type === "photo" ? (
          <Photo post={post} expanded={expanded} />
        ) : null}
        {post.type === "video" ? (
          <Video post={post} expanded={expanded} />
        ) : null}
        <Box
          sx={{
            display: "flex",
            justifyContent: "right",
            alignItems: "center",
          }}
        >
          {/* <Divider sx={{ flex: "1", marginRight: "1rem" }} /> */}
          <Box
            sx={{ display: "flex", gap: "0.5rem" }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Button
              size="small"
              variant="outlined"
              color="info"
              onClick={() => {
                if (!account) {
                  navigate("/signin");
                  return;
                }
                if (!stars?.has(post.id)) {
                  managerContent.addStarPost(post);
                  managerTraceUser.addStar(post);
                } else {
                  managerContent.removeStarPost(post);
                  managerTraceUser.removeStar(post);
                }
              }}
              sx={{
                borderRadius: "2rem",
                backgroundColor: theme.palette.background.transperent,
                color: stars?.has(post.id)
                  ? theme.palette.warning.light
                  : theme.palette.info.main,
              }}
              startIcon={
                stars?.has(post.id) ? <StarIcon /> : <StarOutlineIcon />
              }
            >
              {formatNumber(post.statistics.countStarsAll)}
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="info"
              onClick={() => {
                if (!account) {
                  navigate("/signin");
                  return;
                }
                if (!books?.has(post.id)) {
                  managerContent.addBookPost(post);
                  managerTraceUser.addBook(post);
                } else {
                  managerContent.removeBookPost(post);
                  managerTraceUser.removeBook(post);
                }
              }}
              startIcon={<MenuBookIcon />}
              sx={{
                borderRadius: "2rem",
                backgroundColor: theme.palette.background.transperent,
                color: books?.has(post.id)
                  ? theme.palette.success.light
                  : theme.palette.info.main,
              }}
            >
              {formatNumber(post.statistics.countBooksAll)}
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="info"
              onClick={() => {
                setOpenComments(!openComments);
              }}
              startIcon={
                idsUsersComments?.has(account?.id ?? "") ? (
                  <ChatBubbleIcon />
                ) : (
                  <ChatBubbleOutlineIcon />
                )
              }
              sx={{
                borderRadius: "2rem",
                backgroundColor: theme.palette.background.transperent,
                color: idsUsersComments?.has(account?.id ?? "")
                  ? theme.palette.primary.main
                  : theme.palette.info.main,
              }}
            >
              {formatNumber(post.countComments)}
            </Button>
          </Box>
        </Box>
        <Box
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Collapse in={openComments}>
            <Comments post={post} />
          </Collapse>
        </Box>
      </Box>
    </>
  );
}

function Comments({ post }: { post: IPost }) {
  const managerComments = ManagerComments;
  const comments = useComments(post.id, Date.now().toString());

  const [textComment, setTextComment] = useState("");
  const [shiftDown, setShiftDown] = useState(false);

  return (
    <Box
      mt="1rem"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        cursor: "default",
      }}
    >
      <Box>
        <TextField
          size="small"
          fullWidth
          multiline
          maxRows={6}
          variant="filled"
          label={"comment..."}
          value={textComment}
          onChange={(e) => {
            setTextComment(e.target.value.slice(0, 1000));
          }}
          onKeyDown={(e) => {
            // console.log("key down");
            if (e.key === "Shift") {
              setShiftDown(true);
            }
            if (e.key === "Enter" && !shiftDown && textComment !== "") {
              managerComments.addComment(textComment, post);
              setTextComment("");
              e.preventDefault();
            }
          }}
          onKeyUp={(e) => {
            // console.log("key up");
            if (e.key === "Shift") {
              setShiftDown(false);
            }
          }}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          maxHeight: "500px",
          overflowY: "auto",
        }}
      >
        {comments.map((comment, idx) => (
          <Box key={idx}>
            <Comment comment={comment} post={post} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function Comment({ comment, post }: { comment: ICommentBuilt; post: IPost }) {
  const account = useAccount();
  const theme = useTheme();
  const managerComments = ManagerComments;

  const [openReply, setOpenReply] = useState(false);
  const [textReply, setTextReply] = useState("");
  const [shiftDown, setShiftDown] = useState(false);

  const [minimized, setMinimized] = useState(false);

  const date = new Date(comment.timestampCreation);

  return (
    <>
      <></>
      <></>
      <Box>
        <Box
          color="info.main"
          sx={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
        >
          <Box>{comment.nameAuthor}</Box>
          <Divider sx={{ flex: 1 }} />
          <Box>
            {getMonthAbbreviation(date.getMonth())}-{date.getDate()}
          </Box>
        </Box>
        <Collapse in={minimized}>
          <IconButton onClick={() => setMinimized(false)} size="small">
            <OpenInFullIcon fontSize="small" />
          </IconButton>
        </Collapse>
        <Collapse in={!minimized}>
          <Box sx={{ display: "flex" }}>
            <Divider
              orientation="vertical"
              flexItem
              sx={{
                paddingLeft: "3px",
                "&:hover": {
                  cursor: "pointer",
                  backgroundColor: theme.palette.primary.light,
                },
              }}
              onClick={() => {
                setMinimized(true);
              }}
            />
            <Box
              sx={{ flex: 1, display: "flex", flexDirection: "column" }}
              pl="0.5rem"
            >
              <Box>{comment.text}</Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton
                    // sx={{ paddingRight: "0" }}
                    size="small"
                    color={
                      comment.idsUpvotes?.includes(account?.id ?? "")
                        ? "success"
                        : "info"
                    }
                    onClick={() => {
                      if (comment.idsUpvotes?.includes(account?.id ?? "")) {
                        managerComments.unUpvoteComment(post.id, comment.id);
                      } else {
                        managerComments.upvoteComment(post.id, comment.id);
                      }
                      if (comment.idsDownvotes?.includes(account?.id ?? "")) {
                        managerComments.unDownvoteComment(post.id, comment.id);
                      }
                    }}
                  >
                    <KeyboardDoubleArrowUpIcon fontSize="small" />
                  </IconButton>
                  <Box
                    color="info.main"
                    sx={{ width: "3px", left: "-3px", position: "relative" }}
                  >
                    {formatNumber(
                      comment.countUpvotes - comment.countDownvotes
                    )}
                  </Box>
                  <IconButton
                    // sx={{ paddingLeft: "0" }}
                    size="small"
                    color={
                      comment.idsDownvotes?.includes(account?.id ?? "")
                        ? "error"
                        : "info"
                    }
                    onClick={() => {
                      if (comment.idsDownvotes?.includes(account?.id ?? "")) {
                        managerComments.unDownvoteComment(post.id, comment.id);
                      } else {
                        managerComments.downvoteComment(post.id, comment.id);
                      }
                      if (comment.idsUpvotes?.includes(account?.id ?? "")) {
                        managerComments.unUpvoteComment(post.id, comment.id);
                      }
                    }}
                  >
                    <KeyboardDoubleArrowDownIcon fontSize="small" />
                  </IconButton>
                  <Box
                    color="info.main"
                    borderColor="info.main"
                    borderBottom="solid 1px"
                    marginRight="0.5rem"
                    onClick={() => setOpenReply(!openReply)}
                    sx={{ cursor: "pointer" }}
                  >
                    reply
                  </Box>
                </Box>
              </Box>
              <Box>
                <Collapse in={openReply}>
                  <TextField
                    sx={{ paddingBottom: "0.5rem" }}
                    variant="filled"
                    size="small"
                    label="reply..."
                    fullWidth
                    multiline
                    maxRows={3}
                    value={textReply}
                    onChange={(e) => {
                      setTextReply(e.target.value.slice(0, 1000));
                    }}
                    onKeyDown={(e) => {
                      // console.log("key down");
                      if (e.key === "Shift") {
                        setShiftDown(true);
                      }
                      if (e.key === "Enter" && !shiftDown && textReply !== "") {
                        managerComments.addReply(post, comment.id, textReply);
                        setTextReply("");
                        e.preventDefault();
                      }
                    }}
                    onKeyUp={(e) => {
                      // console.log("key up");
                      if (e.key === "Shift") {
                        setShiftDown(false);
                      }
                    }}
                  />
                </Collapse>
              </Box>
              {comment.replies.map((reply, idx) => (
                <Box key={idx}>
                  <Comment comment={reply} post={post} />
                </Box>
              ))}
            </Box>
          </Box>
        </Collapse>
      </Box>
    </>
  );
}

function Quote({ post }: { post: IPost }) {
  const theme = useTheme();

  return (
    <>
      <></>
      <></>
      <></>
      {post.data.caption}
    </>
  );
}

function Photo({ post, expanded }: { post: IPost; expanded: boolean }) {
  const storage = getStorage();

  const [imgURL, setImgURL] = useState<string | undefined>(undefined);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!imgURL && error === "") {
      const data = post.data as IDataPhoto;
      getDownloadURL(ref(storage, data.url))
        .then((thisURL: string) => {
          setImgURL(thisURL);
        })
        .catch((err) => {
          console.log(err);
          setError(err);
        });
    }
  });

  return (
    <Box>
      <Collapse in={!expanded}>
        <Box sx={{ display: "flex" }}>
          <img
            alt="img"
            src={imgURL}
            style={{
              // width: "320px",
              height: "180px",
              objectFit: "cover",
            }}
          />
          <Box pl="1rem">{post.data.caption}</Box>
        </Box>
      </Collapse>
      <Collapse in={expanded}>
        <Box>
          <img
            alt="img"
            src={imgURL}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          <Box py="0.5rem">{post.data.caption}</Box>
        </Box>
      </Collapse>
    </Box>
  );
}

function Video({ post, expanded }: { post: IPost; expanded: boolean }) {
  const opts = {
    height: "400",
    width: "100%",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0,
    },
  };

  const data = post.data as IDataVideo;

  return (
    <>
      <></>
      <></>
      <Box>
        <Collapse in={!expanded}>
          <Box sx={{ display: "flex" }}>
            <YouTube
              videoId={data.id}
              opts={{
                width: "320px",
                height: "180px",
                playerVars: {
                  // https://developers.google.com/youtube/player_parameters
                  autoplay: 0,
                },
              }}
              id="video"
              //
            />
            <Box color="active.main" pl="1rem" sx={{ textWrap: "wrap" }}>
              {data.caption}
            </Box>
          </Box>
        </Collapse>
        <Collapse in={expanded}>
          <YouTube
            videoId={data.id}
            opts={{
              height: "500px",
              width: "100%",
              playerVars: {
                // https://developers.google.com/youtube/player_parameters
                autoplay: 0,
              },
            }}
            id="video"
            //
          />
          <Box color="active.main" py="0.5rem" sx={{ textWrap: "wrap" }}>
            {data.caption}
          </Box>
        </Collapse>
      </Box>
    </>
  );
}

function getMonthAbbreviation(month: number) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return months[month];
}

function formatNumber(num: number) {
  if (num < 1000) {
    return num.toString();
  } else if (num < 1000000) {
    return (num / 1000).toFixed(1) + "k";
  } else {
    return (num / 1000000).toFixed(1) + "m";
  }
}
