import { useEffect, useState } from "react";
import ManagerChannels from "./ManagerChannels";
import { IChannel } from "../channel";

export default function useChannelParentChildren() {
  const managerChannels = ManagerChannels;
  const [channelParentChildren, setChannelParentChildren] = useState<
    IChannel[]
  >([]);

  useEffect(() => {
    const listener = managerChannels.addListenerChannelParentChildren(
      (channels: IChannel[]) => {
        setChannelParentChildren(channels);
      }
    );
    return () => {
      managerChannels.removeListenerChannelParentChildren(listener);
    };
  });

  return channelParentChildren;
}
