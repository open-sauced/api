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

@Entity({ name: "contributions" })
export class DbContribution extends BaseEntity {
  @PrimaryColumn("bigint")
  public id!: number;

  @Column({
    type: "bigint",
    select: false,
  })
  public repo_id!: number;

  @Column({
    type: "bigint",
    default: 0,
  })
  public count: number;

  @Column({ type: "timestamp without time zone" })
    last_merged_at: Date;

  @CreateDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public created_at?: Date;

  @UpdateDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public updated_at?: Date;

  @DeleteDateColumn({ type: "timestamp without time zone" })
  public deleted_at?: Date;

  @Column({
    type: "character varying",
    length: 255,
  })
  public contributor: string;

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
