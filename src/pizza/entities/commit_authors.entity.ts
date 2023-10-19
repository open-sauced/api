import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn, Relation } from "typeorm";
import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";

import { DbCommits } from "./commits.entity";

@Entity({
  name: "commit_authors",
  orderBy: {
    id: "DESC",
  },
})
export class DbCommitAuthors extends BaseEntity {
  @ApiProperty({
    description: "Commit author identifier",
    example: 71359796,
    type: "integer",
  })
  @PrimaryColumn("bigint")
  public id!: number;

  @ApiHideProperty()
  @Column({
    type: "character varying",
    length: 255,
    select: false,
  })
  public commit_author_email: string;

  @ApiHideProperty()
  @OneToMany(() => DbCommits, (commits) => commits.commit_author)
  public commits: Relation<DbCommits[]>;
}
