interface ICompetency {
  version: string;
  idUser: string;
  idChannel: string;
  idsStars: string[];
  idsBooks: string[];
  minutesSpent: number;
  competencyInheritedChildren: number;
  competencyInheritedParent: number;
  competencyIntrinsic: number;
  competencyCumulative: number;
}

enum CompetencyRates {
  star = 8,
  book = 8,
  minutes15 = 1,
}

export { CompetencyRates };
export type { ICompetency };
