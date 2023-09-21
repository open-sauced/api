import { Entity } from "typeorm";

@Entity({ name: "user_list_contributors" })
export class DbContributionStatTimeframe {
  timeStart: string;
  timeEnd: string;

  commits: number;
  prsCreated: number;
  prsReviewed: number;
  issuesCreated: number;
  comments: number;
}
