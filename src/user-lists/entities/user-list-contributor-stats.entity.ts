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

  @ApiModelProperty({
    description: "Number of commits associated with a user login",
    example: 0,
    type: "integer",
  })
  @Column({
    type: "bigint",
    select: false,
    insert: false,
  })
  commits: number;

  @ApiModelProperty({
    description: "Number of PRs associated with a user login",
    example: 0,
    type: "integer",
  })
  @Column({
    type: "bigint",
    select: false,
    insert: false,
  })
  prsCreated: number;

  @ApiModelProperty({
    description: "Number of PRs reviewed by a user login",
    example: 0,
    type: "integer",
  })
  @Column({
    type: "bigint",
    select: false,
    insert: false,
  })
  prsReviewed: number;

  @ApiModelProperty({
    description: "Number of issues created by a user login",
    example: 0,
    type: "integer",
  })
  @Column({
    type: "bigint",
    select: false,
    insert: false,
  })
  issuesCreated: number;

  @ApiModelProperty({
    description: "Number of comments associated with a user login",
    example: 0,
    type: "integer",
  })
  @Column({
    type: "bigint",
    select: false,
    insert: false,
  })
  comments: number;
}
