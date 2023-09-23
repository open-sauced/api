import { ApiModelProperty } from "@nestjs/swagger/dist/decorators/api-model-property.decorator";
import { Column, Entity } from "typeorm";

@Entity({ name: "user_list_contributors" })
export class DbContributionStatTimeframe {
  @ApiModelProperty({
    description: "The ISO timestamp of the start of the time frame",
    example: 0,
    type: "string",
  })
  @Column({
    type: "string",
    select: false,
    insert: false,
  })
  timeStart: string;

  @ApiModelProperty({
    description: "The ISO timestamp of the end of the time frame",
    example: 0,
    type: "string",
  })
  @Column({
    type: "string",
    select: false,
    insert: false,
  })
  timeEnd: string;

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
