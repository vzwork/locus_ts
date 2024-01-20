import {
  DocumentData,
  Firestore,
  arrayUnion,
  doc,
  getFirestore,
  increment,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { IComment, ICommentBuilt } from "../comment";
import { stateCollections } from "../db";
import { IAccount } from "../account";
import ManagerAccount from "../_1_ManagerAccount/ManagerAccount";
import ManagerContent from "../_9_ManagerContent/ManagerContent";
import { IPost } from "../post";
import ManagerNotificationsUser from "../_3_ManagerNotificationsUser/ManagerNotificationsUser";

class ManagerComments {
  private static instance: ManagerComments;
  private account: IAccount | null = null;
  private comments: Map<string, IComment[]> = new Map();
  private db: Firestore | null = null;
  private listenersComments: Map<
    string,
    ((comments: ICommentBuilt[]) => void)[]
  > = new Map();
  private mapCommentsBuilt: Map<string, ICommentBuilt[]> = new Map<
    string,
    ICommentBuilt[]
  >();
  private subscribersComments: Map<string, () => void> = new Map();
  private listenersIdsUsersComments: Map<
    string,
    ((idsUsers: Set<string>) => void)[]
  > = new Map();
  private mapIdsUsersComments: Map<string, Set<string>> = new Map();
  private managerContent: typeof ManagerContent | null = null;
  private managerNotificationsUser: typeof ManagerNotificationsUser | null =
    null;

  private constructor() {
    // Initialize manager
  }

  public static getInstance(): ManagerComments {
    if (!ManagerComments.instance) {
      ManagerComments.instance = new ManagerComments();
    }
    return ManagerComments.instance;
  }

  public init() {
    this.db = getFirestore();
    const managerAccount = ManagerAccount;
    managerAccount.addListenerAccount((account) => {
      this.account = account;
    });
    this.managerContent = ManagerContent;
    this.managerNotificationsUser = ManagerNotificationsUser;
  }

  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
  // actions
  public async addComment(text: string, post: IPost) {
    if (!this.db) return;
    if (!this.account) return;

    const comment = {
      id: this.account.id + Date.now(),
      text,
      idAuthor: this.account?.id ?? "",
      urlAvatarAuthor: this.account?.urlAvatar ?? "",
      nameAuthor: this.account?.username ?? "",
      timestampCreation: Date.now(),
      timestampUpdate: Date.now(),
      countUpvotes: 0,
      idsUpvotes: [],
      countDownvotes: 0,
      idsDownvotes: [],
      countReplies: 0,
      idsReplies: [],
    };

    const commentsAreNotEmpty = this.comments.get(post.id)?.length ?? 0 > 0;

    await updateDoc(doc(this.db, stateCollections.posts, post.id), {
      countComments: increment(1),
    }).catch((error) => {
      console.error("Error adding comment: ", error.message);
    });

    if (!commentsAreNotEmpty) {
      const comments: IComment[] = [comment];
      const data: DocumentData = {
        idPost: post.id,
        comments: comments,
      };
      await setDoc(doc(this.db, stateCollections.comments, post.id), data)
        .then(() => {
          console.log("Document successfully written!");
        })
        .catch((error) => {
          console.error("Error adding comment: ", error.message);
        });
    } else {
      await updateDoc(doc(this.db, stateCollections.comments, post.id), {
        comments: arrayUnion(comment),
      }).catch((error) => {
        console.error("Error adding comment: ", error.message);
      });
    }

    this.managerNotificationsUser?.addNotificationComment(post, text);
    this.managerContent?.incrementCounterCommentLocally(post.id);
  }
  public async addReply(post: IPost, idComment: string, text: string) {
    if (!this.db) return;
    if (!this.account) return;

    const comment = {
      id: this.account.id + Date.now(),
      text,
      idAuthor: this.account?.id ?? "",
      urlAvatarAuthor: this.account?.urlAvatar ?? "",
      nameAuthor: this.account?.username ?? "",
      timestampCreation: Date.now(),
      timestampUpdate: Date.now(),
      countUpvotes: 0,
      idsUpvotes: [],
      countDownvotes: 0,
      idsDownvotes: [],
      countReplies: 0,
      idsReplies: [],
    };

    const comments = this.comments.get(post.id);
    if (!comments) return;

    const parentComment = comments.find((c) => c.id === idComment);
    if (!parentComment) return;

    parentComment.countReplies += 1;
    parentComment.idsReplies.push(comment.id);

    comments.push(comment);

    this.managerNotificationsUser?.addNotificationComment(post, text);
    this.managerContent?.incrementCounterCommentLocally(post.id);

    await updateDoc(doc(this.db, stateCollections.posts, post.id), {
      countComments: increment(1),
    }).catch((error) => {
      console.error("Error adding comment: ", error.message);
    });

    await updateDoc(doc(this.db, stateCollections.comments, post.id), {
      comments: comments,
    }).catch((error) => {
      console.error("Error adding comment: ", error.message);
    });
  }
  public async upvoteComment(idPost: string, idComment: string) {
    if (!this.db) return;
    if (!this.account) return;

    const comments = this.comments.get(idPost);
    if (!comments) return;

    const comment = comments.find((c) => c.id === idComment);
    if (!comment) return;

    if (comment.idsUpvotes.includes(this.account.id)) return;

    comment.countUpvotes += 1;
    comment.idsUpvotes.push(this.account.id);

    await updateDoc(doc(this.db, stateCollections.comments, idPost), {
      comments: comments,
    }).catch((error) => {
      console.error("Error adding comment: ", error.message);
    });
  }
  public async unUpvoteComment(idPost: string, idComment: string) {
    if (!this.db) return;
    if (!this.account) return;

    const comments = this.comments.get(idPost);
    if (!comments) return;

    const comment = comments.find((c) => c.id === idComment);
    if (!comment) return;

    if (!comment.idsUpvotes.includes(this.account.id)) return;

    comment.countUpvotes -= 1;
    comment.idsUpvotes = comment.idsUpvotes.filter(
      (id) => id !== this.account?.id
    );

    await updateDoc(doc(this.db, stateCollections.comments, idPost), {
      comments: comments,
    }).catch((error) => {
      console.error("Error adding comment: ", error.message);
    });
  }
  public async downvoteComment(idPost: string, idComment: string) {
    if (!this.db) return;
    if (!this.account) return;

    const comments = this.comments.get(idPost);
    if (!comments) return;

    const comment = comments.find((c) => c.id === idComment);
    if (!comment) return;

    if (comment.idsDownvotes.includes(this.account.id)) return;

    comment.countDownvotes += 1;
    comment.idsDownvotes.push(this.account.id);

    await updateDoc(doc(this.db, stateCollections.comments, idPost), {
      comments: comments,
    }).catch((error) => {
      console.error("Error adding comment: ", error.message);
    });
  }
  public async unDownvoteComment(idPost: string, idComment: string) {
    if (!this.db) return;
    if (!this.account) return;

    const comments = this.comments.get(idPost);
    if (!comments) return;

    const comment = comments.find((c) => c.id === idComment);
    if (!comment) return;

    if (!comment.idsDownvotes.includes(this.account.id)) return;

    comment.countDownvotes -= 1;
    comment.idsDownvotes = comment.idsDownvotes.filter(
      (id) => id !== this.account?.id
    );

    await updateDoc(doc(this.db, stateCollections.comments, idPost), {
      comments: comments,
    }).catch((error) => {
      console.error("Error adding comment: ", error.message);
    });
  }

  // actions
  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
  // listeners comments

  public addListenerComments(
    id: string,
    listener: (comments: ICommentBuilt[]) => void
  ): (comments: ICommentBuilt[]) => void {
    if (!this.db) return listener;

    const listeners = this.listenersComments.get(id);
    if (listeners) {
      listeners.push(listener);
    } else {
      this.listenersComments.set(id, [listener]);
    }

    if (!this.subscribersComments.has(id)) {
      const unsub = onSnapshot(
        doc(this.db, stateCollections.comments, id),
        (doc) => {
          if (!doc.exists()) return;
          const data = doc.data();
          if (!data) return;
          this.commentsUpdated(data);
        }
      );
      this.subscribersComments.set(id, unsub);
    }

    return listener;
  }

  private commentsUpdated(data: DocumentData) {
    if (data.idPost === undefined) {
      console.error("data.idPost is undefined");
      return;
    }
    const comments: IComment[] = data.comments as IComment[];
    this.comments.set(data.idPost, comments);
    this.buildComments(data.idPost, comments);
  }

  private buildComments(idPost: string, comments: IComment[]) {
    const firstLevelComments: ICommentBuilt[] = [];
    const setNotFirstLevelComments = new Set<string>();
    const mapComments = new Map<string, IComment>();

    if (!this.mapIdsUsersComments.has(idPost)) {
      this.mapIdsUsersComments.set(idPost, new Set<string>());
    }

    comments.forEach((comment) => {
      this.mapIdsUsersComments.get(idPost)?.add(comment.idAuthor);
      if (comment.idsReplies.length > 0) {
        comment.idsReplies.forEach((id) => {
          setNotFirstLevelComments.add(id);
        });
      }
      mapComments.set(comment.id, comment);
    });
    comments.forEach((comment) => {
      if (setNotFirstLevelComments.has(comment.id)) return;
      const builtComment = this.buildCommentRecursive(comment, mapComments);
      firstLevelComments.push(builtComment);
    });
    firstLevelComments.sort(
      (b, a) =>
        a.countUpvotes - a.countDownvotes - (b.countUpvotes - b.countDownvotes)
    );

    this.mapCommentsBuilt.set(idPost, firstLevelComments);

    this.notifyListenersComments(idPost);
    this.notifyListenersIdsUsersComments(idPost);
  }

  private buildCommentRecursive(
    comment: IComment,
    mapComments: Map<string, IComment>
  ): ICommentBuilt {
    const replies: ICommentBuilt[] = [];
    comment.idsReplies.forEach((id) => {
      const reply = mapComments.get(id);
      if (!reply) return;
      replies.push(this.buildCommentRecursive(reply, mapComments));
    });
    replies.sort(
      (b, a) =>
        a.countUpvotes - a.countDownvotes - (b.countUpvotes - b.countDownvotes)
    );
    const builtComment: ICommentBuilt = {
      id: comment.id,
      text: comment.text,
      idAuthor: comment.idAuthor,
      urlAvatarAuthor: comment.urlAvatarAuthor,
      nameAuthor: comment.nameAuthor,
      timestampCreation: comment.timestampCreation,
      countUpvotes: comment.countUpvotes,
      idsUpvotes: comment.idsUpvotes,
      countDownvotes: comment.countDownvotes,
      idsDownvotes: comment.idsDownvotes,
      replies: replies,
    };
    return builtComment;
  }

  private notifyListenersComments(idPost: string) {
    const listeners = this.listenersComments.get(idPost);
    if (!listeners) return;
    listeners.forEach((listener) => {
      const comments = this.mapCommentsBuilt.get(idPost);
      if (!comments) return;
      listener(comments);
    });
  }

  public async removeListenerComments(
    id: string,
    listener: (commentsBuilt: ICommentBuilt[]) => void
  ) {
    if (!this.db) return;

    const listeners = this.listenersComments.get(id);
    if (!listeners) return;
    if (listeners.length === 1) {
      this.listenersComments.delete(id);
      const unsub = this.subscribersComments.get(id);
      if (unsub) {
        unsub();
        this.subscribersComments.delete(id);
      }
    } else {
      this.listenersComments.set(
        id,
        listeners.filter((l) => l !== listener)
      );
    }
  }

  public addListenerIdsUsersComments(
    idPost: string,
    listener: (idsUsers: Set<string>) => void
  ): (idsUsers: Set<string>) => void {
    const listeners = this.listenersIdsUsersComments.get(idPost);
    if (listeners) {
      listeners.push(listener);
    } else {
      this.listenersIdsUsersComments.set(idPost, [listener]);
    }

    if (this.mapIdsUsersComments.has(idPost)) {
      listener(this.mapIdsUsersComments.get(idPost) as Set<string>);
    }

    return listener;
  }

  private notifyListenersIdsUsersComments(idPost: string) {
    const listeners = this.listenersIdsUsersComments.get(idPost);
    if (!listeners) return;
    const idsUsers = this.mapIdsUsersComments.get(idPost);
    if (!idsUsers) return;
    listeners.forEach((listener) => {
      listener(idsUsers);
    });
  }

  public async removeListenerIdsUsersComments(
    idPost: string,
    listener: (idsUsers: Set<string>) => void
  ) {
    const listeners = this.listenersIdsUsersComments.get(idPost);
    if (!listeners) return;
    if (listeners.length === 1) {
      this.listenersIdsUsersComments.delete(idPost);
    } else {
      this.listenersIdsUsersComments.set(
        idPost,
        listeners.filter((l) => l !== listener)
      );
    }
  }
  // listeners comments
  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
}

export default ManagerComments.getInstance();
