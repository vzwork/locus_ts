import {
  Firestore,
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  getFirestore,
  increment,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import ManagerAccount from "../_1_ManagerAccount/ManagerAccount";
import { IAccount } from "../account";
import { stateCollections } from "../db";
import { error } from "console";
import { IPost } from "../post";
import { IStats } from "../stats";

class ManagerTraceUser {
  private static instance: ManagerTraceUser;
  private db: Firestore | null = null;
  private account: IAccount | null = null;

  // state
  private statsUser: IStats | null = null;
  private setStars: Set<string> = new Set();
  private setBooks: Set<string> = new Set();
  private setComments: Set<string> = new Set();

  // listeners
  private listenersStatsUser: Array<(statsUser: IStats | null) => void> = [];
  private listenersStars: Array<(stars: Set<string>) => void> = [];

  private constructor() {
    // Private constructor to prevent instantiation
  }

  public static getInstance(): ManagerTraceUser {
    if (!ManagerTraceUser.instance) {
      ManagerTraceUser.instance = new ManagerTraceUser();
    }
    return ManagerTraceUser.instance;
  }

  public init() {
    this.db = getFirestore();
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
          this.loadStatsUser();
        }
      }
    });
  }

  private async loadTraceData() {
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

  private async loadStatsUser() {
    if (!this.db || !this.account) return;

    const docStatsRef = await getDoc(
      doc(this.db, stateCollections.stats, this.account.id)
    ).catch((error) => {
      console.log("Error getting document:", error);
    });
    if (docStatsRef && docStatsRef.exists()) {
      this.statsUser = docStatsRef.data() as IStats;
    } else {
      const statsTemplate: IStats = {
        countStarsByOtherUsers: 0,
        countBooksByOtherUsers: 0,
        countPosts: 0,
        countUpvotesComments: 0,
      };

      await setDoc(
        doc(this.db, stateCollections.stats, this.account.id),
        statsTemplate
      );
      this.statsUser = statsTemplate;
    }

    this.notifyListenersStatsUser();
  }

  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
  // user actions
  public async addStar(post: IPost) {
    if (!this.db || !this.account) return;
    if (this.setStars.has(post.id)) return;

    this.setStars.add(post.id);
    this.notifyListenersStars();

    await updateDoc(
      doc(this.db, stateCollections.traceUserStars, this.account.id),
      {
        stars: arrayUnion(post.id),
      }
    ).catch((error) => {
      console.log(error.message);
    });

    if (this.account.id !== post.idCreator) {
      await this.makeSureStatsUserExist(post.idCreator);
      await updateDoc(doc(this.db, stateCollections.stats, post.idCreator), {
        countStarsByOtherUsers: increment(1),
      });
    }

    this.notifyListenersStars();
  }

  public async removeStar(post: IPost) {
    if (!this.db || !this.account) return;
    if (!this.setStars.has(post.id)) return;

    this.setStars.delete(post.id);
    this.notifyListenersStars();

    await updateDoc(
      doc(this.db, stateCollections.traceUserStars, this.account.id),
      {
        stars: arrayRemove(post.id),
      }
    );

    if (this.account.id !== post.idCreator) {
      await this.makeSureStatsUserExist(post.idCreator);
      await updateDoc(doc(this.db, stateCollections.stats, post.idCreator), {
        countStarsByOtherUsers: increment(-1),
      });
    }

    this.notifyListenersStars();
  }

  public async addBook(post: IPost) {
    if (!this.db || !this.account) return;
    if (this.setBooks.has(post.id)) return;

    this.setBooks.add(post.id);
    this.notifyListenersBooks();

    await updateDoc(
      doc(this.db, stateCollections.traceUserBooks, this.account.id),
      {
        books: arrayUnion(post.id),
      }
    );

    if (this.account.id !== post.idCreator) {
      await this.makeSureStatsUserExist(post.idCreator);
      await updateDoc(doc(this.db, stateCollections.stats, post.idCreator), {
        countBooksByOtherUsers: increment(1),
      });

      this.notifyListenersBooks();
    }
  }

  public async removeBook(post: IPost) {
    if (!this.db || !this.account) return;
    if (!this.setBooks.has(post.id)) return;

    this.setBooks.delete(post.id);
    this.notifyListenersBooks();

    await updateDoc(
      doc(this.db, stateCollections.traceUserBooks, this.account.id),
      {
        books: arrayRemove(post.id),
      }
    );

    if (this.account.id !== post.idCreator) {
      await this.makeSureStatsUserExist(post.idCreator);
      await updateDoc(doc(this.db, stateCollections.stats, post.idCreator), {
        countBooksByOtherUsers: increment(-1),
      });
    }

    this.notifyListenersBooks();
  }

  private async makeSureStatsUserExist(idUser: string) {
    if (!this.db) return;
    const docRef = doc(this.db, stateCollections.stats, idUser);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      const statsTemplate: IStats = {
        countStarsByOtherUsers: 0,
        countBooksByOtherUsers: 0,
        countPosts: 0,
        countUpvotesComments: 0,
      };

      await setDoc(docRef, statsTemplate);
    }
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
  // state stats user
  private notifyListenersStatsUser() {
    if (!this.statsUser) return;
    this.listenersStatsUser.forEach((listener) => {
      listener(this.statsUser);
    });
  }
  public addListenerStatsUser(
    listener: (statsUser: IStats | null) => void
  ): (statsUser: IStats | null) => void {
    this.listenersStatsUser.push(listener);
    listener(this.statsUser);
    return listener;
  }
  public removeListenerStatsUser(listener: (statsUser: IStats | null) => void) {
    this.listenersStatsUser = this.listenersStatsUser.filter(
      (l) => l !== listener
    );
  }
  // state stats user
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
