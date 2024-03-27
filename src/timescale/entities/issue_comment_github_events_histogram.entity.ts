import { ApiModelProperty } from "@nestjs/swagger/dist/decorators/api-model-property.decorator";
import { Entity, Column } from "typeorm";

@Entity({ name: "issue_comment_github_events" })
export class DbIssueCommentGitHubEventsHistogram {
  @ApiModelProperty({
    description: "Timestamp representing histogram bucket day",
    example: "2022-08-28 22:04:29.000000",
  })
  @Column({
    type: "timestamp without time zone",
    select: false,
    insert: false,
  })
  public bucket: Date;

  @ApiModelProperty({
    description: "Number of issue comments created in day bucket",
    example: 4,
    type: "integer",
  })
  @Column({
    type: "integer",
    select: false,
    insert: false,
  })
  public issue_comments_count: number;

  @ApiModelProperty({
    description: "Number of all pr/issue comments created in day bucket",
    example: 30,
    type: "integer",
  })
  @Column({
    type: "integer",
    select: false,
    insert: false,
  })
  public all_comments: number;

  @ApiModelProperty({
    description: "Number of pr/issue comments in day bucket by users with the 'collaborator' assocoation",
    example: 6,
    type: "integer",
  })
  @Column({
    type: "integer",
    select: false,
    insert: false,
  })
  public collaborator_associated_comments: number;

  @ApiModelProperty({
    description: "Number of pr/issue comments created in day bucket by users with the 'contributor' assocoation",
    example: 6,
    type: "integer",
  })
  @Column({
    type: "integer",
    select: false,
    insert: false,
  })
  public contributor_associated_comments: number;

  @ApiModelProperty({
    description: "Number of pr/issue comments created in day bucket by users with the 'member' assocoation",
    example: 1,
    type: "integer",
  })
  @Column({
    type: "integer",
    select: false,
    insert: false,
  })
  public member_associated_comments: number;

  @ApiModelProperty({
    description: "Number of pr/issue comments created in day bucket by users with the 'none' assocoation",
    example: 1,
    type: "integer",
  })
  @Column({
    type: "integer",
    select: false,
    insert: false,
  })
  public non_associated_comments: number;

  @ApiModelProperty({
    description: "Number of pr/issue comments in day bucket by users with the 'owner' assocoation",
    example: 6,
    type: "integer",
  })
  @Column({
    type: "integer",
    select: false,
    insert: false,
  })
  public owner_associated_comments: number;

  @ApiModelProperty({
    description: "Number of pr comments created in day bucket",
    example: 15,
    type: "integer",
  })
  @Column({
    type: "integer",
    select: false,
    insert: false,
  })
  public pr_comments: number;

  @ApiModelProperty({
    description: "Number of issue comments created in day bucket",
    example: 15,
    type: "integer",
  })
  @Column({
    type: "integer",
    select: false,
    insert: false,
  })
  public issue_comments: number;
}

@Entity({ name: "issue_comment_github_events" })
export class DbTopCommentGitHubEventsHistogram {
  @ApiModelProperty({
    description: "Timestamp representing histogram bucket day",
    example: "2022-08-28 22:04:29.000000",
  })
  @Column({
    type: "timestamp without time zone",
    select: false,
    insert: false,
  })
  public bucket: Date;

  @ApiModelProperty({
    description: "Number of forks in day bucket",
    example: 4,
    type: "integer",
  })
  @Column({
    type: "integer",
    select: false,
    insert: false,
  })
  public comment_count: number;

  @ApiModelProperty({
    description: "Name of repo",
    example: "open-sauced/api",
  })
  @Column({
    type: "text",
    select: false,
    insert: false,
  })
  public repo_name: string;
}
