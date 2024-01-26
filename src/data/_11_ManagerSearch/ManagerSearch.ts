// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
// connect to manager channels
// subscribe to all available channels
// keep a local list of all channels
// have a state with all channels and their names
// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

import {
  Firestore,
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import ManagerChannels from "../_7_ManagerChannels/ManagerChannels";
import { IChannel } from "../channel";
import { IReferenceChannel } from "../referenceChannel";
import { stateCollections } from "../db";

class ManagerSearch {
  private static instance: ManagerSearch;
  private db: Firestore | null = null;
  private referencesChannels: IReferenceChannel[] = [];
  private listenersReferencesChannels: Array<
    (referencesChannels: IReferenceChannel[]) => void
  > = [];
  private setIdsChannels: Set<string> = new Set();

  private constructor() {
    // Private constructor to prevent instantiation
  }

  public static getInstance(): ManagerSearch {
    if (!ManagerSearch.instance) {
      ManagerSearch.instance = new ManagerSearch();
    }
    return ManagerSearch.instance;
  }

  public async init() {
    const managerChannels = ManagerChannels;

    this.db = getFirestore();

    // load local storage
    const referencesChannels = localStorage.getItem("referencesChannels");
    if (referencesChannels) {
      this.referencesChannels = JSON.parse(referencesChannels);
    }

    managerChannels.addListenerChannelCurrent((channel: IChannel) => {
      if (channel) {
        this.addReferenceChannel(channel.name, channel.id);
      }
    });
    managerChannels.addListenerChannelParent((channel: IChannel) => {
      if (channel) {
        this.addReferenceChannel(channel.name, channel.id);
      }
    });
    managerChannels.addListenerChannelGrandParent((channel: IChannel) => {
      if (channel) {
        this.addReferenceChannel(channel.name, channel.id);
      }
    });
    managerChannels.addListenerChannelCurrentChildren(
      (channels: IChannel[]) => {
        channels.forEach((channel) => {
          this.addReferenceChannel(channel.name, channel.id);
        });
      }
    );
    managerChannels.addListenerChannelParentChildren((channels: IChannel[]) => {
      channels.forEach((channel) => {
        this.addReferenceChannel(channel.name, channel.id);
      });
    });
  }

  private addReferenceChannel(name: string, id: string) {
    if (this.setIdsChannels.has(id)) return;
    this.setIdsChannels.add(id);
    this.referencesChannels.push({
      id: id,
      name: name,
      timestampUpdated: Date.now(),
    });

    // update local storage
    localStorage.setItem(
      "referencesChannels",
      JSON.stringify(this.referencesChannels)
    );

    this.notifyListenersReferencesChannels();
  }

  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
  // actions
  public async searchChannelsByName(name: string) {
    if (!this.db) return;

    name = name.toLocaleLowerCase();

    const q = query(
      collection(this.db, stateCollections.channels),
      where("name", "==", name)
    );
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      const channel = doc.data() as IChannel;
      this.addReferenceChannel(channel.name, channel.id);
    });
  }
  // actions
  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
  // state
  private notifyListenersReferencesChannels() {
    this.listenersReferencesChannels.forEach((listener) =>
      listener(this.referencesChannels)
    );
  }

  public addListenerReferencesChannels(
    listener: (referencesChannels: IReferenceChannel[]) => void
  ): (referencesChannels: IReferenceChannel[]) => void {
    this.listenersReferencesChannels.push(listener);

    listener(this.referencesChannels);

    return listener;
  }

  public removeListenerReferencesChannels(
    listener: (referencesChannels: IReferenceChannel[]) => void
  ) {
    this.listenersReferencesChannels = this.listenersReferencesChannels.filter(
      (l) => l !== listener
    );
  }
  // state
  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
}

export default ManagerSearch.getInstance();
