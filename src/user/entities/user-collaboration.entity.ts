import {
  Entity,
  Column,
  BaseEntity,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  JoinColumn,
  ManyToOne,
} from "typeorm";

import {
  ApiModelProperty,
  ApiModelPropertyOptional,
} from "@nestjs/swagger/dist/decorators/api-model-property.decorator";
import { ApiHideProperty } from "@nestjs/swagger";
import { DbUser } from "../user.entity";

@Entity({ name: "user_collaborations" })
export class DbUserCollaboration extends BaseEntity {
  @ApiModelProperty({
    description: "User Collaboration identifier",
    example: "uuid-v4",
  })
  @PrimaryColumn()
  @PrimaryGeneratedColumn()
  public id!: string;

  @ApiModelProperty({
    description: "Collaboration Receipient User ID",
    example: 237133,
    type: "integer",
  })
  @Column({ type: "integer" })
  public user_id?: number;

  @ApiModelProperty({
    description: "Collaboration Request User ID",
    example: 31333,
    type: "integer",
  })
  @Column({ type: "integer" })
  public request_user_id?: number;

  @ApiHideProperty()
  @ManyToOne(() => DbUser, (user) => user.collaborations)
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
  })
  public user: DbUser;

  @ApiHideProperty()
  @ManyToOne(() => DbUser, (user) => user.request_collaborations)
  @JoinColumn({
    name: "request_user_id",
    referencedColumnName: "id",
  })
  public request_user: DbUser;

  @ApiModelProperty({
    description: "Collaboration Request Message",
    example: "Hey, are you up for collaborating on this cool project?",
  })
  @Column({
    type: "character varying",
    length: 500,
    default: "",
  })
  public message: string;

  @ApiModelProperty({
    description: "Collaboration Status",
    example: "pending",
  })
  @Column({
    type: "character varying",
    length: 20,
    default: "pending",
  })
  public status: string;

  @ApiModelPropertyOptional({
    description: "Timestamp representing user collaboration creation",
    example: "2022-10-19 13:24:51.000000",
  })
  @CreateDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public created_at?: Date;

  @ApiModelPropertyOptional({
    description: "Timestamp representing user collaboration last updated",
    example: "2022-10-19 13:24:51.000000",
  })
  @UpdateDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public updated_at?: Date;

  @ApiModelPropertyOptional({
    description: "Timestamp representing user collaboration deletion",
    example: "2022-10-19 13:24:51.000000",
  })
  @DeleteDateColumn({
    type: "timestamp without time zone",
    select: false,
  })
  public deleted_at?: Date;

  @ApiModelPropertyOptional({
    description: "Timestamp representing collaboration request email sent date",
    example: "2023-04-10 13:24:51.000000",
  })
  @Column({
    type: "timestamp without time zone",
    select: false,
  })
  public request_emailed_at?: Date;

  @ApiModelPropertyOptional({
    description: "Timestamp representing collaboration acceptance email sent date",
    example: "2023-04-10 13:24:51.000000",
  })
  @Column({
    type: "timestamp without time zone",
    select: false,
  })
  public collaboration_emailed_at?: Date;
}
