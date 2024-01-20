interface IComment {
  id: string;
  text: string;
  idAuthor: string;
  urlAvatarAuthor: string;
  nameAuthor: string;
  timestampCreation: number;
  timestampUpdate: number;
  countUpvotes: number;
  idsUpvotes: string[];
  countDownvotes: number;
  idsDownvotes: string[];
  countReplies: number;
  idsReplies: string[];
}

interface ICommentBuilt {
  id: string;
  text: string;
  idAuthor: string;
  urlAvatarAuthor: string;
  nameAuthor: string;
  timestampCreation: number;
  countUpvotes: number;
  idsUpvotes: string[];
  countDownvotes: number;
  idsDownvotes: string[];
  replies: ICommentBuilt[];
}

export type { IComment, ICommentBuilt };
