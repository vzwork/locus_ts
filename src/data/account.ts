interface IAccount {
  version: string;
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  urlAvatar: string;
  role: string;
  createdAt: number;
  updatedAt: number;
  countStars: number;
  countBooks: number;
  countPosts: number;
}

export type { IAccount };
