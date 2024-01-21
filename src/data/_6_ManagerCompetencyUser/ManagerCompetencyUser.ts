import {
  Firestore,
  arrayUnion,
  collection,
  doc,
  getDocs,
  getFirestore,
  increment,
  limit,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { IPost } from "../post";
import ManagerAccount from "../_1_ManagerAccount/ManagerAccount";
import { IAccount } from "../account";
import { stateCollections } from "../db";
import { CompetencyRates, ICompetency } from "../competency";
import ManagerChannels from "../_7_ManagerChannels/ManagerChannels";
import { IChannel } from "../channel";

class ManagerCompetencyUser {
  private static instance: ManagerCompetencyUser;
  private db: Firestore | null = null;
  private account: IAccount | null = null;
  private channelCurrent: IChannel | null = null;
  private competencyChannelsMostTimeSpent: ICompetency[] = [];
  private idOldCounterTimeSpentChannel: NodeJS.Timer | null = null;
  private idOldCounterQueryIdsChannelsMostTimeSpent: NodeJS.Timer | null = null;
  private listenersCompetencyChannelsMostTimeSpent: ((
    competencyChannelsMostTimeSpent: ICompetency[]
  ) => void)[] = [];

  private constructor() {
    // Private constructor to prevent instantiation from outside
  }

  public static getInstance(): ManagerCompetencyUser {
    if (!ManagerCompetencyUser.instance) {
      ManagerCompetencyUser.instance = new ManagerCompetencyUser();
    }
    return ManagerCompetencyUser.instance;
  }

  public init() {
    // TODO
    this.db = getFirestore();
    const managerAccount = ManagerAccount;
    managerAccount.addListenerAccount((account) => {
      this.account = account;
      this.counterQueryIdsChannelsMostTimeSpent(account);
    });
    const managerChannels = ManagerChannels;
    managerChannels.addListenerChannelCurrent((channel) => {
      this.channelCurrent = channel;
      this.counterTimeSpentChannel();
    });
  }

  private async counterQueryIdsChannelsMostTimeSpent(account: IAccount | null) {
    if (!account) return;

    if (!this.db || !this.account) return;
    const q = query(
      collection(this.db, stateCollections.competencyUser),
      where("idUser", "==", this.account.id),
      orderBy("minutesSpent", "desc"),
      limit(10)
    );

    const querySnapshot = await getDocs(q);

    const competencyNewOrder: ICompetency[] = [];
    querySnapshot.forEach((doc) => {
      const competency = doc.data() as ICompetency;
      competencyNewOrder.push(competency);
    });
    this.competencyChannelsMostTimeSpent = competencyNewOrder;
    this.notifyListenersCompetencyChannelsMostTimeSpent();

    const minutes = 1;

    const minutesToMillis = 1000 * 60 * minutes;

    const idNewCounter = setInterval(async () => {
      if (!this.db || !this.account) return;
      const q = query(
        collection(this.db, stateCollections.competencyUser),
        where("idUser", "==", this.account.id),
        orderBy("minutesSpent", "desc"),
        limit(10)
      );

      const querySnapshot = await getDocs(q);

      const competencyNewOrder: ICompetency[] = [];
      querySnapshot.forEach((doc) => {
        const competency = doc.data() as ICompetency;
        competencyNewOrder.push(competency);
      });
      this.competencyChannelsMostTimeSpent = competencyNewOrder;
      this.notifyListenersCompetencyChannelsMostTimeSpent();
    }, minutesToMillis);

    if (this.idOldCounterQueryIdsChannelsMostTimeSpent) {
      clearInterval(this.idOldCounterQueryIdsChannelsMostTimeSpent);
    }

    this.idOldCounterQueryIdsChannelsMostTimeSpent = idNewCounter;
  }

  private async counterTimeSpentChannel() {
    const idChannelCurrentTimerRunning = this.channelCurrent?.id;
    const minutes = 1;
    const minutesToMillis = 1000 * 60 * minutes;

    const idNewCounter = setInterval(async () => {
      if (!this.db || !this.account || !idChannelCurrentTimerRunning) return;
      updateDoc(
        doc(
          this.db,
          stateCollections.competencyUser,
          this.account.id + idChannelCurrentTimerRunning
        ),
        {
          minutesSpent: increment(minutes),
        }
      )
        .catch((error) => {
          if (!this.db || !this.account || !idChannelCurrentTimerRunning)
            return;
          if (error.code === "not-found") {
            const newCompetencyDoc: ICompetency = {
              idUser: this.account.id,
              idChannel: idChannelCurrentTimerRunning,
              idsBooks: [],
              idsStars: [],
              minutesSpent: 5,
              competencyIntrinsic: 0,
              competencyInheritedChildren: 0,
              competencyInheritedParent: 0,
              competencyCumulative: 0,
            };
            setDoc(
              doc(
                this.db,
                stateCollections.competencyUser,
                this.account.id + idChannelCurrentTimerRunning
              ),
              newCompetencyDoc
            );
          }
        })
        .then(() => {
          // console.log("updated competency time spent");
        });
    }, minutesToMillis);

    if (this.idOldCounterTimeSpentChannel) {
      clearInterval(this.idOldCounterTimeSpentChannel);
    }
    this.idOldCounterTimeSpentChannel = idNewCounter;
  }

  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
  // actions
  public async starAnotherUser(post: IPost) {
    if (!this.db || !this.account) return;
    if (this.account.id === post.idCreator) return;
    await updateDoc(
      doc(
        this.db,
        stateCollections.competencyUser,
        post.idCreator + post.navigation.idChannelOrigin
      ),
      {
        idsStars: arrayUnion(this.account.id),
      }
    ).catch((error) => {
      if (!this.db || !this.account) return;
      if (error.code === "not-found") {
        const newCompetencyDoc: ICompetency = {
          idUser: post.idCreator,
          idChannel: post.navigation.idChannelOrigin,
          idsBooks: [],
          idsStars: [this.account.id],
          minutesSpent: 0,
          competencyIntrinsic: CompetencyRates.star,
          competencyInheritedChildren: 0,
          competencyInheritedParent: 0,
          competencyCumulative: CompetencyRates.star,
        };
        setDoc(
          doc(
            this.db,
            stateCollections.competencyUser,
            post.idCreator + post.navigation.idChannelOrigin
          ),
          newCompetencyDoc
        );
      }
    });
  }

  public async bookAnotherUser(post: IPost) {
    if (!this.db || !this.account) return;
    if (this.account.id === post.idCreator) return;
    await updateDoc(
      doc(
        this.db,
        stateCollections.competencyUser,
        post.idCreator + post.navigation.idChannelOrigin
      ),
      {
        idsBooks: arrayUnion(this.account.id),
      }
    ).catch((error) => {
      if (!this.db || !this.account) return;
      if (error.code === "not-found") {
        const newCompetencyDoc: ICompetency = {
          idUser: post.idCreator,
          idChannel: post.navigation.idChannelOrigin,
          idsBooks: [this.account.id],
          idsStars: [],
          minutesSpent: 0,
          competencyIntrinsic: CompetencyRates.book,
          competencyInheritedChildren: 0,
          competencyInheritedParent: 0,
          competencyCumulative: CompetencyRates.book,
        };
        setDoc(
          doc(
            this.db,
            stateCollections.competencyUser,
            post.idCreator + post.navigation.idChannelOrigin
          ),
          newCompetencyDoc
        );
      }
    });
  }
  // actions
  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
  // state
  private notifyListenersCompetencyChannelsMostTimeSpent() {
    this.listenersCompetencyChannelsMostTimeSpent.forEach((listener) => {
      listener(this.competencyChannelsMostTimeSpent);
    });
  }

  public addListenerCompetencyChannelsMostTimeSpent(
    listener: (competencyChannelsMostTimeSpent: ICompetency[]) => void
  ): (competencyChannelsMostTimeSpent: ICompetency[]) => void {
    this.listenersCompetencyChannelsMostTimeSpent.push(listener);

    listener(this.competencyChannelsMostTimeSpent);

    return listener;
  }

  public removeListenerCompetencyChannelsMostTimeSpent(
    listener: (competencyChannelsMostTimeSpent: ICompetency[]) => void
  ) {
    const index =
      this.listenersCompetencyChannelsMostTimeSpent.indexOf(listener);
    if (index !== -1) {
      this.listenersCompetencyChannelsMostTimeSpent.splice(index, 1);
    }
  }
  // state
  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
}

export default ManagerCompetencyUser.getInstance();
