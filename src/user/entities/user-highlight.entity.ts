import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  Relation,
  JoinColumn,
} from "typeorm";

import { ApiHideProperty, ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { DbUser } from "../user.entity";
import { DbUserHighlightReaction } from "./user-highlight-reaction.entity";

@Entity({ name: "user_highlights" })
export class DbUserHighlight extends BaseEntity {
  @ApiProperty({
    description: "User Highlight identifier",
    example: 237133,
    type: "integer",
  })
  @PrimaryGeneratedColumn({ type: "bigint" })
  public id!: number;

  @ApiProperty({
    description: "User identifier",
    example: 237133,
    type: "integer",
  })
  @Column("bigint")
  public user_id: number;

  @ApiProperty({
    description: "Highlight Pull Request URL",
    example: "github.com/open-sauced/insights/pull/1",
  })
  @Column("text")
  public url?: string;

  @ApiProperty({
    description: "Highlight Title",
    example: "My First PR!",
  })
  @Column("text")
  public title?: string;

  @ApiProperty({
    description: "Highlight Text",
    example: `
    I made my first open source pull request!

    github.com/open-sauced/insights/pull/1`,
  })
  @Column("text")
  public highlight: string;

  @ApiProperty({
    description: "Highlight type",
    example: "pull_request",
  })
  @Column("text")
  public type: string;

  @ApiProperty({
    description: "Whether the highlight is pinned to the top",
    example: false,
  })
  @Column({
    type: "boolean",
    default: false,
  })
  public pinned?: boolean;

  @ApiProperty({
    description: "Whether the highlight is featured or not",
    example: false,
  })
  @Column({
    type: "boolean",
    default: false,
  })
  public featured?: boolean;

  @ApiPropertyOptional({
    description: "Timestamp representing highlight creation date",
    example: "2023-01-19 13:24:51.000000",
  })
  @CreateDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public created_at?: Date;

  @ApiPropertyOptional({
    description: "Timestamp representing highlight updated date",
    example: "2023-01-19 13:24:51.000000",
  })
  @UpdateDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public updated_at?: Date;

  @ApiPropertyOptional({
    description: "Timestamp representing highlight deletion date",
    example: "2023-01-19 13:24:51.000000",
  })
  @DeleteDateColumn({ type: "timestamp without time zone" })
  public deleted_at?: Date;

  @ApiPropertyOptional({
    description: "Timestamp representing highlight shipped date",
    example: "2023-01-19 13:24:51.000000",
  })
  @Column({ type: "timestamp without time zone" })
  public shipped_at?: Date;

  @ApiProperty({
    description: "Highlight Repo Full Name",
    example: "open-sauced/insights",
  })
  @Column({
    type: "text",
    select: false,
    insert: false,
  })
  public full_name?: string;

  @ApiProperty({
    description: "Highlight User Full Name",
    example: "Brian Douglas",
  })
  @Column({
    type: "text",
    select: false,
    insert: false,
  })
  public name?: string;

  @ApiProperty({
    description: "Highlight User Login",
    example: "bdougie",
  })
  @Column({
    type: "text",
    select: false,
    insert: false,
  })
  public login?: string;

  @ApiProperty({
    description: "An array of full-names of tagged repositories",
    example: ["open-sauced/insights", "open-sauced/ai"],
    type: "string",
    isArray: true,
  })
  @Column({
    type: "varchar",
    array: true,
    default: "{}",
  })
  public tagged_repos: string[];

  @ApiHideProperty()
  @ManyToOne(() => DbUser, (user) => user.highlights)
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
  })
  public user: Relation<DbUser>;

  @ApiHideProperty()
  @OneToMany(() => DbUserHighlightReaction, (highlightReaction) => highlightReaction.highlight)
  @JoinColumn({
    name: "highlight_id",
    referencedColumnName: "id",
  })
  public reactions: Relation<DbUserHighlightReaction[]>;
}
