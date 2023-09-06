import {
  Entity,
  Column,
  BaseEntity,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";

import {
  ApiModelProperty,
  ApiModelPropertyOptional,
} from "@nestjs/swagger/dist/decorators/api-model-property.decorator";
import { ApiHideProperty } from "@nestjs/swagger";

import { DbUser } from "../../user/user.entity";

@Entity({ name: "user_lists" })
export class DbUserList extends BaseEntity {
  @ApiModelProperty({
    description: "User List identifier",
    example: "uuid-v4",
  })
  @PrimaryColumn()
  @PrimaryGeneratedColumn()
  public id!: string;

  @ApiModelProperty({
    description: "User ID",
    example: 237133,
    type: "integer",
  })
  @Column({
    type: "bigint",
    select: false,
  })
  public user_id: number;

  @ApiModelProperty({
    description: "List Name",
    example: "JavaScript Developers",
  })
  @Column({
    type: "character varying",
    length: 255,
  })
  public name: string;

  @ApiModelProperty({
    description: "Flag indicating insight visibility",
    example: false,
  })
  @Column({ default: false })
  public is_public: boolean;

  @ApiModelPropertyOptional({
    description: "Timestamp representing insight creation",
    example: "2022-10-19 13:24:51.000000",
  })
  @CreateDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public created_at?: Date;

  @ApiModelPropertyOptional({
    description: "Timestamp representing insight last updated",
    example: "2022-10-19 13:24:51.000000",
  })
  @UpdateDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public updated_at?: Date;

  @ApiModelPropertyOptional({
    description: "Timestamp representing insight deletion",
    example: "2022-10-19 13:24:51.000000",
  })
  @DeleteDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public deleted_at?: Date;

  @ApiHideProperty()
  @ManyToOne(() => DbUser, (user) => user.lists)
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
  })
  public list_user!: DbUser;
}
