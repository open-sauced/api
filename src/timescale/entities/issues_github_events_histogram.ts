import { ApiModelProperty } from "@nestjs/swagger/dist/decorators/api-model-property.decorator";
import { Type } from "class-transformer";
import { IsDate, IsInt } from "class-validator";
import { Entity, Column } from "typeorm";

@Entity({ name: "issues_github_events" })
export class DbIssuesGitHubEventsHistogram {
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
    description: "Number of issue created in day bucket",
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
  public issue_count: number;

  @ApiModelProperty({
    description: "Number of issues opened in bucket",
    example: 22,
    type: "integer",
  })
  @Type(() => Number)
  @IsInt()
  @Column({
    type: "integer",
    select: false,
    insert: false,
  })
  public opened_issues: number;

  @ApiModelProperty({
    description: "Number of issues closed in bucket",
    example: 11,
    type: "integer",
  })
  @Type(() => Number)
  @IsInt()
  @Column({
    type: "integer",
    select: false,
    insert: false,
  })
  public closed_issues: number;

  @ApiModelProperty({
    description: "The average number of days to close an issue over the time period",
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
  public issue_velocity = 0;
}
