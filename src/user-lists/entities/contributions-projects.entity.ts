import { ApiModelProperty } from "@nestjs/swagger/dist/decorators/api-model-property.decorator";
import { Column, Entity } from "typeorm";

@Entity({ name: "user_list_contributors" })
export class DbContributionsProjects {
  @ApiModelProperty({
    description: "The org/repo name",
    example: "open-sauced/api",
    type: "string",
  })
  @Column({
    type: "string",
    select: false,
    insert: false,
  })
  repo_name: string;

  @ApiModelProperty({
    description: "Number of commits within the time range",
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
    description: "Number of PRs created for the project within the time range",
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
    description: "Number of PRs reviewed for the project within the time range",
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
    description: "Number of issues for the project within the time range",
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
    description: "Number of commit comments for the project within the time range",
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
    description: "Number of issue comments for the project within the time range",
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
    description: "Number of pr review comments for the project within the time range",
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
    description: "Number of total comments for the project within the time range",
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
    description: "Number of total contributions for the project within the time range",
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
