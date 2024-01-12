import { ApiModelProperty } from "@nestjs/swagger/dist/decorators/api-model-property.decorator";
import { Type } from "class-transformer";
import { IsDate, IsInt } from "class-validator";
import { Entity, Column } from "typeorm";

@Entity({ name: "pull_request_github_events" })
export class DbPullRequestGitHubEventsHistogram {
  @ApiModelProperty({
    description: "Timestamp representing histogram bucket day",
    example: "2022-08-28 22:04:29.000000",
  })
  @Type(() => Date)
  @IsDate()
  @Column({
    type: "timestamp without time zone",
    select: false,
    insert: false,
  })
  public bucket: Date;

  @ApiModelProperty({
    description: "The width in days of the individual time bucket",
    example: 30,
  })
  @Type(() => Number)
  @IsInt()
  @Column({
    type: "integer",
    select: false,
    insert: false,
  })
  public interval: number;

  @ApiModelProperty({
    description: "Number of Prs created in day bucket",
    example: 4,
    type: "integer",
  })
  @Type(() => Number)
  @IsInt()
  @Column({
    type: "integer",
    select: false,
    insert: false,
  })
  public pr_count = 0;

  @ApiModelProperty({
    description: "Number of accepted/merged Prs in bucket",
    example: 4,
    type: "integer",
  })
  @Type(() => Number)
  @IsInt()
  @Column({
    type: "integer",
    select: false,
    insert: false,
  })
  public accepted_prs = 0;

  @ApiModelProperty({
    description: "Number of open, unmerged Prs in bucket",
    example: 5,
    type: "integer",
  })
  @Type(() => Number)
  @IsInt()
  @Column({
    type: "integer",
    select: false,
    insert: false,
  })
  public open_prs = 0;

  @ApiModelProperty({
    description: "Number of closed, unmerged Prs in bucket",
    example: 1,
    type: "integer",
  })
  @Type(() => Number)
  @IsInt()
  @Column({
    type: "integer",
    select: false,
    insert: false,
  })
  public closed_prs = 0;

  @ApiModelProperty({
    description: "Number of drafted, unmerged Prs in bucket",
    example: 2,
    type: "integer",
  })
  @Type(() => Number)
  @IsInt()
  @Column({
    type: "integer",
    select: false,
    insert: false,
  })
  public draft_prs = 0;

  @ApiModelProperty({
    description: "Number of active, unmerged Prs in bucket",
    example: 2,
    type: "integer",
  })
  @Type(() => Number)
  @IsInt()
  @Column({
    type: "integer",
    select: false,
    insert: false,
  })
  public active_prs = 0;

  @ApiModelProperty({
    description: "Number of Prs marked as spam within bucket",
    example: 1,
    type: "integer",
  })
  @Type(() => Number)
  @IsInt()
  @Column({
    type: "integer",
    select: false,
    insert: false,
  })
  public spam_prs = 0;

  @ApiModelProperty({
    description: "The average number of days to merge a PR over the time period",
    example: 4,
    type: "integer",
  })
  @Type(() => Number)
  @IsInt()
  @Column({
    type: "integer",
    select: false,
    insert: false,
  })
  public pr_velocity = 0;
}
