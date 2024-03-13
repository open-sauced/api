import {
  ApiModelProperty,
  ApiModelPropertyOptional,
} from "@nestjs/swagger/dist/decorators/api-model-property.decorator";
import { Entity, Column, BaseEntity, PrimaryColumn, CreateDateColumn } from "typeorm";

@Entity({ name: "fork_github_events" })
export class DbForkGitHubEvents extends BaseEntity {
  @ApiModelProperty({
    description: "Fork event identifier",
    example: 1045024650,
    type: "integer",
  })
  @PrimaryColumn("integer")
  event_id: number;

  @ApiModelProperty({
    description: "Fork actor username",
    example: "Th3nn3ss",
  })
  @Column("text")
  public actor_login: string;

  @ApiModelPropertyOptional({
    description: "Timestamp representing time of fork",
    example: "2022-08-28 22:04:29.000000",
  })
  @CreateDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public event_time: Date;

  @ApiModelProperty({
    description: "Repo full name that was forked from",
    example: "open-sauced/app",
  })
  @Column({
    type: "text",
    select: false,
    insert: false,
  })
  public repo_name?: string;
}
