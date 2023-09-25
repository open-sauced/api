import { ApiModelProperty } from "@nestjs/swagger/dist/decorators/api-model-property.decorator";
import { Column, Entity } from "typeorm";

@Entity({ name: "user_list_contributors" })
export class DbContributionStatTimeframe {
  @ApiModelProperty({
    description: "The ISO timestamp for the start of the time frame",
    example: "2023-08-26T23:55:49.204Z",
    type: "string",
  })
  @Column({
    type: "string",
    select: false,
    insert: false,
  })
  time_start: string;

  @ApiModelProperty({
    description: "The ISO timestamp for the end of the time frame",
    example: "2023-08-26T23:55:49.204Z",
    type: "string",
  })
  @Column({
    type: "string",
    select: false,
    insert: false,
  })
  time_end: string;

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
    description: "Number of PRs created associated with a user login",
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
    description: "Number of PRs reviewed by a user login",
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
    description: "Number of issues created by a user login",
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
