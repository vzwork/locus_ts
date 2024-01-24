import { useEffect, useState } from "react";
import { IMessage } from "../chat";
import ManagerChats from "./ManagerChats";

export default function useActiveChat() {
  const managerChats = ManagerChats;
  const [activeChat, setActiveChat] = useState<IMessage[]>([]);

  useEffect(() => {
    const listener = managerChats.addListenerActiveChat((activeChat) => {
      setActiveChat(activeChat);
    });

    return () => {
      managerChats.removeListenerActiveChat(listener);
    };
  });

  return activeChat;
}
