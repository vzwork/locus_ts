import { useEffect, useState } from "react";
import { IOrganizationChats } from "../chat";
import ManagerChats from "./ManagerChats";

export default function useOrganizationChats() {
  const managerChats = ManagerChats;
  const [organizationChats, setOrganizationChats] =
    useState<IOrganizationChats | null>(null);

  useEffect(() => {
    const listener = managerChats.addListenerOrganizationChats(
      (organizationChats) => {
        setOrganizationChats(organizationChats);
      }
    );

    return () => {
      managerChats.removeListenerOrganizationChats(listener);
    };
  });

  return organizationChats;
}
