import {
  getFirestore,
  Firestore,
  setDoc,
  doc,
  query,
  collection,
  where,
  onSnapshot,
  updateDoc,
  arrayUnion,
  getDoc,
} from "firebase/firestore";
import ManagerAccount from "../_1_ManagerAccount/ManagerAccount";
import { IAccount } from "../account";
import { IMessage, IOrganizationChats } from "../chat";
import { stateCollections } from "../db";

const VERSION_ORGANIZATION_CHATS = "1.0.0";
const VERSION_MESSAGE = "1.0.0";

const TEMPLATE_ORGANIZATION_CHATS: IOrganizationChats = {
  version: VERSION_ORGANIZATION_CHATS,
  idUser: "",
  idsChatsNewMessages: [],
  idsChats: [],
  idsRequestsChats: [],
};

class ManagerChats {
  private static instance: ManagerChats;
  private db: Firestore | null = null;
  private account: IAccount | null = null;
  private organizationChats: IOrganizationChats | null = null;
  private activeMessages: IMessage[] = [];

  // state
  private idChatCurrent: string | null = null;
  private listenersOrganizationChats: ((
    organizationChats: IOrganizationChats
  ) => void)[] = [];
  private listenersActiveChat: ((messages: IMessage[]) => void)[] = [];

  private constructor() {
    // Private constructor to prevent instantiation
  }

  public static getInstance(): ManagerChats {
    if (!ManagerChats.instance) {
      ManagerChats.instance = new ManagerChats();
    }
    return ManagerChats.instance;
  }

  public init() {
    this.db = getFirestore();

    const managerAccount = ManagerAccount;
    managerAccount.addListenerAccount(async (account: IAccount | null) => {
      this.account = account;
      if (!account) return;
      if (!this.db) return;

      await this.checkOrganizationChatsExists(account.id);
      // listen to doc
      onSnapshot(
        doc(this.db, stateCollections.organizationChats, account.id),
        (doc) => {
          const organizationChats = doc.data() as IOrganizationChats;
          this.organizationChats = organizationChats;
          this.notifyListenersOrganizationChats();
          if (this.idChatCurrent) {
            this.setChatCurrent(this.idChatCurrent);
          }
        }
      );
    });
  }

  private async checkOrganizationChatsExists(idUser: string) {
    if (!this.db) return;
    // get doc
    const organizationChats = await getDoc(
      doc(this.db, stateCollections.organizationChats, idUser)
    );
    // set doc
    if (!organizationChats.exists()) {
      TEMPLATE_ORGANIZATION_CHATS.idUser = idUser;
      await setDoc(
        doc(this.db, stateCollections.organizationChats, idUser),
        TEMPLATE_ORGANIZATION_CHATS
      );
    }
  }

  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
  // user actions
  public async setChatCurrent(idChat: string) {
    this.idChatCurrent = idChat;

    if (!this.db) return;
    if (!this.account) return;

    onSnapshot(
      doc(this.db, stateCollections.messages, idChat),
      (doc) => {
        const messages = doc.data()?.messages as IMessage[];
        this.activeMessages = messages;
        this.notifyListenersActiveChat();
      },
      (error) => {
        console.error(error);
      }
    );
  }

  public async sendMessage(idChat: string, message: string) {
    if (!this.account) return;
    if (!this.db) return;

    const messageChat: IMessage = {
      version: VERSION_MESSAGE,
      idUser: this.account.id,
      message,
      timestampCreated: Date.now(),
      timestampUpdated: Date.now(),
    };

    // check document exists in the collection
    const docSnap = await getDoc(
      doc(this.db, stateCollections.messages, idChat)
    );
    if (!docSnap.exists()) {
      await setDoc(doc(this.db, stateCollections.messages, idChat), {
        messages: [messageChat],
      });
    } else {
      updateDoc(doc(this.db, stateCollections.messages, idChat), {
        messages: arrayUnion(messageChat),
      });
    }
  }

  public async createChat(idUserTarget: string) {
    if (!this.db) return;
    if (!this.account) return;
    await this.checkOrganizationChatsExists(idUserTarget);

    const idUserA =
      this.account.id.localeCompare(idUserTarget) < 0
        ? this.account.id
        : idUserTarget;
    const idUserB =
      this.account.id.localeCompare(idUserTarget) < 0
        ? idUserTarget
        : this.account.id;
    const idChat = idUserA + idUserB;

    // update this users chats
    await updateDoc(
      doc(this.db, stateCollections.organizationChats, this.account.id),
      {
        idsChats: arrayUnion(idChat),
      }
    );

    // check if chat exists
    const docSnap = await getDoc(
      doc(this.db, stateCollections.organizationChats, idUserTarget)
    );
    const organizationChatsOtherUser = docSnap.data() as IOrganizationChats;
    if (organizationChatsOtherUser.idsChats.includes(idChat)) return;
    if (organizationChatsOtherUser.idsRequestsChats.includes(idChat)) return;

    // update other users requests chats
    await updateDoc(
      doc(this.db, stateCollections.organizationChats, idUserTarget),
      {
        idsRequestsChats: arrayUnion(idChat),
      }
    );
  }
  // user actions
  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
  // state active chat
  private notifyListenersActiveChat() {
    this.listenersActiveChat.forEach((l) => {
      l(this.activeMessages);
    });
  }

  public addListenerActiveChat(
    listener: (messages: IMessage[]) => void
  ): (messages: IMessage[]) => void {
    this.listenersActiveChat.push(listener);

    if (this.activeMessages) {
      listener(this.activeMessages);
    }

    return listener;
  }

  public removeListenerActiveChat(listener: (messages: IMessage[]) => void) {
    this.listenersActiveChat = this.listenersActiveChat.filter(
      (l) => l !== listener
    );
  }
  // state active chat
  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
  // state organization chats
  private notifyListenersOrganizationChats() {
    this.listenersOrganizationChats.forEach((l) => {
      if (this.organizationChats) {
        l(this.organizationChats);
      }
    });
  }

  public addListenerOrganizationChats(
    listener: (organizationChats: IOrganizationChats) => void
  ): (organizationChats: IOrganizationChats) => void {
    this.listenersOrganizationChats.push(listener);

    if (this.organizationChats) {
      listener(this.organizationChats);
    }

    return listener;
  }

  public removeListenerOrganizationChats(
    listener: (organizationChats: IOrganizationChats) => void
  ) {
    this.listenersOrganizationChats = this.listenersOrganizationChats.filter(
      (l) => l !== listener
    );
  }
  // state organization chats
  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
}

export default ManagerChats.getInstance();
