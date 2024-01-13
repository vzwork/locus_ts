interface IPost {
  version: string;
  type: string;
  timestampCreation: number;
  id: string;
  idCreator: string;
  nameCreator: string;
  countViews: number;
  countWarnings: number;
  countComments: number;
  data: IDataQuote | IDataArticle | IDataVideo | IDataPhoto;
  navigation: {
    idChannelOrigin: string;
    nameChannelOrigin: string;
    idChannelOriginParent: string;
    nameChannelOriginParent: string;
    idChannelPossibleRebalance: string;
    idsChannelLocationDay: string[];
    idsChannelLocationWeek: string[];
    idsChannelLocationMonth: string[];
    idsChannelLocationYear: string[];
    idsChannelLocationAll: string[];
    queueIdsChannelLocation: string[][];
  };
  statistics: {
    countPositiveDay: number;
    countPositiveWeek: number;
    countPositiveMonth: number;
    countPositiveYear: number;
    countPositiveAll: number;
    countStarsDay: number;
    countStarsWeek: number;
    countStarsMonth: number;
    countStarsYear: number;
    countStarsAll: number;
    countBooksDay: number;
    countBooksWeek: number;
    countBooksMonth: number;
    countBooksYear: number;
    countBooksAll: number;
  };
  systemStatistics: {
    queueCountBooks: number[];
    workloadQueueCountBooks: boolean;
    timestampWorkloadNextBooks: number | null;
    queueCountStars: number[];
    workloadQueueCountStars: boolean;
    timestampWorkloadNextStars: number | null;
    queueCountPositive: number[];
    workloadQueueCountPositive: boolean;
    timestampWorkloadNextPositive: number | null;
  };
}

interface IDataQuote {
  caption: string;
}

interface IDataArticle {
  caption: string;
  url: string;
}

interface IDataVideo {
  caption: string;
  id: string;
}

interface IDataPhoto {
  caption: string;
  url: string;
}

export type { IPost };
