import { ApiModelProperty } from "@nestjs/swagger/dist/decorators/api-model-property.decorator";
import { Entity, Column } from "typeorm";

@Entity({ name: "pull_request_review_comment_github_events" })
export class DbPullRequestReviewCommentGitHubEventsHistogram {
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
    description: "Number of Pr review comments created in day bucket",
    example: 4,
    type: "integer",
  })
  @Column({
    type: "integer",
    select: false,
    insert: false,
  })
  public all_review_comments: number;

  @ApiModelProperty({
    description: "Number of Pr reviews comments in day bucket for 'collaborator' associated users",
    example: 4,
    type: "integer",
  })
  @Column({
    type: "integer",
    select: false,
    insert: false,
  })
  public collaborator_associated_review_comments: number;

  @ApiModelProperty({
    description: "Number of Pr reviews comments in day bucket for 'contributor' associated users",
    example: 4,
    type: "integer",
  })
  @Column({
    type: "integer",
    select: false,
    insert: false,
  })
  public contributor_associated_review_comments: number;

  @ApiModelProperty({
    description: "Number of Pr review comments in day bucket for 'member' associated users",
    example: 4,
    type: "integer",
  })
  @Column({
    type: "integer",
    select: false,
    insert: false,
  })
  public member_associated_review_comments: number;

  @ApiModelProperty({
    description: "Number of Pr review comments in day bucket for 'none' associated users",
    example: 4,
    type: "integer",
  })
  @Column({
    type: "integer",
    select: false,
    insert: false,
  })
  public non_associated_review_comments: number;

  @ApiModelProperty({
    description: "Number of Pr review comments in day bucket for 'owner' associated users",
    example: 4,
    type: "integer",
  })
  @Column({
    type: "integer",
    select: false,
    insert: false,
  })
  public owner_associated_review_comments: number;
}
