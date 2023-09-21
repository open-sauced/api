import { Entity } from "typeorm";

@Entity({ name: "user_list_contributors" })
export class DbContributionsProjects {
  orgId: string;
  projectId: string;
  contributions: number;
}
