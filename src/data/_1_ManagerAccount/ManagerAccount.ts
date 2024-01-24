// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
// The idea behind managers is that every click
// of a button is handled by a manager.
//
// This provides a single point of entry for all actions
// and allows a very granular control over the application.
// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

import {
  Firestore,
  doc,
  getDoc,
  getFirestore,
  setDoc,
} from "firebase/firestore";
import { IAccount } from "../account";
import { stateCollections } from "../db";
import {
  Auth,
  deleteUser,
  getAuth,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { time } from "console";

const VERSION_ACCOUNT = "1.0.0";

class ManagerAccount {
  // singleton
  private static instance: ManagerAccount;
  private db: Firestore | null = null;
  private auth: Auth | null = null;

  // state account
  private account: IAccount | null = null;
  private subscribersAccount: ((account: IAccount | null) => void)[] = [];

  private constructor() {}

  public static getInstance(): ManagerAccount {
    if (!ManagerAccount.instance) {
      ManagerAccount.instance = new ManagerAccount();
    }
    return ManagerAccount.instance;
  }

  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
  // init
  public init() {
    this.db = getFirestore();
    this.auth = getAuth();
    onAuthStateChanged(this.auth, (user) => {
      if (!user) {
        this.setAccount(null);
        return;
      }

      getDoc(doc(this.db!, stateCollections.accounts, user.uid))
        .then((docSnap) => {
          if (!docSnap.exists()) {
            this.setAccount(null);
            deleteUser(user);
            return;
          }

          this.setAccount(docSnap.data() as IAccount);
        })
        .catch((error) => {
          console.error(error.message);
          console.error(error.code);
        });
    });
  }
  // init
  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
  // actions
  public async getAccountOptimized(
    idAccount: string
  ): Promise<IAccount | null> {
    const accountsString = localStorage.getItem("accounts");
    const timestampUpdatedAccountString = localStorage.getItem(
      "timestampUpdatedAccount"
    );

    if (accountsString === null || timestampUpdatedAccountString === null) {
      localStorage.setItem("accounts", JSON.stringify({}));
      localStorage.setItem("timestampUpdatedAccount", JSON.stringify({}));
      return this.getAccount(idAccount);
    }

    const accounts = JSON.parse(accountsString);
    const account = accounts[idAccount];

    const timestampUpdatedAccount = JSON.parse(timestampUpdatedAccountString);
    const timestampUpdated = timestampUpdatedAccount[idAccount];

    if (
      timestampUpdated === undefined ||
      timestampUpdated < Date.now() - 1000 * 60 * 60 * 48
    ) {
      return this.getAccount(idAccount);
    }

    if (account === undefined) {
      return this.getAccount(idAccount);
    }

    return account;
  }

  private async getAccount(idAccount: string): Promise<IAccount | null> {
    if (!this.db) return null;

    const docSnap = await getDoc(
      doc(this.db, stateCollections.accounts, idAccount)
    ).catch((error) => {
      console.error(error.message);
      console.error(error.code);
    });

    if (!docSnap || !docSnap.exists()) return null;

    this.optimizeAccount(docSnap.data() as IAccount);

    return docSnap.data() as IAccount;
  }

  private optimizeAccount(account: IAccount) {
    const accountsString = localStorage.getItem("accounts");
    const timestampUpdatedAccountString = localStorage.getItem(
      "timestampUpdatedAccount"
    );

    if (accountsString === null || timestampUpdatedAccountString === null) {
      localStorage.setItem("accounts", JSON.stringify({}));
      localStorage.setItem("timestampUpdatedAccount", JSON.stringify({}));
    }

    const accounts = JSON.parse(accountsString!);
    accounts[account.id] = account;
    localStorage.setItem("accounts", JSON.stringify(accounts));

    const timestampUpdatedAccount = JSON.parse(timestampUpdatedAccountString!);
    timestampUpdatedAccount[account.id] = Date.now();
    localStorage.setItem(
      "timestampUpdatedAccount",
      JSON.stringify(timestampUpdatedAccount)
    );
  }

  public async setAccount(account: IAccount | null) {
    if (this.account === account) return;
    if (!this.db) return;

    this.account = account;

    if (!account) {
      signOut(this.auth!);
    }

    if (account) {
      await setDoc(
        doc(this.db, stateCollections.accounts, account.id),
        account
      ).catch((error) => {
        console.error(error.message);
        console.error(error.code);
      });
    }

    this.notifyListenersAccount();
  }
  // actions
  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
  // account
  private notifyListenersAccount() {
    this.subscribersAccount.forEach((subscriber) => subscriber(this.account));
  }

  public addListenerAccount(
    listener: (account: IAccount | null) => void
  ): (account: IAccount | null) => void {
    this.subscribersAccount.push(listener);

    listener(this.account);

    return listener;
  }

  public removeListenerAccount(listener: (account: IAccount | null) => void) {
    this.subscribersAccount = this.subscribersAccount.filter(
      (subscriber) => subscriber !== listener
    );
  }
  // account
  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
}

export default ManagerAccount.getInstance();
