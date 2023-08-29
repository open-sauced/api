import { Entity, Column, BaseEntity, PrimaryColumn, CreateDateColumn } from "typeorm";
import {
  ApiModelProperty,
  ApiModelPropertyOptional,
} from "@nestjs/swagger/dist/decorators/api-model-property.decorator";
import { ApiHideProperty } from "@nestjs/swagger";

@Entity({ name: "pull_requests" })
export class DbPullRequest extends BaseEntity {
  @ApiModelProperty({
    description: "Pull request identifier",
    example: 1045024650,
    type: "integer",
  })
  @PrimaryColumn("integer")
  public id!: number;

  @ApiHideProperty()
  @Column({
    type: "integer",
    select: false,
  })
  public repo_id!: number;

  @ApiModelProperty({
    description: "Pull request number",
    example: 612,
    type: "integer",
  })
  @Column("integer")
  public number: number;

  @ApiModelProperty({
    description: "Pull request state",
    example: "closed",
  })
  @Column("text")
  public state: string;

  @ApiModelProperty({
    description: "Pull request is draft",
    example: false,
  })
  @Column("boolean")
  public draft: boolean;

  @ApiModelProperty({
    description: "Pull request is merged",
    example: false,
  })
  @Column("boolean")
  public merged: boolean;

  @ApiModelProperty({
    description: "Pull request is mergeable",
    example: false,
  })
  @Column("boolean")
  public mergeable: boolean;

  @ApiModelProperty({
    description: "Pull request is rebaseable",
    example: false,
  })
  @Column("boolean")
  public rebaseable: boolean;

  @ApiModelProperty({
    description: "Pull request title",
    example: "fix(cli): arg tags value with equal sign",
  })
  @Column("text")
  public title: string;

  @ApiModelProperty({
    description: "Pull request source ref",
    example: "Th3nn3ss:cli_split_kwargs",
  })
  @Column({
    type: "text",
    default: "",
  })
  public source_label?: string;

  @ApiModelProperty({
    description: "Pull request target ref",
    example: "aws:main",
  })
  @Column({
    type: "text",
    default: "",
  })
  public target_label?: string;

  @ApiModelProperty({
    description: "Pull request source branch",
    example: "main",
  })
  @Column("text")
  public source_branch?: string;

  @ApiModelProperty({
    description: "Pull request target branch",
    example: "cli_split_kwargs",
  })
  @Column("text")
  public target_branch?: string;

  @ApiModelProperty({
    description: "Pull request labels",
    example: `[
      {
        "id": 4456742596,
        "url": "https://api.github.com/repos/denoland/fresh/labels/showcase",
        "name": "showcase",
        "color": "0e8a16",
        "default": false,
        "node_id": "LA_kwDOFcV7488AAAABCaR-xA",
        "description": ""
      }
    ]`,
  })
  @Column({
    type: "text",
    select: false,
  })
  public labels?: string;

  @ApiModelProperty({
    description: "Pull request label names",
    example: `showcase`,
  })
  @Column({
    type: "text",
    select: false,
  })
  public label_names?: string[];

  @ApiModelProperty({
    description: "Pull request author username",
    example: "Th3nn3ss",
  })
  @Column("text")
  public author_login: string;

  @ApiModelProperty({
    description: "Pull request author avatar",
    example: "https://avatars.githubusercontent.com/u/25160953?v=4",
  })
  @Column("text")
  public author_avatar: string;

  @ApiModelProperty({
    description: "Pull request assignee username",
    example: null,
  })
  @Column({
    type: "text",
    default: "",
  })
  public assignee_login?: string;

  @ApiModelProperty({
    description: "Pull request assignee avatar",
    example: null,
  })
  @Column({
    type: "text",
    default: "",
  })
  public assignee_avatar?: string;

  @ApiModelPropertyOptional({
    description: "Timestamp representing pr creation date",
    example: "2022-08-28 22:04:29.000000",
  })
  @CreateDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public created_at?: Date;

  @ApiModelProperty({
    description: "Timestamp representing pr close date",
    example: "2022-08-28 22:04:29.000000",
  })
  @Column({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public closed_at?: Date;

  @ApiModelProperty({
    description: "Timestamp representing pr merge date",
    example: "2022-08-28 22:04:29.000000",
  })
  @Column({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public merged_at?: Date;

  @ApiModelProperty({
    description: "Pull request merged by username",
    example: "bdougie",
  })
  @Column("text")
  public merged_by_login?: string;

  @ApiModelProperty({
    description: "Timestamp representing repository last update",
    example: "2022-08-28 22:04:29.000000",
  })
  @Column({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public updated_at?: Date;

  @ApiModelProperty({
    description: "Timestamp representing internal last update",
    example: "2022-08-28 22:04:29.000000",
  })
  @Column({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public last_updated_at?: Date;

  @ApiModelProperty({
    description: "PR comments",
    example: 0,
    type: "integer",
  })
  @Column({ type: "bigint" })
  public comments?: number;

  @ApiModelProperty({
    description: "PR lines added",
    example: 10,
    type: "integer",
  })
  @Column({ type: "bigint" })
  public additions?: number;

  @ApiModelProperty({
    description: "PR lines deleted",
    example: 5,
    type: "integer",
  })
  @Column({ type: "bigint" })
  public deletions?: number;

  @ApiModelProperty({
    description: "PR files changed",
    example: 5,
    type: "integer",
  })
  @Column({ type: "bigint" })
  public changed_files?: number;

  @ApiModelProperty({
    description: "Pull request repo full name",
    example: "open-sauced/insights",
  })
  @Column({
    type: "text",
    select: false,
    insert: false,
  })
  public full_name?: string;
}
