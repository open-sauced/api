import {
  ApiModelProperty,
  ApiModelPropertyOptional,
} from "@nestjs/swagger/dist/decorators/api-model-property.decorator";
import { Entity, BaseEntity, PrimaryColumn, Column, CreateDateColumn } from "typeorm";

@Entity({ name: "issues_github_events" })
export class DbIssuesGitHubEvents extends BaseEntity {
  @ApiModelProperty({
    description: "Issue event identifier",
    example: 1045024650,
    type: "integer",
  })
  @PrimaryColumn("integer")
  event_id: number;

  @ApiModelProperty({
    description: "Issue number",
    example: 612,
    type: "integer",
  })
  @Column("integer")
  public issue_number: number;

  @ApiModelProperty({
    description: "Issue state",
    example: "opened",
  })
  @Column("text")
  public issue_state: string;

  @ApiModelProperty({
    description: "Issue title",
    example: "fix(cli): arg tags value with equal sign",
  })
  @Column("text")
  public issue_title: string;

  @ApiModelProperty({
    description: "Issue author username",
    example: "Th3nn3ss",
  })
  @Column("text")
  public issue_author_login: string;

  @ApiModelPropertyOptional({
    description: "Timestamp representing issue creation date",
    example: "2022-08-28 22:04:29.000000",
  })
  @CreateDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public issue_created_at?: Date;

  @ApiModelProperty({
    description: "Timestamp representing issue close date",
    example: "2022-08-28 22:04:29.000000",
  })
  @Column({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public issue_closed_at?: Date;

  @ApiModelProperty({
    description: "Timestamp representing issue last update",
    example: "2022-08-28 22:04:29.000000",
  })
  @Column({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public issue_updated_at?: Date;

  @ApiModelProperty({
    description: "Number of issue comments",
    example: 0,
    type: "integer",
  })
  @Column({ type: "bigint" })
  public issue_comments?: number;

  @ApiModelProperty({
    description: "Pull request repo full name",
    example: "open-sauced/insights",
  })
  @Column({
    type: "text",
    select: false,
    insert: false,
  })
  public repo_name?: string;
}
