import {
  Firestore,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { IChannel } from "../channel";
import { idRoot, stateCollections } from "../db";

class ManagerChannels {
  private static instance: ManagerChannels;
  private db: Firestore | null = null;

  // channel current
  private idChannelCurrent: string | null = null;
  private channelCurrent: IChannel | null = null;
  private listenersChannelCurrent: ((channel: IChannel) => void)[] = [];

  // channel parent
  private channelParent: IChannel | null = null;
  private listenersChannelParent: ((channel: IChannel) => void)[] = [];

  // channel grand parent
  private channelGrandParent: IChannel | null = null;
  private listenersChannelGrandParent: ((channel: IChannel) => void)[] = [];

  // channels current children
  private channelCurrentChildren: IChannel[] = [];
  private listenersChannelCurrentChildren: ((channels: IChannel[]) => void)[] =
    [];

  // channels parent children
  private channelParentChildren: IChannel[] = [];
  private listenersChannelParentChildren: ((channels: IChannel[]) => void)[] =
    [];

  private constructor() {
    // Initialize the manager
  }

  public static getInstance(): ManagerChannels {
    if (!ManagerChannels.instance) {
      ManagerChannels.instance = new ManagerChannels();
    }
    return ManagerChannels.instance;
  }

  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
  // init
  public init() {
    this.db = getFirestore();
  }
  // init
  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
  // actions
  public async removeChannelCurrent() {
    if (!this.db) return;
    if (!this.channelCurrent) return;
    if (this.channelCurrent.id === idRoot) return;
    if (this.channelCurrent.idsChildren.length > 0) return;

    await updateDoc(
      doc(this.db, stateCollections.channels, this.channelCurrent.idParent),
      {
        idsChildren: arrayRemove(this.channelCurrent.id),
      }
    ).catch((error) => {
      console.log(error.message);
    });

    await deleteDoc(
      doc(this.db, stateCollections.channels, this.channelCurrent.id)
    ).catch((error) => {
      console.log(error.message);
    });

    this.setChannelCurrent(this.channelCurrent.idParent);
  }

  public addChannel(name: string, idCreator: string, nameCreator: string) {
    if (!this.db) return;
    if (!this.channelCurrent) return;

    const channel: IChannel = {
      version: "1.0.1",
      id: "",
      idParent: this.channelCurrent.id,
      idsChildren: [],
      name: name,
      idCreator,
      nameCreator,
      timestampCreation: Date.now(),
      statistics: {
        countPostsDay: 0,
        countPostsWeek: 0,
        countPostsMonth: 0,
        countPostsYear: 0,
        countPostsAll: 0,
        countViewsDay: 0,
        countViewsWeek: 0,
        countViewsMonth: 0,
        countViewsYear: 0,
        countViewsAll: 0,
      },
      statisticsSystem: {
        queueCountPosts: [],
        queuePostsTrigger: false,
        timestampQueuePostsNextWorkload: Date.now(),
        queueCountViews: [],
        queueViewsTrigger: false,
        timestampQueueViewsNextWorkload: Date.now(),
      },
    };

    const docRef = doc(collection(this.db, stateCollections.channels));
    channel.id = docRef.id;

    setDoc(docRef, channel).catch((error) => {
      console.log(error.message);
    });

    updateDoc(doc(this.db, stateCollections.channels, channel.idParent), {
      idsChildren: arrayUnion(channel.id),
    }).catch((error) => {
      console.log(error.message);
    });

    this.setChannelCurrentForce(channel.idParent);
  }

  public async setChannelCurrent(id: string) {
    if (this.idChannelCurrent === id) return;
    this.setChannelCurrentForce(id);
  }

  public async setChannelCurrentForce(id: string) {
    if (!id) return;
    this.idChannelCurrent = id;

    const channelCurrent: any = await this.getChannel(id);
    if (!channelCurrent) return;
    this.channelCurrent = channelCurrent;
    this.notifyListenersChannelCurrent();

    const channelParent = await this.getChannelOptimized(
      channelCurrent?.idParent || ""
    );
    if (!channelParent) return;
    this.channelParent = channelParent;
    this.notifyListenersChannelParent();

    const channelGrandParent = await this.getChannelOptimized(
      channelParent?.idParent || ""
    );
    if (channelGrandParent) {
      this.channelGrandParent = channelGrandParent;
      this.notifyListenersChannelGrandParent();
    }

    const channelCurrentChildren: IChannel[] = [];
    for (const idChild of channelCurrent?.idsChildren || []) {
      const channelChild = await this.getChannelOptimized(idChild);
      if (channelChild) {
        channelCurrentChildren.push(channelChild);
      }
    }
    this.channelCurrentChildren = channelCurrentChildren;
    this.notifyListenersChannelChildren();

    let channelParentChildren: IChannel[] = [];
    for (const idChild of channelParent?.idsChildren || []) {
      const channelChild = await this.getChannelOptimized(idChild);
      if (channelChild) {
        channelParentChildren.push(channelChild);
      }
    }
    if (channelParent?.id === channelCurrent?.id && channelCurrent) {
      channelParentChildren = [channelCurrent];
    }

    this.channelParentChildren = channelParentChildren;
    this.notifyListenersChannelParentChildren();
  }

  private async getChannelOptimized(id: string): Promise<IChannel | undefined> {
    // check local storage
    // if found and not expired, return
    // else, check firestore
    if (!id) return undefined;

    const stringDateUpdated = localStorage.getItem(
      `channel-${id}-date-updated`
    );
    if (stringDateUpdated) {
      const dateUpdated = Number(stringDateUpdated);
      if (Date.now() - dateUpdated < 1000 * 60 * 60 * 24 * 7) {
        const channel = localStorage.getItem(`channel-${id}`);
        if (channel) {
          return JSON.parse(channel) as IChannel;
        }
      }
    }

    return await this.getChannel(id);
  }

  private async getChannel(id: string): Promise<IChannel | undefined> {
    if (!id) return undefined;
    if (!this.db) return undefined;

    const docSnap = await getDoc(doc(this.db, stateCollections.channels, id));

    if (docSnap.exists()) {
      const channel = docSnap.data() as IChannel;
      localStorage.setItem(`channel-${id}`, JSON.stringify(channel));
      localStorage.setItem(`channel-${id}-date-updated`, Date.now().toString());
      if (channel) {
        return channel;
      }
    }
  }
  // actions
  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
  // state channelCurrent
  private notifyListenersChannelCurrent() {
    this.listenersChannelCurrent.forEach((listener) => {
      if (this.channelCurrent) {
        listener(this.channelCurrent);
      }
    });
  }

  public addListenerChannelCurrent(
    listener: (channel: IChannel) => void
  ): (channel: IChannel) => void {
    this.listenersChannelCurrent.push(listener);

    if (this.channelCurrent) {
      listener(this.channelCurrent);
    }

    return listener;
  }

  public removeListenerChannelCurrent(listener: (channel: IChannel) => void) {
    this.listenersChannelCurrent = this.listenersChannelCurrent.filter(
      (l) => l !== listener
    );
  }
  // state channelCurrent
  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
  // state channelParent
  private notifyListenersChannelParent() {
    this.listenersChannelParent.forEach((listener) => {
      if (this.channelParent) {
        listener(this.channelParent);
      }
    });
  }

  public addListenerChannelParent(
    listener: (channel: IChannel) => void
  ): (channel: IChannel) => void {
    this.listenersChannelParent.push(listener);

    if (this.channelParent) {
      listener(this.channelParent);
    }

    return listener;
  }

  public removeListenerChannelParent(listener: (channel: IChannel) => void) {
    this.listenersChannelParent = this.listenersChannelParent.filter(
      (l) => l !== listener
    );
  }
  // state channelParent
  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
  // state channelGrandParent
  private notifyListenersChannelGrandParent() {
    this.listenersChannelGrandParent.forEach((listener) => {
      if (this.channelGrandParent) {
        listener(this.channelGrandParent);
      }
    });
  }

  public addListenerChannelGrandParent(
    listener: (channel: IChannel) => void
  ): (channel: IChannel) => void {
    this.listenersChannelGrandParent.push(listener);

    if (this.channelGrandParent) {
      listener(this.channelGrandParent);
    }

    return listener;
  }

  public removeListenerChannelGrandParent(
    listener: (channel: IChannel) => void
  ) {
    this.listenersChannelGrandParent = this.listenersChannelGrandParent.filter(
      (l) => l !== listener
    );
  }
  // state channelGrandParent
  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
  // state channelCurrentChildren
  private notifyListenersChannelChildren() {
    this.listenersChannelCurrentChildren.forEach((listener) => {
      listener(this.channelCurrentChildren);
    });
  }
  public addListenerChannelCurrentChildren(
    listener: (channels: IChannel[]) => void
  ): (channels: IChannel[]) => void {
    this.listenersChannelCurrentChildren.push(listener);

    listener(this.channelCurrentChildren);

    return listener;
  }
  public removeListenerChannelCurrentChildren(
    listener: (channels: IChannel[]) => void
  ) {
    this.listenersChannelCurrentChildren =
      this.listenersChannelCurrentChildren.filter((l) => l !== listener);
  }
  // state channelCurrentChildren
  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
  // state channelParentChildren
  private notifyListenersChannelParentChildren() {
    this.listenersChannelParentChildren.forEach((listener) => {
      listener(this.channelParentChildren);
    });
  }
  public addListenerChannelParentChildren(
    listener: (channels: IChannel[]) => void
  ): (channels: IChannel[]) => void {
    this.listenersChannelParentChildren.push(listener);

    listener(this.channelParentChildren);

    return listener;
  }
  public removeListenerChannelParentChildren(
    listener: (channels: IChannel[]) => void
  ) {
    this.listenersChannelParentChildren =
      this.listenersChannelParentChildren.filter((l) => l !== listener);
  }
  // state channelParentChildren
  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
}

export default ManagerChannels.getInstance();
