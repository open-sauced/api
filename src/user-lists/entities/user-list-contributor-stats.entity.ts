import { Column, Entity } from "typeorm";
import { ApiModelProperty } from "@nestjs/swagger/dist/decorators/api-model-property.decorator";

@Entity({ name: "user_list_contributors" })
export class DbUserListContributorStat {
  @ApiModelProperty({
    description: "User list collaborator's login",
    example: "bdougie",
  })
  @Column({
    type: "text",
    select: false,
    insert: false,
  })
  public login?: string;

  commits: number;
  prsCreated: number;
  prsReviewed: number;
  issuesCreated: number;
  comments: number;
}
