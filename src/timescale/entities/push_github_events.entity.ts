import {
  ApiModelProperty,
  ApiModelPropertyOptional,
} from "@nestjs/swagger/dist/decorators/api-model-property.decorator";
import { Entity, BaseEntity, PrimaryColumn, Column, CreateDateColumn } from "typeorm";

@Entity({ name: "push_github_events" })
export class DbPushGitHubEvents extends BaseEntity {
  @ApiModelProperty({
    description: "Push event identifier",
    example: 1045024650,
    type: "integer",
  })
  @PrimaryColumn("integer")
  event_id: number;

  @ApiModelProperty({
    description: "Push actor username",
    example: "Th3nn3ss",
  })
  @Column("text")
  public push_actor_login: string;

  @ApiModelPropertyOptional({
    description: "Timestamp representing time of push",
    example: "2022-08-28 22:04:29.000000",
  })
  @CreateDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public event_time: Date;

  @ApiModelProperty({
    description: "Repo full name where pushed happened",
    example: "open-sauced/app",
  })
  @Column({
    type: "text",
    select: false,
    insert: false,
  })
  public repo_name?: string;

  @ApiModelProperty({
    description: "Number of commits in the push",
    example: 4,
    type: "integer",
  })
  @Column({ type: "bigint" })
  public push_num_commits?: number;

  @ApiModelProperty({
    description: "Name of the Git ref that was pushed to",
    example: "ref/head/main",
  })
  @Column({ type: "text" })
  public push_ref?: string;
}
