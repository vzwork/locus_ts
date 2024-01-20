import { useEffect, useState } from "react";
import { INotifaction } from "../notification";
import ManagerNotificationsUser from "./ManagerNotificationsUser";

export default function useNotifications() {
  const managerNotificationsUser = ManagerNotificationsUser;
  const [notifications, setNotifications] = useState<INotifaction[]>([]);

  useEffect(() => {
    const listener = managerNotificationsUser.addListenerNotifactions(
      (notifications: INotifaction[]) => {
        setNotifications(notifications);
      }
    );

    return () => {
      managerNotificationsUser.addListenerNotifactions(listener);
    };
  }, []);

  return notifications;
}
