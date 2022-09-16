import {
  Entity,
  Column,
  BaseEntity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { ApiHideProperty } from "@nestjs/swagger";

import { DbRepo } from "../repo/entities/repo.entity";
import { ApiModelProperty, ApiModelPropertyOptional } from "@nestjs/swagger/dist/decorators/api-model-property.decorator";

@Entity({ name: "contributions" })
export class DbContribution extends BaseEntity {
  @ApiModelProperty({
    description: "Contribution identifier",
    example: 12237133,
  })
  @PrimaryColumn("bigint")
  public id!: number;

  @ApiModelProperty({
    description: "Repository identifier",
    example: 71359796,
  })
  @Column({
    type: "bigint",
    select: false,
  })
  public repo_id!: number;

  @ApiModelProperty({
    description: "Total number of contributed pull requests",
    example: 15,
  })
  @Column({
    type: "bigint",
    default: 0,
  })
  public count: number;

  @ApiModelProperty({
    description: "Timestamp representing last contribution merge to the default branch",
    example: "2016-10-19 13:24:51.000000",
  })
  @Column({ type: "timestamp without time zone" })
  public last_merged_at: Date;

  @ApiModelPropertyOptional({
    description: "Timestamp representing contribution creation",
    example: "2016-10-19 13:24:51.000000",
  })
  @CreateDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public created_at?: Date;

  @ApiModelPropertyOptional({
    description: "Timestamp representing contribution last update",
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

  @ApiModelProperty({
    description: "Contributor unique user name",
    example: "0-vortex",
  })
  @Column({
    type: "character varying",
    length: 255,
  })
  public contributor: string;

  @ApiModelProperty({
    description: "Contribution GitHub origin URL",
    example: "https://github.com/open-sauced/hot/pull/320",
  })
  @Column({
    type: "character varying",
    length: 255,
  })
  public url: string;

  @ApiHideProperty()
  @ManyToOne(() => DbRepo, repo => repo.contributions)
  @JoinColumn({
    name: "repo_id",
    referencedColumnName: "id",
  })
  public repo!: DbRepo;
}
