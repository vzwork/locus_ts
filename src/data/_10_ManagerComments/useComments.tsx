import { useEffect, useState } from "react";
import ManagerComments from "./ManagerComments";
import { ICommentBuilt } from "../comment";

export default function useComments(idPost: string, idInstance: string) {
  const managerComments = ManagerComments;
  const [comments, setComments] = useState<ICommentBuilt[]>([]);

  useEffect(() => {
    const listener = managerComments.addListenerComments(idPost, (comments) => {
      setComments(comments);
    });

    return () => {
      managerComments.removeListenerComments(idPost, listener);
    };
  }, [idPost, idInstance]);

  return comments;
}
