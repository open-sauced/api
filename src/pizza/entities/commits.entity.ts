import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { ApiModelProperty } from "@nestjs/swagger/dist/decorators/api-model-property.decorator";
import { ApiHideProperty } from "@nestjs/swagger";

import { DbBakedRepo } from "./baked-repo.entity";
import { DbCommitAuthors } from "./commit_authors.entity";

@Entity({
  name: "commits",
  orderBy: {
    id: "DESC",
  },
})
export class DbCommits extends BaseEntity {
  @ApiModelProperty({
    description: "Commit identifier",
    example: 71359796,
    type: "integer",
  })
  @PrimaryColumn("bigint")
  public id!: number;

  @ApiModelProperty({
    description: "Hash for the commit",
    example: "5e7c6c7af42d38c57f363c564c58007da448c443",
  })
  @Column({
    type: "character varying",
    length: 255,
  })
  public commit_hash: string;

  @ApiModelProperty({
    description: "Date for the commit",
    example: "5e7c6c7af42d38c57f363c564c58007da448c443",
  })
  @Column({
    type: "character varying",
    length: 255,
  })
  public commit_date: string;

  @ApiModelProperty({
    description: "Baked repo identifier",
    example: 57568598,
    type: "integer",
  })
  @Column({
    type: "bigint",
  })
  public baked_repo_id!: number;

  @ApiHideProperty()
  @ManyToOne(() => DbBakedRepo, (baked_repo) => baked_repo.commits)
  @JoinColumn({
    name: "baked_repo_id",
    referencedColumnName: "id",
  })
  public baked_repo!: DbBakedRepo;

  @ApiModelProperty({
    description: "Commit author identifier",
    example: 9876543,
    type: "integer",
  })
  @Column({
    type: "bigint",
  })
  public commit_author_id!: number;

  @ApiHideProperty()
  @ManyToOne(() => DbCommitAuthors, (commit_author) => commit_author.commits)
  @JoinColumn({
    name: "commit_author_id",
    referencedColumnName: "id",
  })
  public commit_author!: DbCommitAuthors;
}
