interface INotifaction {
  idSender: string;
  idPost: string;
  idChannelOrigin: string;
  idComment: string;
  textComment: string;
  usernameSender: string;
  urlAvatarSender: string;
  typeContnet: string;
  typeNotification: string;
}

export type { INotifaction };
