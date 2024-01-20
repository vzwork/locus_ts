import {
  Firestore,
  arrayUnion,
  doc,
  getFirestore,
  increment,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { IPost } from "../post";
import ManagerAccount from "../_1_ManagerAccount/ManagerAccount";
import { IAccount } from "../account";
import { stateCollections } from "../db";
import { CompetencyRates, ICompetency } from "../competency";

class ManagerCompetencyUser {
  private static instance: ManagerCompetencyUser;
  private db: Firestore | null = null;
  private account: IAccount | null = null;

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
    });
  }

  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
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
        competencyIntrinsic: increment(CompetencyRates.star),
        competencyCumulative: increment(CompetencyRates.star),
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
        competencyIntrinsic: increment(CompetencyRates.book),
        competencyCumulative: increment(CompetencyRates.book),
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
  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
}

export default ManagerCompetencyUser.getInstance();
