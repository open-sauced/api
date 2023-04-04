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

import { ApiModelProperty, ApiModelPropertyOptional } from "@nestjs/swagger/dist/decorators/api-model-property.decorator";

@Entity({ name: "insight_members" })
export class DbInsightMember extends BaseEntity {
  @ApiModelProperty({
    description: "Insight identifier",
    example: "uuid-v4",
  })
  @PrimaryColumn()
  @PrimaryGeneratedColumn()
  public id!: string;

  @ApiModelProperty({
    description: "Insight ID",
    example: 237133,
  })
  @Column()
  public insight_id: number;

  @ApiModelProperty({
    description: "User ID",
    example: 237133,
  })
  @Column()
  public user_id: number;

  @ApiModelProperty({
    description: "User's Name",
    example: "Brian Douglas",
  })
  @Column({
    type: "text",
    select: false,
    insert: false,
  })
  public name?: string;

  @ApiModelProperty({
    description: "Insight Member Access",
    example: "view",
  })
  @Column({
    type: "character varying",
    length: 20,
    default: "view",
  })
  public access: string;

  @ApiModelPropertyOptional({
    description: "Timestamp representing team member creation",
    example: "2022-10-19 13:24:51.000000",
  })
  @CreateDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public created_at?: Date;

  @ApiModelPropertyOptional({
    description: "Timestamp representing team member last updated",
    example: "2022-10-19 13:24:51.000000",
  })
  @UpdateDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public updated_at?: Date;

  @ApiModelPropertyOptional({
    description: "Timestamp representing team member deletion",
    example: "2022-10-19 13:24:51.000000",
  })
  @DeleteDateColumn({ type: "timestamp without time zone" })
  public deleted_at?: Date;
}
