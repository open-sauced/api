import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { ApiModelProperty } from "@nestjs/swagger/dist/decorators/api-model-property.decorator";
import { ApiHideProperty } from "@nestjs/swagger";

import { DbCommits } from "./commits.entity";

@Entity({
  name: "baked_repos",
  orderBy: {
    id: "DESC",
  },
})
export class DbBakedRepo extends BaseEntity {
  @ApiModelProperty({
    description: "Baked repository identifier",
    example: 71359796,
  })
  @PrimaryColumn("bigint")
  public id!: number;

  @ApiModelProperty({
    description: "Repository clone url",
    example: "https://github.com/open-sauced/insights.git",
  })
  @Column({
    type: "character varying",
    length: 255,
  })
  public clone_url: string;

  @ApiModelProperty({
    description: "Repository identifier",
    example: 12345678,
  })
  @PrimaryColumn("bigint")
  public repo_id!: number;

  @ApiHideProperty()
  @OneToMany(() => DbCommits, (commits) => commits.baked_repo)
  public commits: DbCommits[];
}
