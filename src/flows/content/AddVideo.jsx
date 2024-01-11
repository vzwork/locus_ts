import { Box, Button, Dialog, DialogTitle, IconButton } from "@mui/material";

import ClearIcon from "@mui/icons-material/Clear";
import PostsManager from "../../data/posts/postsManager";
import { useState } from "react";
import { getAuth } from "firebase/auth";

const apiKey = "AIzaSyD29hxSTwTWZhpKG315tda47fy2HOny2v8";

async function isYouTubeVideoValid(videoId) {
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

export default function AddVideo({ addVideo, setAddVideo }) {
  const auth = getAuth();
  const postsManager = PostsManager.getInstance();

  const [caption, setCaption] = useState("");
  const [captionError, setCaptionError] = useState("");

  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState("");

  const postVideo = async () => {
    // error handling
    const youTubeVideoId = url.split("=")[1]
      ? url.split("=")[1]
      : url.split("=")[0];

    if (!(await isYouTubeVideoValid(youTubeVideoId))) {
      setUrlError("invalid url");
    } else {
      postsManager.addVideo();
    }
  };

  return (
    <>
      <Dialog
        open={addVideo}
        onClose={() => {
          setAddVideo(false);
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          Add a video:
          <IconButton color="primary" onClick={() => setAddVideo(false)}>
            <ClearIcon />
          </IconButton>
        </DialogTitle>
        <Box sx={{ width: "min(90vw, 600px)", display: "flex" }}>
          <Box
            p="1rem"
            sx={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <Button onClick={postVideo}>post</Button>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}
