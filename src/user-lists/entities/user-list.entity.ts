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
  Relation,
  JoinColumn,
} from "typeorm";

import { ApiHideProperty, ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import { DbUser } from "../../user/user.entity";

@Entity({ name: "user_lists" })
export class DbUserList extends BaseEntity {
  @ApiProperty({
    description: "User List identifier",
    example: "uuid-v4",
  })
  @PrimaryColumn()
  @PrimaryGeneratedColumn()
  public id!: string;

  @ApiProperty({
    description: "User ID",
    example: 237133,
    type: "integer",
  })
  @Column({
    type: "bigint",
    select: true,
  })
  public user_id: number;

  @ApiProperty({
    description: "List Name",
    example: "JavaScript Developers",
  })
  @Column({
    type: "character varying",
    length: 255,
  })
  public name: string;

  @ApiProperty({
    description: "Flag indicating insight visibility",
    example: false,
  })
  @Column({ default: false })
  public is_public: boolean;

  @ApiPropertyOptional({
    description: "Timestamp representing insight creation",
    example: "2022-10-19 13:24:51.000000",
  })
  @CreateDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public created_at?: Date;

  @ApiPropertyOptional({
    description: "Timestamp representing insight last updated",
    example: "2022-10-19 13:24:51.000000",
  })
  @UpdateDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public updated_at?: Date;

  @ApiPropertyOptional({
    description: "Timestamp representing insight deletion",
    example: "2022-10-19 13:24:51.000000",
  })
  @DeleteDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public deleted_at?: Date;

  @ApiHideProperty()
  @ManyToOne(() => DbUser, (user) => user.lists, { onDelete: "CASCADE" })
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
  })
  public list_user!: Relation<DbUser>;
}
