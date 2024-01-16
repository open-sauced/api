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
    description: "Number of commits for login within the time range",
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
    description: "Number of PRs created for login within the time range",
    example: 0,
    type: "integer",
  })
  @Column({
    type: "bigint",
    select: false,
    insert: false,
  })
  prs_created: number;

  @ApiModelProperty({
    description: "Number of PRs reviewed for login within the time range",
    example: 0,
    type: "integer",
  })
  @Column({
    type: "bigint",
    select: false,
    insert: false,
  })
  prs_reviewed: number;

  @ApiModelProperty({
    description: "Number of issues created for login within the time range",
    example: 0,
    type: "integer",
  })
  @Column({
    type: "bigint",
    select: false,
    insert: false,
  })
  issues_created: number;

  @ApiModelProperty({
    description: "Number of commit comments for login within the time range",
    example: 0,
    type: "integer",
  })
  @Column({
    type: "bigint",
    select: false,
    insert: false,
  })
  commit_comments: number;

  @ApiModelProperty({
    description: "Number of issue comments for login within the time range",
    example: 0,
    type: "integer",
  })
  @Column({
    type: "bigint",
    select: false,
    insert: false,
  })
  issue_comments: number;

  @ApiModelProperty({
    description: "Number of pr review comments for login within the time range",
    example: 0,
    type: "integer",
  })
  @Column({
    type: "bigint",
    select: false,
    insert: false,
  })
  pr_review_comments: number;

  @ApiModelProperty({
    description: "Number of total comments for login within the time range",
    example: 0,
    type: "integer",
  })
  @Column({
    type: "bigint",
    select: false,
    insert: false,
  })
  comments: number;

  @ApiModelProperty({
    description: "Number of total contributions for a login within the time range",
    example: 0,
    type: "integer",
  })
  @Column({
    type: "bigint",
    select: false,
    insert: false,
  })
  total_contributions: number;
}
