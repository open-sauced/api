import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  Relation,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ApiProperty, ApiPropertyOptional, ApiHideProperty } from "@nestjs/swagger";
import { DbEmoji } from "../../emoji/entities/emoji.entity";
import { DbUser } from "../user.entity";
import { DbUserHighlight } from "./user-highlight.entity";

@Entity({ name: "user_highlight_reactions" })
export class DbUserHighlightReaction {
  @ApiProperty({
    description: "Reaction identifier",
    example: "uuid-v4",
  })
  @PrimaryGeneratedColumn()
  public id!: string;

  @ApiProperty({
    description: "Highlight identifier",
    example: 71359796,
    type: "integer",
  })
  @Column({
    type: "integer",
    select: false,
  })
  public highlight_id!: number;

  @ApiProperty({
    description: "User identifier",
    example: 237133,
    type: "integer",
  })
  @Column({
    type: "integer",
    select: false,
  })
  public user_id!: number;

  @ApiProperty({
    description: "Emoji identifier",
    example: "uuid-v4",
  })
  @Column({
    type: "text",
    select: false,
  })
  public emoji_id!: string;

  @ApiPropertyOptional({
    description: "Timestamp representing highlight reaction creation",
    example: "2016-10-19 13:24:51.000000",
  })
  @CreateDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
    select: false,
  })
  public created_at?: Date;

  @ApiPropertyOptional({
    description: "Timestamp representing highlight reaction last update",
    example: "2022-08-28 22:04:29.000000",
  })
  @UpdateDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
    select: false,
  })
  public updated_at?: Date;

  @ApiHideProperty()
  @DeleteDateColumn({ type: "timestamp without time zone" })
  public deleted_at?: Date;

  // virtual columns
  @ApiProperty({ type: "integer" })
  @Column({
    type: "integer",
    select: false,
    insert: false,
  })
  public reaction_count?: number;

  @ApiHideProperty()
  @ManyToOne(() => DbUserHighlightReaction, (reaction) => reaction.highlight)
  @JoinColumn({
    name: "highlight_id",
    referencedColumnName: "id",
  })
  highlight?: Relation<DbUserHighlight>;

  @ApiHideProperty()
  @ManyToOne(() => DbUserHighlightReaction, (reaction) => reaction.user)
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
  })
  user?: Relation<DbUser>;

  @ApiHideProperty()
  @ManyToOne(() => DbUserHighlightReaction, (reaction) => reaction.emoji)
  @JoinColumn({
    name: "emoji_id",
    referencedColumnName: "id",
  })
  emoji?: Relation<DbEmoji>;
}
