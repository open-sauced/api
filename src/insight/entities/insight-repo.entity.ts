import {
  Entity,
  Column,
  BaseEntity,
  PrimaryColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { ApiHideProperty } from "@nestjs/swagger";

import { ApiModelProperty, ApiModelPropertyOptional } from "@nestjs/swagger/dist/decorators/api-model-property.decorator";

import { DbInsight } from "./insight.entity";

@Entity({ name: "insight_repos" })
export class DbInsightRepo extends BaseEntity {
  @ApiModelProperty({
    description: "Insight identifier",
    example: 237133,
  })
  @PrimaryColumn()
  public id!: number;

  @ApiModelProperty({
    description: "Insight ID",
    example: 237133,
  })
  @Column()
  public insight_id: number;

  @ApiModelProperty({
    description: "Repo ID",
    example: 237133,
  })
  @Column()
  public repo_id: number;

  @ApiModelPropertyOptional({
    description: "Timestamp representing insight repo creation",
    example: "2022-10-19 13:24:51.000000",
  })
  @CreateDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public created_at?: Date;

  @ApiHideProperty()
  @ManyToOne(() => DbInsight, insight => insight.repos)
  @JoinColumn({
    name: "insight_id",
    referencedColumnName: "id",
  })
  public insight!: DbInsight;
}
