import { ApiModelProperty } from "@nestjs/swagger/dist/decorators/api-model-property.decorator";
import { Entity, Column } from "typeorm";

@Entity({ name: "pull_request_review_github_events" })
export class DbPullRequestReviewGitHubEventsHistogram {
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
    description: "Number of all Pr reviews in day bucket",
    example: 4,
    type: "integer",
  })
  @Column({
    type: "integer",
    select: false,
    insert: false,
  })
  public all_reviews: number;

  @ApiModelProperty({
    description: "Number of Pr reviews in day bucket for 'collaborator' associated users",
    example: 4,
    type: "integer",
  })
  @Column({
    type: "integer",
    select: false,
    insert: false,
  })
  public collaborator_associated_reviews: number;

  @ApiModelProperty({
    description: "Number of Pr reviews in day bucket for 'contributor' associated users",
    example: 4,
    type: "integer",
  })
  @Column({
    type: "integer",
    select: false,
    insert: false,
  })
  public contributor_associated_reviews: number;

  @ApiModelProperty({
    description: "Number of Pr reviews in day bucket for 'member' associated users",
    example: 4,
    type: "integer",
  })
  @Column({
    type: "integer",
    select: false,
    insert: false,
  })
  public member_associated_reviews: number;

  @ApiModelProperty({
    description: "Number of Pr reviews in day bucket for 'none' associated users",
    example: 4,
    type: "integer",
  })
  @Column({
    type: "integer",
    select: false,
    insert: false,
  })
  public non_associated_reviews: number;

  @ApiModelProperty({
    description: "Number of Pr reviews in day bucket for 'owner' associated users",
    example: 4,
    type: "integer",
  })
  @Column({
    type: "integer",
    select: false,
    insert: false,
  })
  public owner_associated_reviews: number;

  @ApiModelProperty({
    description: "Number of Pr reviews in day bucket that approved a pr",
    example: 4,
    type: "integer",
  })
  @Column({
    type: "integer",
    select: false,
    insert: false,
  })
  public approved_reviews: number;

  @ApiModelProperty({
    description: "Number of Pr reviews in day bucket that commented on a pr",
    example: 4,
    type: "integer",
  })
  @Column({
    type: "integer",
    select: false,
    insert: false,
  })
  public commented_reviews: number;

  @ApiModelProperty({
    description: "Number of Pr reviews in day bucket that requested changes for a pr",
    example: 4,
    type: "integer",
  })
  @Column({
    type: "integer",
    select: false,
    insert: false,
  })
  public changes_requested_reviews: number;
}
