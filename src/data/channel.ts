interface IChannel {
  version: string;
  id: string;
  idParent: string;
  idsChildren: string[];
  name: string;
  idCreator: string;
  nameCreator: string;
  timestampCreation: number;
  statistics: {
    countPostsDay: number;
    countPostsWeek: number;
    countPostsMonth: number;
    countPostsYear: number;
    countPostsAll: number;
    countViewsDay: number;
    countViewsWeek: number;
    countViewsMonth: number;
    countViewsYear: number;
    countViewsAll: number;
  };
  statisticsSystem: {
    queueCountPosts: number[];
    queuePostsTrigger: boolean;
    timestampQueuePostsNextWorkload: number;
    queueCountViews: number[];
    queueViewsTrigger: boolean;
    timestampQueueViewsNextWorkload: number;
  };
}

export type { IChannel };
