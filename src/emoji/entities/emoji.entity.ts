import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ApiHideProperty } from "@nestjs/swagger";
import {
  ApiModelProperty,
  ApiModelPropertyOptional,
} from "@nestjs/swagger/dist/decorators/api-model-property.decorator";

import { DbUserHighlightReaction } from "../../user/entities/user-highlight-reaction.entity";

@Entity({ name: "emojis" })
export class DbEmoji {
  @ApiModelProperty({
    description: "Emoji identifier",
    example: "uuid-v4",
  })
  @PrimaryGeneratedColumn()
  public id!: string;

  @ApiModelProperty({
    description: "Emoji Name",
    example: "100",
  })
  @Column({ type: "text" })
  public name: string;

  @ApiModelProperty({
    description: "Emoji URL",
    example: "https://github.githubassets.com/images/icons/emoji/unicode/1f4af.png?v8",
  })
  @Column({ type: "text" })
  public url: string;

  @ApiModelProperty({
    description: "Emoji display order",
    example: 1,
    type: "integer",
  })
  @Column({ type: "integer" })
  public display_order!: number;

  @ApiModelPropertyOptional({
    description: "Timestamp representing highlight reaction creation",
    example: "2016-10-19 13:24:51.000000",
  })
  @CreateDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public created_at?: Date;

  @ApiModelPropertyOptional({
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
  public reactions: DbUserHighlightReaction[];
}
