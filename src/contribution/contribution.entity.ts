import {
  Entity,
  Column,
  BaseEntity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";
import { ApiHideProperty } from "@nestjs/swagger";

import { DbRepo } from "../repo/entities/repo.entity";

@Entity({
  name: "contributions"
})
export class Contribution extends BaseEntity {
  @PrimaryColumn("bigint")
  id: number;

  @Column({
    type: "bigint",
    select: false
  })
  repo_id: number;

  @Column({
    type: "bigint",
    default: 0,
  })
  count: number;

  @Column({
    type: "timestamp without time zone"
  })
  last_merged_at: Date;

  @CreateDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  created_at: Date;

  @UpdateDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  updated_at: Date;

  @DeleteDateColumn({
    type: "timestamp without time zone",
  })
  deleted_at: Date;

  @Column({
    type: "character varying",
    length: 255
  })
  contributor: string;

  @Column({
    type: "character varying",
    length: 255
  })
  url: string;

  @ApiHideProperty()
  @ManyToOne(() => DbRepo, (repo) => repo.contributions)
  @JoinColumn({
    name: "repo_id",
    referencedColumnName: "id",
  })
  repo: DbRepo;
}
