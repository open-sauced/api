import {
  Entity,
  Column,
  BaseEntity,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  Relation,
  DeleteDateColumn,
  JoinColumn,
  ManyToOne,
} from "typeorm";

import { ApiProperty, ApiPropertyOptional, ApiHideProperty } from "@nestjs/swagger";
import { DbUser } from "../user.entity";

@Entity({ name: "user_collaborations" })
export class DbUserCollaboration extends BaseEntity {
  @ApiProperty({
    description: "User Collaboration identifier",
    example: "uuid-v4",
  })
  @PrimaryColumn()
  @PrimaryGeneratedColumn()
  public id!: string;

  @ApiPropertyOptional({
    description: "Collaboration Receipient User ID",
    example: 237133,
    type: "integer",
  })
  @Column({ type: "integer" })
  public user_id?: number;

  @ApiPropertyOptional({
    description: "Collaboration Request User ID",
    example: 31333,
    type: "integer",
  })
  @Column({ type: "integer" })
  public request_user_id?: number;

  @ApiHideProperty()
  @ManyToOne(() => DbUser, (user) => user.collaborations, { onDelete: "CASCADE" })
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
  })
  public user: Relation<DbUser>;

  @ApiHideProperty()
  @ManyToOne(() => DbUser, (user) => user.request_collaborations, { onDelete: "CASCADE" })
  @JoinColumn({
    name: "request_user_id",
    referencedColumnName: "id",
  })
  public request_user: Relation<DbUser>;

  @ApiProperty({
    description: "Collaboration Request Message",
    example: "Hey, are you up for collaborating on this cool project?",
  })
  @Column({
    type: "character varying",
    length: 500,
    default: "",
  })
  public message: string;

  @ApiProperty({
    description: "Collaboration Status",
    example: "pending",
  })
  @Column({
    type: "character varying",
    length: 20,
    default: "pending",
  })
  public status: string;

  @ApiPropertyOptional({
    description: "Timestamp representing user collaboration creation",
    example: "2022-10-19 13:24:51.000000",
  })
  @CreateDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public created_at?: Date;

  @ApiPropertyOptional({
    description: "Timestamp representing user collaboration last updated",
    example: "2022-10-19 13:24:51.000000",
  })
  @UpdateDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public updated_at?: Date;

  @ApiPropertyOptional({
    description: "Timestamp representing user collaboration deletion",
    example: "2022-10-19 13:24:51.000000",
  })
  @DeleteDateColumn({
    type: "timestamp without time zone",
    select: false,
  })
  public deleted_at?: Date;

  @ApiPropertyOptional({
    description: "Timestamp representing collaboration request email sent date",
    example: "2023-04-10 13:24:51.000000",
  })
  @Column({
    type: "timestamp without time zone",
    select: false,
  })
  public request_emailed_at?: Date;

  @ApiPropertyOptional({
    description: "Timestamp representing collaboration acceptance email sent date",
    example: "2023-04-10 13:24:51.000000",
  })
  @Column({
    type: "timestamp without time zone",
    select: false,
  })
  public collaboration_emailed_at?: Date;
}
