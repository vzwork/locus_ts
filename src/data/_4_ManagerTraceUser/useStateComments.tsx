import { useEffect, useState } from "react";
import ManagerTraceUser from "./ManagerTraceUser";

export default function useStateComments() {
  const managerTraceUser = ManagerTraceUser;
  const [comments, setComments] = useState<Set<string>>();

  useEffect(() => {
    const listener = managerTraceUser.addListenerComments(
      (comments: Set<string>) => {
        setComments(comments);
      }
    );

    return () => {
      managerTraceUser.removeListenerComments(listener);
    };
  });

  return comments;
}
