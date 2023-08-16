import {
  Entity,
  BaseEntity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from "typeorm";

import {
  ApiModelProperty,
  ApiModelPropertyOptional,
} from "@nestjs/swagger/dist/decorators/api-model-property.decorator";
import { ApiHideProperty } from "@nestjs/swagger";
import { DbUser } from "../user.entity";
import { DbUserHighlightReaction } from "./user-highlight-reaction.entity";

@Entity({ name: "user_highlights" })
export class DbUserHighlight extends BaseEntity {
  @ApiModelProperty({
    description: "User Highlight identifier",
    example: 237133,
  })
  @PrimaryColumn("bigint")
  public id!: number;

  @ApiModelProperty({
    description: "User identifier",
    example: 237133,
  })
  @Column("bigint")
  public user_id: number;

  @ApiModelProperty({
    description: "Highlight Pull Request URL",
    example: "github.com/open-sauced/insights/pull/1",
  })
  @Column("text")
  public url?: string;

  @ApiModelProperty({
    description: "Highlight Title",
    example: "My First PR!",
  })
  @Column("text")
  public title?: string;

  @ApiModelProperty({
    description: "Highlight Text",
    example: `
    I made my first open source pull request!

    github.com/open-sauced/insights/pull/1`,
  })
  @Column("text")
  public highlight: string;

  @ApiModelProperty({
    description: "Highlight type",
    example: "pull_request",
  })
  @Column("text")
  public type: string;

  @ApiModelProperty({
    description: "Whether the highlight is pinned to the top",
    example: false,
  })
  @Column({
    type: "boolean",
    default: false,
  })
  public pinned?: boolean;

  @ApiModelProperty({
    description: "Whether the highlight is featured or not",
    example: false,
  })
  @Column({
    type: "boolean",
    default: false,
  })
  public featured?: boolean;

  @ApiModelPropertyOptional({
    description: "Timestamp representing highlight creation date",
    example: "2023-01-19 13:24:51.000000",
  })
  @CreateDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public created_at?: Date;

  @ApiModelPropertyOptional({
    description: "Timestamp representing highlight updated date",
    example: "2023-01-19 13:24:51.000000",
  })
  @UpdateDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public updated_at?: Date;

  @ApiModelPropertyOptional({
    description: "Timestamp representing highlight deletion date",
    example: "2023-01-19 13:24:51.000000",
  })
  @DeleteDateColumn({ type: "timestamp without time zone" })
  public deleted_at?: Date;

  @ApiModelPropertyOptional({
    description: "Timestamp representing highlight shipped date",
    example: "2023-01-19 13:24:51.000000",
  })
  @Column({ type: "timestamp without time zone" })
  public shipped_at?: Date;

  @ApiModelProperty({
    description: "Highlight Repo Full Name",
    example: "open-sauced/insights",
  })
  @Column({
    type: "text",
    select: false,
    insert: false,
  })
  public full_name?: string;

  @ApiModelProperty({
    description: "Highlight User Full Name",
    example: "Brian Douglas",
  })
  @Column({
    type: "text",
    select: false,
    insert: false,
  })
  public name?: string;

  @ApiModelProperty({
    description: "Highlight User Login",
    example: "bdougie",
  })
  @Column({
    type: "text",
    select: false,
    insert: false,
  })
  public login?: string;

  @ApiModelProperty({
    description: "An array of full-names of tagged repositories",
    example: ["open-sauced/insights", "open-sauced/ai"],
    type: [String],
    isArray: true,
  })
  @Column({
    type: "varchar",
    array: true,
    default: "{}",
  })
  public taggedRepos: string[];

  @ApiHideProperty()
  @ManyToOne(() => DbUser, (user) => user.highlights)
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
  })
  public user: DbUser;

  @ApiHideProperty()
  @OneToMany(() => DbUserHighlightReaction, (highlightReaction) => highlightReaction.highlight)
  @JoinColumn({
    name: "highlight_id",
    referencedColumnName: "id",
  })
  public reactions: DbUserHighlightReaction[];
}
