import {
  Entity,
  Column,
  BaseEntity,
  PrimaryColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  Relation,
} from "typeorm";
import { ApiHideProperty, ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import { DbInsight } from "./insight.entity";

@Entity({ name: "insight_repos" })
export class DbInsightRepo extends BaseEntity {
  @ApiProperty({
    description: "Insight identifier",
    example: 237133,
    type: "integer",
  })
  @PrimaryColumn()
  @PrimaryGeneratedColumn()
  public id!: number;

  @ApiProperty({
    description: "Insight ID",
    example: 237133,
    type: "integer",
  })
  @Column()
  public insight_id: number;

  @ApiProperty({
    description: "Repo ID",
    example: 237133,
    type: "integer",
  })
  @Column()
  public repo_id: number;

  @ApiProperty({
    description: "Repo Full Name",
    example: "open-sauced/insights",
  })
  @Column({ type: "text" })
  public full_name: string;

  @ApiPropertyOptional({
    description: "Timestamp representing insight repo creation",
    example: "2022-10-19 13:24:51.000000",
  })
  @CreateDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public created_at?: Date;

  @ApiPropertyOptional({
    description: "Timestamp representing insight repo deletion",
    example: "2022-10-19 13:24:51.000000",
  })
  @DeleteDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public deleted_at?: Date;

  @ApiHideProperty()
  @ManyToOne(() => DbInsight, (insight) => insight.repos)
  @JoinColumn({
    name: "insight_id",
    referencedColumnName: "id",
  })
  public insight!: Relation<DbInsight>;
}
