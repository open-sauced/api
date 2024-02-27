import { ApiModelProperty } from "@nestjs/swagger/dist/decorators/api-model-property.decorator";
import { Entity, Column } from "typeorm";

@Entity({ name: "fork_github_events" })
export class DbForkGitHubEventsHistogram {
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
  public forks_count: number;
}

@Entity({ name: "fork_github_events" })
export class DbTopForkGitHubEventsHistogram {
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
  public fork_count: number;

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
