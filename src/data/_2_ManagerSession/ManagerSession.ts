import { Firestore, getFirestore } from "firebase/firestore";
import ManagerAccount from "../_1_ManagerAccount/ManagerAccount";
import { IAccount } from "../account";

class ManagerSession {
  private static instance: ManagerSession;
  private db: Firestore | null = null;
  private managerAccount = ManagerAccount;
  private account: IAccount | null = null;

  private constructor() {
    // Private constructor to prevent instantiation
  }

  public static getInstance(): ManagerSession {
    if (!ManagerSession.instance) {
      ManagerSession.instance = new ManagerSession();
    }
    return ManagerSession.instance;
  }

  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
  // init
  public init() {
    this.db = getFirestore();
    this.managerAccount.addListenerAccount((account: IAccount | null) => {
      this.accountNewState(account);
    });
  }
  // init
  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
  // account tie
  public accountNewState(account: IAccount | null) {
    this.account = account;
  }
  // account tie
  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
  // actions

  // actions
  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
}

export default ManagerSession.getInstance();
