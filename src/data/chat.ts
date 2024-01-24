interface IOrganizationChats {
  version: string;
  idUser: string;
  idsChatsNewMessages: string[];
  idsChats: string[];
  idsRequestsChats: string[];
}

interface IMessage {
  version: string;
  idUser: string;
  message: string;
  timestampCreated: number;
  timestampUpdated: number;
}

export type { IMessage, IOrganizationChats };
