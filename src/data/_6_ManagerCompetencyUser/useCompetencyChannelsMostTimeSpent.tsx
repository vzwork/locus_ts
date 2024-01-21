import { useEffect, useState } from "react";
import ManagerCompetencyUser from "./ManagerCompetencyUser";
import { ICompetency } from "../competency";

export default function useCompetencyChannelsMostTimeSpent() {
  const managerCompetencyUser = ManagerCompetencyUser;
  const [competencyChannelsMostTimeSpent, setCompetencyChannelsMostTimeSpent] =
    useState<ICompetency[]>([]);

  useEffect(() => {
    const listener =
      managerCompetencyUser.addListenerCompetencyChannelsMostTimeSpent(
        (value) => {
          setCompetencyChannelsMostTimeSpent(value);
        }
      );

    return () => {
      managerCompetencyUser.removeListenerCompetencyChannelsMostTimeSpent(
        listener
      );
    };
  }, []);

  return competencyChannelsMostTimeSpent;
}
