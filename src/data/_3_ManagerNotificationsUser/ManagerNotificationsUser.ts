import {
  Firestore,
  arrayUnion,
  doc,
  getFirestore,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { INotifaction } from "../notification";
import { IAccount } from "../account";
import ManagerAccount from "../_1_ManagerAccount/ManagerAccount";
import { stateCollections } from "../db";
import { IPost } from "../post";

class ManagerNotificationsUser {
  private static instance: ManagerNotificationsUser;

  // db
  private db: Firestore | null = null;
  private account: IAccount | null = null;
  private subscriber: null = null;

  // state
  private listenersNotifactions: ((notifications: INotifaction[]) => void)[] =
    [];
  private notifications: INotifaction[] = [];

  private constructor() {
    // Private constructor to prevent instantiation from outside
  }

  public static getInstance(): ManagerNotificationsUser {
    if (!ManagerNotificationsUser.instance) {
      ManagerNotificationsUser.instance = new ManagerNotificationsUser();
    }
    return ManagerNotificationsUser.instance;
  }

  public init() {
    this.db = getFirestore();
    const managerAccount = ManagerAccount;
    managerAccount.addListenerAccount((account) => {
      this.account = account;
      if (!account) {
        this.notifications = [];
        this.notifyListenersNotifactions();
      } else {
        if (!this.db) return;
        onSnapshot(
          doc(this.db, stateCollections.notifications, account.id),
          (docSnapshot) => {
            if (!docSnapshot.exists()) {
              this.notifications = [];
              this.notifyListenersNotifactions();
              if (!this.db) return;
              setDoc(doc(this.db, stateCollections.notifications, account.id), {
                notifications: [],
              });
              return;
            }
            const data = docSnapshot.data();
            if (!data) {
              this.notifications = [];
              this.notifyListenersNotifactions();
              return;
            }
            const notifications = data.notifications as INotifaction[];
            this.notifications = notifications;
            this.notifyListenersNotifactions();
          }
        );
      }
    });
  }

  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
  // actions
  public addNotificationComment(post: IPost, text: string) {
    if (!this.account) return;
    if (!this.db) return;
    const newNotification = {
      idSender: this.account.id,
      usernameSender: this.account.username,
      urlAvatarSender: this.account.urlAvatar,
      typeContnet: post.type,
      typeNotification: "comment",
    } as INotifaction;
    updateDoc(doc(this.db, stateCollections.notifications, post.idCreator), {
      notifications: arrayUnion(newNotification),
    });
  }
  // actions
  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
  // state notifications
  private notifyListenersNotifactions() {
    this.listenersNotifactions.forEach((l) => l(this.notifications));
  }

  public addListenerNotifactions(
    listener: (notifications: INotifaction[]) => void
  ): (notification: INotifaction[]) => void {
    this.listenersNotifactions.push(listener);

    listener(this.notifications);

    return listener;
  }

  public removeListenerNotifactions(
    listener: (notifications: INotifaction[]) => void
  ) {
    this.listenersNotifactions = this.listenersNotifactions.filter(
      (l) => l !== listener
    );
  }
  // state notifications
  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
}

export default ManagerNotificationsUser.getInstance();
