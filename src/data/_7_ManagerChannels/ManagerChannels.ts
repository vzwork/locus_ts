import { Firestore, doc, getDoc, getFirestore } from "firebase/firestore";
import { IChannel } from "../channel";
import { stateCollections } from "../db";

class ManagerChannels {
  private static instance: ManagerChannels;
  private db: Firestore | null = null;

  // channel current
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
  public async setChannelCurrent(id: string) {
    const channelCurrent = await this.getChannel(id);
    if (channelCurrent) {
      this.channelCurrent = channelCurrent;
      this.notifyListenersChannelCurrent();
    }

    const channelParent = await this.getChannel(channelCurrent?.idParent || "");
    if (channelParent) {
      this.channelParent = channelParent;
      this.notifyListenersChannelParent();
    }

    const channelGrandParent = await this.getChannel(
      channelParent?.idParent || ""
    );
    if (channelGrandParent) {
      this.channelGrandParent = channelGrandParent;
      this.notifyListenersChannelGrandParent();
    }

    const channelCurrentChildren: IChannel[] = [];
    for (const idChild of channelCurrent?.idsChildren || []) {
      const channelChild = await this.getChannel(idChild);
      if (channelChild) {
        channelCurrentChildren.push(channelChild);
      }
    }
    this.channelCurrentChildren = channelCurrentChildren;
    this.notifyListenersChannelChildren();

    const channelParentChildren: IChannel[] = [];
    for (const idChild of channelParent?.idsChildren || []) {
      const channelChild = await this.getChannel(idChild);
      if (channelChild) {
        channelParentChildren.push(channelChild);
      }
    }
    this.channelParentChildren = channelParentChildren;
    this.notifyListenersChannelParentChildren();
  }

  private async getChannel(id: string): Promise<IChannel | undefined> {
    // check local storage
    // if found and not expired, return
    // else, check firestore
    const stringDateUpdated = localStorage.getItem(
      `channel-${id}-date-updated`
    );
    if (stringDateUpdated) {
      const dateUpdated = Number(stringDateUpdated);
      if (Date.now() - dateUpdated < 1000 * 60 * 60 * 24) {
        const channel = localStorage.getItem(`channel-${id}`);
        if (channel) {
          return JSON.parse(channel);
        }
      }
    }

    if (!this.db) return undefined;

    await getDoc(doc(this.db, stateCollections.channels, id)).then(
      (docSnap) => {
        if (docSnap.exists()) {
          const channel = docSnap.data();
          if (channel) {
            localStorage.setItem(`channel-${id}`, JSON.stringify(channel));
            localStorage.setItem(
              `channel-${id}-date-updated`,
              Date.now().toString()
            );
            return channel;
          }
        }
      }
    );
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
