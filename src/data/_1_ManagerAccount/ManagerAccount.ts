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
import { sign } from "crypto";

// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
// Communications between manager and React Components
//
// Component -> Manager
// - Component calls a method on the manager
//
// Manager -> Component
// - A component uses a hook to subscribe to a piece of state
// - A hook uses subscriber + notifier pattern to update the component
// - Manager keeps track of all hooks and notifies them when a change occurs
// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
// Account manager keeps track of all user account information
//
// - Email
// - Username
// - First Name
// - Last Name
// - Profile Picture
// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

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
