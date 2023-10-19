import {
  Entity,
  Column,
  BaseEntity,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
} from "typeorm";

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

@Entity({ name: "insight_members" })
export class DbInsightMember extends BaseEntity {
  @ApiProperty({
    description: "Insight Member identifier",
    example: "uuid-v4",
  })
  @PrimaryColumn()
  @PrimaryGeneratedColumn()
  public id!: string;

  @ApiProperty({
    description: "Insight ID",
    example: 237133,
    type: "integer",
  })
  @Column()
  public insight_id: number;

  @ApiProperty({
    description: "User ID",
    example: 237133,
    type: "integer",
  })
  @Column({ type: "integer" })
  public user_id?: number;

  @ApiProperty({
    description: "User's Name",
    example: "Brian Douglas",
  })
  @Column({
    type: "text",
    select: false,
    insert: false,
  })
  public name?: string;

  @ApiProperty({
    description: "Insight Member Access",
    example: "pending",
  })
  @Column({
    type: "character varying",
    length: 20,
    default: "pending",
  })
  public access: string;

  @ApiPropertyOptional({
    description: "Timestamp representing team member creation",
    example: "2022-10-19 13:24:51.000000",
  })
  @CreateDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public created_at?: Date;

  @ApiPropertyOptional({
    description: "Timestamp representing team member last updated",
    example: "2022-10-19 13:24:51.000000",
  })
  @UpdateDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public updated_at?: Date;

  @ApiPropertyOptional({
    description: "Timestamp representing team member deletion",
    example: "2022-10-19 13:24:51.000000",
  })
  @DeleteDateColumn({ type: "timestamp without time zone" })
  public deleted_at?: Date;

  @ApiPropertyOptional({
    description: "Timestamp representing team member invitation email sent date",
    example: "2023-04-10 13:24:51.000000",
  })
  @Column({
    type: "timestamp without time zone",
    select: false,
  })
  public invitation_emailed_at?: Date;

  @ApiProperty({
    description: "Team Member Invitation Email",
    example: "hello@opensauced.pizza",
  })
  @Column({
    type: "text",
    select: false,
  })
  public invitation_email?: string;
}
