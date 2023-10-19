import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from "typeorm";
import { ApiHideProperty, ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import { DbUserHighlightReaction } from "../../user/entities/user-highlight-reaction.entity";

@Entity({ name: "emojis" })
export class DbEmoji {
  @ApiProperty({
    description: "Emoji identifier",
    example: "uuid-v4",
  })
  @PrimaryGeneratedColumn()
  public id!: string;

  @ApiProperty({
    description: "Emoji Name",
    example: "100",
  })
  @Column({ type: "text" })
  public name: string;

  @ApiProperty({
    description: "Emoji URL",
    example: "https://github.githubassets.com/images/icons/emoji/unicode/1f4af.png?v8",
  })
  @Column({ type: "text" })
  public url: string;

  @ApiProperty({
    description: "Emoji display order",
    example: 1,
    type: "integer",
  })
  @Column({ type: "integer" })
  public display_order!: number;

  @ApiPropertyOptional({
    description: "Timestamp representing highlight reaction creation",
    example: "2016-10-19 13:24:51.000000",
  })
  @CreateDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public created_at?: Date;

  @ApiPropertyOptional({
    description: "Timestamp representing highlight reaction last update",
    example: "2022-08-28 22:04:29.000000",
  })
  @UpdateDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public updated_at?: Date;

  @ApiHideProperty()
  @DeleteDateColumn({
    type: "timestamp without time zone",
    select: false,
  })
  public deleted_at?: Date;

  @ApiHideProperty()
  @OneToMany(() => DbUserHighlightReaction, (highlightReaction) => highlightReaction.emoji)
  public reactions: Relation<DbUserHighlightReaction[]>;
}
