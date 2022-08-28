import {
  Entity,
  Column,
  BaseEntity,
  PrimaryColumn,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  DeleteDateColumn
} from "typeorm";
import { ApiHideProperty } from "@nestjs/swagger";

import { DbUser } from "../../user/user.entity";
import { DbContribution } from "../../contribution/contribution.entity";
import { RepoToUserVotes } from "./repo.to.user.votes.entity";
import { RepoToUserStars } from "./repo.to.user.stars.entity";
import { RepoToUserSubmissions } from "./repo.to.user.submissions.entity";
import { DbRepoToUserStargazers } from "./repo.to.user.stargazers.entity";

@Entity({
  name: "repos",
  orderBy: {
    stars: "DESC",
    name: "ASC"
  }
})
export class DbRepo extends BaseEntity {
  @PrimaryColumn("bigint")
  id: number;

  @Column({
    type: "bigint",
    select: false
  })
  user_id: number;

  @Column({
    type: "bigint",
    default: 0,
  })
  issues: number;

  @Column({
    type: "bigint",
    default: 0,
  })
  stars: number;

  @Column({
    type: "bigint",
    default: 0,
  })
  watchers: number;

  @Column({
    type: "bigint",
    default: 0,
  })
  subscribers: number;

  @Column({ default: false })
  is_fork: boolean;

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

  @Column({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  pushed_at: Date;

  @Column({
    type: "timestamp without time zone",
    default: () => "to_timestamp(0)",
  })
  last_fetched_contributors_at: Date;

  @DeleteDateColumn({
    type: "timestamp without time zone",
  })
  deleted_at: Date;

  @Column({
    type: "character varying",
    length: 255
  })
  name: string;

  @Column({
    type: "character varying",
    length: 255
  })
  full_name: string;

  @Column("text")
  description: string;

  @Column({
    type: "character varying",
    length: 64
  })
  language: string;

  @Column({
    type: "character varying",
    length: 64
  })
  license: string;

  @Column({
    type: "character varying",
    length: 255
  })
  url: string;

  @ApiHideProperty()
  @ManyToOne(() => DbUser, user => user.repos)
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
  })
  user: DbUser;

  @ApiHideProperty()
  @OneToMany(() => DbContribution, contribution => contribution.repo)
  contributions: DbContribution[];

  @ApiHideProperty()
  @OneToMany(() => RepoToUserVotes, repoToUserVotes => repoToUserVotes.repo)
  repoToUserVotes: RepoToUserVotes[];

  @ApiHideProperty()
  @OneToMany(() => RepoToUserStars, repoToUserStars => repoToUserStars.repo)
  repoToUserStars: RepoToUserStars[];

  @ApiHideProperty()
  @OneToMany(() => RepoToUserSubmissions, repoToUserSubmissions => repoToUserSubmissions.repo)
  repoToUserSubmissions: RepoToUserSubmissions[];

  @ApiHideProperty()
  @OneToMany(() => DbRepoToUserStargazers, repoToUserStargazers => repoToUserStargazers.repo)
  repoToUserStargazers: DbRepoToUserStargazers[];
}
