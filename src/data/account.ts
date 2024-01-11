interface IAccount {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  avatarURL: string;
  role: string;
  createdAt: number;
  updatedAt: number;
}

export type { IAccount };