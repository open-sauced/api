import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn, Relation } from "typeorm";
import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";

import { DbCommits } from "./commits.entity";

@Entity({
  name: "baked_repos",
  orderBy: {
    id: "DESC",
  },
})
export class DbBakedRepo extends BaseEntity {
  @ApiProperty({
    description: "Baked repository identifier",
    example: 71359796,
    type: "integer",
  })
  @PrimaryColumn("bigint")
  public id!: number;

  @ApiProperty({
    description: "Repository clone url",
    example: "https://github.com/open-sauced/insights.git",
  })
  @Column({
    type: "character varying",
    length: 255,
  })
  public clone_url: string;

  @ApiProperty({
    description: "Repository identifier",
    example: 12345678,
    type: "integer",
  })
  @PrimaryColumn("bigint")
  public repo_id!: number;

  @ApiHideProperty()
  @OneToMany(() => DbCommits, (commits) => commits.baked_repo)
  public commits: Relation<DbCommits[]>;
}
