import { useEffect, useState } from "react";
import ManagerContent from "./ManagerContent";
import { IPost } from "../post";

export default function usePosts() {
  const managerContent = ManagerContent;
  const [posts, setPosts] = useState<IPost[]>([]);

  useEffect(() => {
    const listener = managerContent.addListenerContent((content: IPost[]) => {
      setPosts(content);
    });

    return () => {
      managerContent.removeListenerContent(listener);
    };
  }, []);

  return posts;
}
