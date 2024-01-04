import { ApiModelProperty } from "@nestjs/swagger/dist/decorators/api-model-property.decorator";
import { Entity, Column } from "typeorm";

@Entity({ name: "watch_github_events" })
export class DbWatchGitHubEventsHistogram {
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
    description: "Number of stars in day bucket",
    example: 4,
    type: "integer",
  })
  @Column({
    type: "integer",
    select: false,
    insert: false,
  })
  public star_count: number;
}
