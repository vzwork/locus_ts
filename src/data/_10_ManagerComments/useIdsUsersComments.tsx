import { useEffect, useState } from "react";
import ManagerComments from "./ManagerComments";
import { ICommentBuilt } from "../comment";

export default function useIdsUsersComments(id: string) {
  const managerComments = ManagerComments;
  const [ids, setIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const listener = managerComments.addListenerIdsUsersComments(
      id,
      (ids: Set<string>) => {
        setIds(ids);
      }
    );

    return () => {
      managerComments.removeListenerIdsUsersComments(id, listener);
    };
  }, [id]);

  return ids;
}
