import { useEffect, useState } from "react";
import ManagerChannels from "./ManagerChannels";
import { IChannel } from "../channel";

export default function useChannelParent() {
  const managerChannels = ManagerChannels;
  const [channelParent, setChannelParent] = useState<IChannel | null>(null);

  useEffect(() => {
    const listener = managerChannels.addListenerChannelParent(
      (channel: IChannel) => {
        setChannelParent(channel);
      }
    );
    return () => {
      managerChannels.removeListenerChannelParent(listener);
    };
  });

  return channelParent;
}
