import { useEffect, useState } from "react";
import ManagerChannels from "./ManagerChannels";
import { IChannel } from "../channel";

export default function useChannelCurrent() {
  const managerChannels = ManagerChannels;
  const [channelCurrent, setChannelCurrent] = useState<IChannel | null>(null);

  useEffect(() => {
    const listener = managerChannels.addListenerChannelCurrent(
      (channel: IChannel) => {
        setChannelCurrent(channel);
      }
    );
    return () => {
      managerChannels.removeListenerChannelCurrent(listener);
    };
  });

  return channelCurrent;
}
