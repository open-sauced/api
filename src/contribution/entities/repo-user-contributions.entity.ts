import { Column, Entity } from "typeorm";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

@Entity({ name: "repo_user_contributions" })
export class DbRepoLoginContributions {
  @ApiPropertyOptional({
    description: "User list collaborator's login",
    example: "bdougie",
  })
  @Column({
    type: "text",
    select: false,
    insert: false,
  })
  public login?: string;

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
