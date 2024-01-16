import {
  Firestore,
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  getFirestore,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import ManagerAccount from "../_1_ManagerAccount/ManagerAccount";
import { IAccount } from "../account";
import { stateCollections } from "../db";
import { error } from "console";

class ManagerTraceUser {
  private static instance: ManagerTraceUser;
  private db: Firestore | null = null;
  private account: IAccount | null = null;

  // state
  private setStars: Set<string> = new Set();
  private setBooks: Set<string> = new Set();
  private setComments: Set<string> = new Set();

  // listeners
  private listenersStars: Array<(stars: Set<string>) => void> = [];

  private constructor() {
    // Private constructor to prevent instantiation

    const managerAccount = ManagerAccount;
    managerAccount.addListenerAccount((account: IAccount | null) => {
      if (!account) {
        this.account = null;
        this.setStars = new Set();
        this.setBooks = new Set();
        this.setComments = new Set();
      } else {
        if (JSON.stringify(this.account) !== JSON.stringify(account)) {
          this.account = account;
          this.loadTraceData();
        }
      }
    });
  }

  public static getInstance(): ManagerTraceUser {
    if (!ManagerTraceUser.instance) {
      ManagerTraceUser.instance = new ManagerTraceUser();
    }
    return ManagerTraceUser.instance;
  }

  public init() {
    this.db = getFirestore();
  }

  public async loadTraceData() {
    if (!this.db || !this.account) return;

    const docStarsRef = await getDoc(
      doc(this.db, stateCollections.traceUserStars, this.account.id)
    ).catch((error) => {
      console.log("Error getting document:", error);
    });
    if (docStarsRef && docStarsRef.exists()) {
      this.setStars = new Set(docStarsRef.data().stars);
      this.notifyListenersStars();
    } else {
      await setDoc(
        doc(this.db, stateCollections.traceUserStars, this.account.id),
        {
          stars: [],
        }
      );
    }

    const docBooksRef = await getDoc(
      doc(this.db, stateCollections.traceUserBooks, this.account.id)
    ).catch((error) => {
      console.log("Error getting document:", error);
    });
    if (docBooksRef && docBooksRef.exists()) {
      this.setBooks = new Set(docBooksRef.data().books);
      this.notifyListenersBooks();
    } else {
      await setDoc(
        doc(this.db, stateCollections.traceUserBooks, this.account.id),
        {
          books: [],
        }
      );
    }

    const docCommentsRef = await getDoc(
      doc(this.db, stateCollections.traceUserComments, this.account.id)
    ).catch((error) => {
      console.log("Error getting document:", error);
    });
    if (docCommentsRef && docCommentsRef.exists()) {
      this.setComments = new Set(docCommentsRef.data().comments);
      this.notifyListenersComments();
    } else {
      await setDoc(
        doc(this.db, stateCollections.traceUserComments, this.account.id),
        {
          comments: [],
        }
      );
    }
  }

  public async updateCounterMinutesChannels(channelId: string) {
    if (!channelId) return;
    if (channelId === "") return;
    if (!this.db || !this.account) return;
  }

  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
  // user actions
  public async addStar(id: string) {
    if (!this.db || !this.account) return;
    if (this.setStars.has(id)) return;

    this.setStars.add(id);
    this.notifyListenersStars();

    await updateDoc(
      doc(this.db, stateCollections.traceUserStars, this.account.id),
      {
        stars: arrayUnion(id),
      }
    ).catch((error) => {
      console.log(error.message);
    });

    this.notifyListenersStars();
  }

  public async removeStar(id: string) {
    if (!this.db || !this.account) return;
    if (!this.setStars.has(id)) return;

    this.setStars.delete(id);
    this.notifyListenersStars();

    await updateDoc(
      doc(this.db, stateCollections.traceUserStars, this.account.id),
      {
        stars: arrayRemove(id),
      }
    );

    this.notifyListenersStars();
  }

  public async addBook(id: string) {
    if (!this.db || !this.account) return;
    if (this.setBooks.has(id)) return;

    this.setBooks.add(id);
    this.notifyListenersBooks();

    await updateDoc(
      doc(this.db, stateCollections.traceUserBooks, this.account.id),
      {
        books: arrayUnion(id),
      }
    );

    this.notifyListenersBooks();
  }

  public async removeBook(id: string) {
    if (!this.db || !this.account) return;
    if (!this.setBooks.has(id)) return;

    this.setBooks.delete(id);
    this.notifyListenersBooks();

    await updateDoc(
      doc(this.db, stateCollections.traceUserBooks, this.account.id),
      {
        books: arrayRemove(id),
      }
    );

    this.notifyListenersBooks();
  }

  public async addComment(id: string) {
    if (!this.db || !this.account) return;
    if (this.setComments.has(id)) return;

    this.setComments.add(id);
    this.notifyListenersComments();

    await updateDoc(
      doc(this.db, stateCollections.traceUserComments, this.account.id),
      {
        comments: arrayUnion(id),
      }
    );

    this.notifyListenersComments();
  }

  public async removeComment(id: string) {
    if (!this.db || !this.account) return;
    if (!this.setComments.has(id)) return;

    this.setComments.delete(id);
    this.notifyListenersComments();

    await updateDoc(
      doc(this.db, stateCollections.traceUserComments, this.account.id),
      {
        comments: arrayRemove(id),
      }
    );

    this.notifyListenersComments();
  }
  // user actions
  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
  // state stars
  private notifyListenersStars() {
    this.listenersStars.forEach((listener) => {
      listener(this.setStars);
    });
  }
  public addListenerStars(
    listener: (stars: Set<string>) => void
  ): (stars: Set<string>) => void {
    this.listenersStars.push(listener);
    listener(this.setStars);
    return listener;
  }
  public removeListenerStars(listener: (stars: Set<string>) => void) {
    this.listenersStars = this.listenersStars.filter((l) => l !== listener);
  }
  // state stars
  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
  // state books
  private notifyListenersBooks() {
    this.listenersStars.forEach((listener) => {
      listener(this.setBooks);
    });
  }
  public addListenerBooks(
    listener: (books: Set<string>) => void
  ): (books: Set<string>) => void {
    this.listenersStars.push(listener);
    listener(this.setBooks);
    return listener;
  }
  public removeListenerBooks(listener: (books: Set<string>) => void) {
    this.listenersStars = this.listenersStars.filter((l) => l !== listener);
  }
  // state books
  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
  // state comments
  private notifyListenersComments() {
    this.listenersStars.forEach((listener) => {
      listener(this.setComments);
    });
  }
  public addListenerComments(
    listener: (comments: Set<string>) => void
  ): (comments: Set<string>) => void {
    this.listenersStars.push(listener);
    listener(this.setComments);
    return listener;
  }
  public removeListenerComments(listener: (comments: Set<string>) => void) {
    this.listenersStars = this.listenersStars.filter((l) => l !== listener);
  }
  // state comments
  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
}

export default ManagerTraceUser.getInstance();
