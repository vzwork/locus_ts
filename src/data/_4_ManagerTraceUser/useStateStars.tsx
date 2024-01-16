import { useEffect, useState } from "react";
import ManagerTraceUser from "./ManagerTraceUser";

export default function useStateStars() {
  const managerTraceUser = ManagerTraceUser;
  const [stars, setStars] = useState<Set<string>>();

  useEffect(() => {
    const listener = managerTraceUser.addListenerStars((stars: Set<string>) => {
      setStars(stars);
    });

    return () => {
      managerTraceUser.removeListenerStars(listener);
    };
  });

  return stars;
}
