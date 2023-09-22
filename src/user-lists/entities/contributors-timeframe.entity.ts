import { Entity } from "typeorm";

@Entity({ name: "user_list_contributors" })
export class DbContributorCategoryTimeframe {
  timeStart: string;
  timeEnd: string;

  all: number;
  active: number;
  new: number;
  alumni: number;
}
