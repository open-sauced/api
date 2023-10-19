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
import { ApiHideProperty, ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import { DbRepo } from "../repo/entities/repo.entity";

@Entity({ name: "contributions" })
export class DbContribution extends BaseEntity {
  @ApiProperty({
    description: "Contribution identifier",
    example: 12237133,
    type: "integer",
  })
  @PrimaryColumn("bigint")
  public id!: number;

  @ApiProperty({
    description: "Repository identifier",
    example: 71359796,
    type: "integer",
  })
  @Column({
    type: "bigint",
    select: false,
  })
  public repo_id!: number;

  @ApiProperty({
    description: "Total number of contributed pull requests",
    example: 15,
    type: "integer",
  })
  @Column({
    type: "bigint",
    default: 0,
  })
  public count: number;

  @ApiProperty({
    description: "Timestamp representing last contribution merge to the default branch",
    example: "2016-10-19 13:24:51.000000",
  })
  @Column({ type: "timestamp without time zone" })
  public last_merged_at: Date;

  @ApiPropertyOptional({
    description: "Timestamp representing contribution creation",
    example: "2016-10-19 13:24:51.000000",
  })
  @CreateDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public created_at?: Date;

  @ApiPropertyOptional({
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

  @ApiProperty({
    description: "Contributor unique user name",
    example: "0-vortex",
  })
  @Column({
    type: "character varying",
    length: 255,
  })
  public contributor: string;

  @ApiProperty({
    description: "Contribution GitHub origin URL",
    example: "https://github.com/open-sauced/hot/pull/320",
  })
  @Column({
    type: "character varying",
    length: 255,
  })
  public url: string;

  @ApiHideProperty()
  @ManyToOne(() => DbRepo, (repo) => repo.contributions)
  @JoinColumn({
    name: "repo_id",
    referencedColumnName: "id",
  })
  public repo!: DbRepo;
}
