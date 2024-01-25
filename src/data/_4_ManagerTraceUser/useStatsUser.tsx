import { IStats } from "../stats";
import ManagerTraceUser from "./ManagerTraceUser";
import { useEffect, useState } from "react";

export default function useStatsUser() {
  const managerTraceUser = ManagerTraceUser;
  const [statsUser, setStatsUser] = useState<IStats | null>(null);

  useEffect(() => {
    const listener = managerTraceUser.addListenerStatsUser(
      (statsUser: IStats | null) => {
        setStatsUser(statsUser);
      }
    );
  });

  return statsUser;
}
