import { ApiModelProperty } from "@nestjs/swagger/dist/decorators/api-model-property.decorator";
import { Column, Entity } from "typeorm";

@Entity({ name: "user_list_contributors" })
export class DbContributionStatTimeframe {
  @ApiModelProperty({
    description: "The ISO timestamp for the given time bucket",
    example: "2024-01-08T00:00:00.000Z",
    type: "string",
  })
  @Column({
    type: "string",
    select: false,
    insert: false,
  })
  bucket: string;

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
    description: "Number of PRs created within the time range",
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
    description: "Number of PRs reviewed within the time range",
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
    description: "Number of issues within the time range",
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
    description: "Number of commit comments within the time range",
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
    description: "Number of issue comments within the time range",
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
    description: "Number of pr review comments within the time range",
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
    description: "Number of total comments within the time range",
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
    description: "Number of total contributions for a user login",
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
