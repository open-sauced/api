import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ApiHideProperty } from "@nestjs/swagger";
import {
  ApiModelProperty,
  ApiModelPropertyOptional,
} from "@nestjs/swagger/dist/decorators/api-model-property.decorator";

@Entity({ name: "user_highlight_reactions" })
export class DbUserHighlightReaction {
  @ApiModelProperty({
    description: "Reaction identifier",
    example: 196,
  })
  @PrimaryGeneratedColumn()
  public id!: number;

  @ApiModelProperty({
    description: "Highlight identifier",
    example: 71359796,
  })
  @Column({ type: "integer" })
  public highlight_id!: number;

  @ApiModelProperty({
    description: "User identifier",
    example: 237133,
  })
  @Column({
    type: "integer",
    select: false,
  })
  public user_id!: number;

  @ApiModelProperty({
    description: "Emoji identifier",
    example: 237133,
  })
  @Column({ type: "integer" })
  public emoji_id!: number;

  @ApiModelPropertyOptional({
    description: "Timestamp representing highlight reaction creation",
    example: "2016-10-19 13:24:51.000000",
  })
  @CreateDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
    select: false,
  })
  public created_at?: Date;

  @ApiModelPropertyOptional({
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
  @Column({
    type: "integer",
    select: false,
  })
  public reaction_count?: number;
}
