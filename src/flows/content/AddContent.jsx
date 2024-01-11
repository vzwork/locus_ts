import { Box, Button, Dialog, DialogTitle, IconButton } from "@mui/material";

import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
// import PhotoCameraFrontIcon from "@mui/icons-material/PhotoCameraFront";
import ClearIcon from "@mui/icons-material/Clear";

import AddQuote from "./AddQuote";
import AddArticle from "./AddArticle";
import AddPhoto from "./AddPhoto";
import AddVideo from "./AddVideo";
import { useState } from "react";

export default function AddContent({ addContent, setAddContent }) {
  const [addQuote, setAddQuote] = useState(false);
  const [addArticle, setAddArticle] = useState(false);
  const [addPhoto, setAddPhoto] = useState(false);
  const [addVideo, setAddVideo] = useState(false);

  return (
    <>
      <AddQuote
        addQuote={addQuote}
        setAddQuote={setAddQuote}
        setAddContent={setAddContent}
      />
      <AddArticle
        addArticle={addArticle}
        setAddArticle={setAddArticle}
        setAddContent={setAddContent}
      />
      <AddPhoto
        addPhoto={addPhoto}
        setAddPhoto={setAddPhoto}
        setAddContent={setAddContent}
      />
      <AddVideo
        addVideo={addVideo}
        setAddVideo={setAddVideo}
        setAddContent={setAddContent}
      />
      <Dialog
        onClose={() => {
          setAddContent(false);
        }}
        open={addContent}
      >
        <DialogTitle
          sx={{ display: "flex", gap: "1rem", alignItems: "center" }}
        >
          Select the type of content:
          <IconButton color="primary" onClick={() => setAddContent(false)}>
            <ClearIcon />
          </IconButton>
        </DialogTitle>

        <Box
          sx={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          p="1rem"
        >
          <Button
            fullWidth
            variant="outlined"
            startIcon={<FormatQuoteIcon />}
            onClick={() => {
              setAddQuote(true);
              setAddContent(false);
            }}
          >
            quote
          </Button>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<NewspaperIcon />}
            onClick={() => {
              setAddArticle(true);
              setAddContent(false);
            }}
          >
            article
          </Button>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<PhotoCameraIcon />}
            onClick={() => {
              setAddPhoto(true);
              setAddContent(false);
            }}
          >
            photo
          </Button>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<OndemandVideoIcon />}
            onClick={() => {
              setAddVideo(true);
              setAddContent(false);
            }}
          >
            video
          </Button>
        </Box>
      </Dialog>
    </>
  );
}
