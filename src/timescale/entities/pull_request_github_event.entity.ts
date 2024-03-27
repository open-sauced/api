import {
  ApiModelProperty,
  ApiModelPropertyOptional,
} from "@nestjs/swagger/dist/decorators/api-model-property.decorator";
import { Entity, BaseEntity, PrimaryColumn, Column, CreateDateColumn } from "typeorm";

@Entity({ name: "pull_request_github_events" })
export class DbPullRequestGitHubEvents extends BaseEntity {
  @ApiModelProperty({
    description: "Pull request event identifier",
    example: 1045024650,
    type: "integer",
  })
  @PrimaryColumn("integer")
  event_id: number;

  @ApiModelProperty({
    description: "Pull request number",
    example: 612,
    type: "integer",
  })
  @Column("integer")
  public pr_number: number;

  @ApiModelProperty({
    description: "Pull request state",
    example: "closed",
  })
  @Column("text")
  public pr_state: string;

  @ApiModelProperty({
    description: "Pull request is draft",
    example: false,
  })
  @Column("boolean")
  public pr_is_draft: boolean;

  @ApiModelProperty({
    description: "Pull request is merged",
    example: false,
  })
  @Column("boolean")
  public pr_is_merged: boolean;

  @ApiModelProperty({
    description: "Pull request mergeable state",
    example: "unknown",
  })
  @Column("text")
  public pr_mergeable_state: string;

  @ApiModelProperty({
    description: "Pull request is rebaseable",
    example: false,
  })
  @Column("boolean")
  public pr_is_rebaseable: boolean;

  @ApiModelProperty({
    description: "Pull request title",
    example: "fix(cli): arg tags value with equal sign",
  })
  @Column("text")
  public pr_title: string;

  @ApiModelProperty({
    description: "Pull request source ref",
    example: "Th3nn3ss:cli_split_kwargs",
  })
  @Column({
    type: "text",
    default: "",
  })
  public pr_head_label?: string;

  @ApiModelProperty({
    description: "Pull request target ref",
    example: "aws:main",
  })
  @Column({
    type: "text",
    default: "",
  })
  public pr_base_label?: string;

  @ApiModelProperty({
    description: "Pull request source branch",
    example: "cli_split_kwargs",
  })
  @Column("text")
  public pr_head_ref?: string;

  @ApiModelProperty({
    description: "Pull request target branch",
    example: "main",
  })
  @Column("text")
  public pr_base_ref?: string;

  @ApiModelProperty({
    description: "Pull request author username",
    example: "Th3nn3ss",
  })
  @Column("text")
  public pr_author_login: string;

  @ApiModelPropertyOptional({
    description: "Timestamp representing pr creation date",
    example: "2022-08-28 22:04:29.000000",
  })
  @CreateDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public pr_created_at?: Date;

  @ApiModelProperty({
    description: "Timestamp representing pr close date",
    example: "2022-08-28 22:04:29.000000",
  })
  @Column({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public pr_closed_at?: Date;

  @ApiModelProperty({
    description: "Timestamp representing pr merge date",
    example: "2022-08-28 22:04:29.000000",
  })
  @Column({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public pr_merged_at?: Date;

  @ApiModelProperty({
    description: "Timestamp representing repository last update",
    example: "2022-08-28 22:04:29.000000",
  })
  @Column({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public pr_updated_at?: Date;

  @ApiModelProperty({
    description: "PR comments",
    example: 0,
    type: "integer",
  })
  @Column({ type: "bigint" })
  public pr_comments?: number;

  @ApiModelProperty({
    description: "PR lines added",
    example: 10,
    type: "integer",
  })
  @Column({ type: "bigint" })
  public pr_additions?: number;

  @ApiModelProperty({
    description: "PR lines deleted",
    example: 5,
    type: "integer",
  })
  @Column({ type: "bigint" })
  public pr_deletions?: number;

  @ApiModelProperty({
    description: "PR files changed",
    example: 5,
    type: "integer",
  })
  @Column({ type: "bigint" })
  public pr_changed_files?: number;

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

  @ApiModelProperty({
    description: "Number of commits in the PR",
    example: 4,
    type: "integer",
  })
  @Column({ type: "bigint" })
  public pr_commits?: number;
}
