import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ApiHideProperty } from "@nestjs/swagger";
import {
  ApiModelProperty,
  ApiModelPropertyOptional,
} from "@nestjs/swagger/dist/decorators/api-model-property.decorator";

@Entity({ name: "users_to_users_followers" })
export class DbUserToUserFollows {
  @ApiModelProperty({
    description: "User Follow identifier",
    example: 196,
    type: "integer",
  })
  @PrimaryGeneratedColumn()
  public id!: number;

  @ApiModelProperty({
    description: "User identifier",
    example: 237133,
    type: "integer",
  })
  @Column()
  public user_id!: number;

  @ApiModelProperty({
    description: "User follower identifier",
    example: 71359796,
    type: "integer",
  })
  @Column()
  public following_user_id!: number;

  @ApiModelPropertyOptional({
    description: "Timestamp representing user follow creation",
    example: "2016-10-19 13:24:51.000000",
  })
  @CreateDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public created_at?: Date;

  @ApiModelPropertyOptional({
    description: "Timestamp representing user follow last update",
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
}
