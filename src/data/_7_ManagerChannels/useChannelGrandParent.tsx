import { useEffect, useState } from "react";
import ManagerChannels from "./ManagerChannels";
import { IChannel } from "../channel";

export default function useChannelGrandParent() {
  const managerChannels = ManagerChannels;
  const [channelGrandParent, setChannelGrandParent] = useState<IChannel | null>(
    null
  );

  useEffect(() => {
    const listener = managerChannels.addListenerChannelGrandParent(
      (channel: IChannel) => {
        setChannelGrandParent(channel);
      }
    );
    return () => {
      managerChannels.removeListenerChannelGrandParent(listener);
    };
  });

  return channelGrandParent;
}
