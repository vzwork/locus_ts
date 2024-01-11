import { useEffect, useState } from "react";
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

export default function AddQuote({ addQuote, setAddQuote }) {
  const auth = getAuth();

  const postsManager = PostsManager.getInstance();

  const LIMIT_CHARS = 256;

  const [text, setText] = useState("");
  const [textError, setTextError] = useState("");
  const [charsRemaining, setCharsRemaining] = useState(LIMIT_CHARS);

  useEffect(() => {
    setCharsRemaining(LIMIT_CHARS - text.length);
    setTextError("");
  }, [text]);

  const postQuote = () => {
    if (text.length === 0) {
      setTextError("Please enter some text.");
      return;
    }

    postsManager.addQuote(
      text,
      auth.currentUser.uid,
      auth.currentUser.displayName
    );
    setAddQuote(false);
    setText("");
    setTextError("");
  };

  return (
    <>
      <Dialog
        open={addQuote}
        onClose={() => {
          setAddQuote(false);
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          Add a quote:
          <IconButton color="primary" onClick={() => setAddQuote(false)}>
            <ClearIcon />
          </IconButton>
        </DialogTitle>
        <Box
          sx={{
            width: "min(90vw, 600px)",
            display: "flex",
          }}
        >
          <Box
            p="1rem"
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: "0.5rem",
            }}
          >
            <TextField
              label={`${charsRemaining} characters left`}
              multiline
              fullWidth
              minRows={2}
              value={text}
              onChange={(event) => setText(event.target.value)}
              error={textError.length > 0}
              helperText={textError}
              inputProps={{
                maxLength: LIMIT_CHARS,
              }}
            />
            <Button variant="contained" onClick={postQuote}>
              post
            </Button>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}
