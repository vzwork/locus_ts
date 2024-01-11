import { useEffect, useState } from "react";
import ManagerChannels from "./ManagerChannels";
import { IChannel } from "../channel";

export default function useChannelCurrentChildren() {
  const managerChannels = ManagerChannels;
  const [channelCurrentChildren, setChannelCurrentChildren] = useState<
    IChannel[]
  >([]);

  useEffect(() => {
    const listener = managerChannels.addListenerChannelCurrentChildren(
      (channels: IChannel[]) => {
        setChannelCurrentChildren(channels);
      }
    );
    return () => {
      managerChannels.removeListenerChannelCurrentChildren(listener);
    };
  });

  return channelCurrentChildren;
}
