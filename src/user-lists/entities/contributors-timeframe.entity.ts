import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity } from "typeorm";

@Entity({ name: "user_list_contributors" })
export class DbContributorCategoryTimeframe {
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
    description: "Number of all contributors (active, new, and alumni)",
    example: 0,
    type: "integer",
  })
  @Column({
    type: "bigint",
    select: false,
    insert: false,
  })
  all: number;

  @ApiProperty({
    description: "Number of contributors who contributed in current time frame and previous time frame",
    example: 0,
    type: "integer",
  })
  @Column({
    type: "bigint",
    select: false,
    insert: false,
  })
  active: number;

  @ApiProperty({
    description:
      "Number of contributors who are new to contributing (contributed in current time frame but not the previous time frame)",
    example: 0,
    type: "integer",
  })
  @Column({
    type: "bigint",
    select: false,
    insert: false,
  })
  new: number;

  @ApiProperty({
    description:
      "Number of contributors who did not contribute in current time frame but did in the previous time frame",
    example: 0,
    type: "integer",
  })
  @Column({
    type: "bigint",
    select: false,
    insert: false,
  })
  alumni: number;
}
