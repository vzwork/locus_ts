import {
  Firestore,
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
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
import { IComment } from "../comment";

const VERSION_NOTIFICATION = "1.0.0";

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
  public async addNotificationComment(post: IPost, comment: IComment) {
    if (!this.account) return;
    if (this.account.id === post.idCreator) return;
    if (!this.db) return;
    const newNotification: INotifaction = {
      version: VERSION_NOTIFICATION,
      idSender: this.account.id,
      idPost: post.id,
      idChannelOrigin: post.navigation.idChannelOrigin,
      idComment: comment.id,
      textComment: comment.text,
      usernameSender: this.account.username,
      urlAvatarSender: this.account.urlAvatar ?? "",
      typeContnet: post.type,
      typeNotification: "comment",
    };
    const docCheck = await getDoc(
      doc(this.db, stateCollections.notifications, post.idCreator)
    ).catch((error) => {
      console.log(error.message);
    });
    if (!docCheck) return;
    if (!docCheck.exists()) {
      setDoc(doc(this.db, stateCollections.notifications, post.idCreator), {
        notifications: [newNotification],
      });
      return;
    } else {
      updateDoc(doc(this.db, stateCollections.notifications, post.idCreator), {
        notifications: arrayUnion(newNotification),
      });
    }
  }

  public deleteNotification(notification: INotifaction) {
    if (!this.account) return;
    if (!this.db) return;
    const notifications = this.notifications.filter((n) => n !== notification);
    this.notifications = notifications;
    updateDoc(doc(this.db, stateCollections.notifications, this.account.id), {
      notifications: arrayRemove(notification),
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
