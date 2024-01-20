import { Box, Dialog } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import usePosts from "../data/_9_ManagerContent/usePosts";
import { useEffect, useState } from "react";
import Post from "../components/Post/Post";
import { IPost } from "../data/post";

export default function Posts() {
  const params = useParams();
  const navigate = useNavigate();
  const posts = usePosts();

  const [post, setPost] = useState<IPost | null>(null);

  useEffect(() => {
    if (posts) {
      const post = posts.find((post) => post.id === params.idPost);
      if (post) {
        setPost(post);
      }
    }
  }, [posts]);

  return (
    <>
      <></>
      <></>
      <Dialog
        open={true}
        onClose={() => {
          navigate(`/channels/${params.idChannel}`);
        }}
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              width: "100%",
              maxWidth: "min(90vw, 1080px)", // Set your width here
            },
          },
        }}
      >
        <Box sx={{ width: "min(90vw, 1080px)" }}>
          {post ? (
            <Post post={post} propExpanded={true} propOpenComments={true} />
          ) : null}
          <></>
        </Box>
      </Dialog>
    </>
  );
}
