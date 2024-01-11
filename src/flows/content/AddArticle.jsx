import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";

import ClearIcon from "@mui/icons-material/Clear";

import PostsManager from "../../data/posts/postsManager";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";

export default function AddArticle({ addArticle, setAddArticle }) {
  const auth = getAuth();
  const postsManager = PostsManager.getInstance();

  const [caption, setCaption] = useState("");
  const [captionError, setCaptionError] = useState("");

  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  const [file, setFile] = useState(null);

  useEffect(() => {
    setCaptionError("");
  }, [caption, file]);

  useEffect(() => {
    setDescriptionError("");
  }, [description]);

  const postArticle = () => {
    if (!file) {
      setCaptionError("Please upload a file.");
      return;
    }

    if (caption.length === 0) {
      setCaptionError("Please enter a caption.");
      return;
    }

    if (description.length === 0) {
      setDescriptionError("Please enter a description.");
      return;
    }

    postsManager.addArticle(
      file,
      caption,
      description,
      auth.currentUser.uid,
      auth.currentUser.displayName
    );
    setAddArticle(false);
    setCaption("");
    setCaptionError("");
    setDescription("");
    setDescriptionError("");
    setFile(null);
  };

  return (
    <>
      <Dialog
        open={addArticle}
        onClose={() => {
          setAddArticle(false);
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          Add an article:
          <IconButton color="primary" onClick={() => setAddArticle(false)}>
            <ClearIcon />
          </IconButton>
        </DialogTitle>
        <Box sx={{ width: "min(90vw, 600px)", display: "flex" }}>
          <Box
            p="1rem"
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            <Box>{file?.name}</Box>
            <Button
              fullWidth
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
                  setFile(e.target.files[0]);
                }}
              />
            </Button>
            <TextField
              size="small"
              fullWidth
              label="Caption"
              value={caption}
              onChange={(e) => {
                setCaption(e.target.value);
              }}
              error={captionError.length > 0}
              helperText={captionError}
            />
            <TextField
              size="small"
              fullWidth
              label="Describe what the article is about"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              error={descriptionError.length > 0}
              helperText={descriptionError}
            />
            <Button onClick={postArticle} variant="outlined">
              post
            </Button>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}
