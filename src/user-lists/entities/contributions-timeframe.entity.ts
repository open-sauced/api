import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity } from "typeorm";

@Entity({ name: "user_list_contributors" })
export class DbContributionStatTimeframe {
  @ApiProperty({
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

  @ApiProperty({
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

  @ApiProperty({
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

  @ApiProperty({
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

  @ApiProperty({
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

  @ApiProperty({
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

  @ApiProperty({
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
