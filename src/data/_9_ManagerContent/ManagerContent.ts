import {
  Firestore,
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { QueryOrder, QueryTimeframe } from "../query";
import { stateCollections } from "../db";
import { IChannel } from "../channel";
import ManagerChannels from "../_7_ManagerChannels/ManagerChannels";
import ManagerPosts from "../_10_ManagerPosts/ManagerPosts";
import { IPost } from "../post";
import { types } from "util";

class ManagerContent {
  private static instance: ManagerContent;

  // database
  private managerChannels: typeof ManagerChannels | null = null;
  private managerPosts: typeof ManagerPosts | null = null;
  private channelCurrent: IChannel | null = null;
  private db: Firestore | null = null;

  // state
  private listenersContent: ((ids: string[]) => void)[] = [];
  private ids: string[] = [];

  // content
  private typesContentActive: string[] = [];

  // order
  private order: QueryOrder = QueryOrder.popular;

  // timeframe
  private timeframe: QueryTimeframe = QueryTimeframe.week;

  private constructor() {
    // Private constructor to prevent instantiation
  }

  public static getInstance(): ManagerContent {
    if (!ManagerContent.instance) {
      ManagerContent.instance = new ManagerContent();
    }
    return ManagerContent.instance;
  }

  public init() {
    this.db = getFirestore();
    this.managerChannels = ManagerChannels;
    this.managerChannels.addListenerChannelCurrent(
      (channel: IChannel | null) => {
        this.channelCurrent = channel;
        this.queryContent();
      }
    );
    this.managerPosts = ManagerPosts;
  }

  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
  // actions
  public setTypesContentActive(types: string[]) {
    if (this.typesContentActive === types) return;
    this.typesContentActive = types;
    this.queryContent();
  }
  public setOrder(order: QueryOrder) {
    this.order = order;
    this.queryContent();
  }
  public setTimeframe(timeframe: QueryTimeframe) {
    this.timeframe = timeframe;
    this.queryContent();
  }

  // actions
  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
  // query
  private async queryContent() {
    if (!this.db) return;
    if (this.typesContentActive.length === 0) return;

    let orderField = null;
    switch (this.order) {
      case QueryOrder.new:
        orderField = "timestampCreation";
        break;
      case QueryOrder.popular:
        orderField = "statistics.countPositive";
        break;
      case QueryOrder.inspiring:
        orderField = "statistics.countStars";
        break;
      case QueryOrder.educational:
        orderField = "statistics.countBooks";
        break;
    }

    if (this.order !== QueryOrder.new) {
      switch (this.timeframe) {
        case QueryTimeframe.day:
          orderField += "Day";
          break;
        case QueryTimeframe.week:
          orderField += "Week";
          break;
        case QueryTimeframe.month:
          orderField += "Month";
          break;
        case QueryTimeframe.year:
          orderField += "Year";
          break;
        case QueryTimeframe.all:
          orderField += "All";
          break;
      }
    }

    console.log("orderField", orderField);

    const q = query(
      collection(this.db, stateCollections.channels),
      where("parent", "==", this.channelCurrent?.id),
      where("type", "in", this.typesContentActive),
      orderBy(orderField, "desc")
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.data());
    });

    this.notifyContentListeners();
  }
  // query
  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
  // state
  private notifyContentListeners() {
    this.listenersContent.forEach((listener) => {
      listener(this.ids);
    });
  }
  public addContentListener(
    listener: (ids: string[]) => void
  ): (ids: string[]) => void {
    this.listenersContent.push(listener);
    listener(this.ids);
    return listener;
  }
  public removeContentListener(listener: (ids: string[]) => void) {
    const index = this.listenersContent.indexOf(listener);
    if (index > -1) {
      this.listenersContent.splice(index, 1);
    }
  }
  // state
  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
}

export default ManagerContent.getInstance();
