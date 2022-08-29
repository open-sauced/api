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
  DeleteDateColumn,
} from "typeorm";
import { ApiHideProperty } from "@nestjs/swagger";

import { DbUser } from "../../user/user.entity";
import { DbContribution } from "../../contribution/contribution.entity";
import { DbRepoToUserVotes } from "./repo.to.user.votes.entity";
import { DbRepoToUserStars } from "./repo.to.user.stars.entity";
import { DbRepoToUserSubmissions } from "./repo.to.user.submissions.entity";
import { DbRepoToUserStargazers } from "./repo.to.user.stargazers.entity";

@Entity({
  name: "repos",
  orderBy: {
    stars: "DESC",
    name: "ASC",
  },
})
export class DbRepo extends BaseEntity {
  @PrimaryColumn("bigint")
  public id!: number;

  @Column({
    type: "bigint",
    select: false,
  })
  public user_id!: number;

  @Column({
    type: "bigint",
    default: 0,
  })
  public issues: number;

  @Column({
    type: "bigint",
    default: 0,
  })
  public stars: number;

  @Column({
    type: "bigint",
    default: 0,
  })
  public watchers: number;

  @Column({
    type: "bigint",
    default: 0,
  })
  public subscribers: number;

  @Column({ default: false })
  public is_fork: boolean;

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

  @Column({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public pushed_at?: Date;

  @Column({
    type: "timestamp without time zone",
    default: () => "to_timestamp(0)",
  })
  public last_fetched_contributors_at?: Date;

  @DeleteDateColumn({ type: "timestamp without time zone" })
  public deleted_at?: Date;

  @Column({
    type: "character varying",
    length: 255,
  })
  public name: string;

  @Column({
    type: "character varying",
    length: 255,
  })
  public full_name: string;

  @Column("text")
  public description: string;

  @Column({
    type: "character varying",
    length: 64,
  })
  public language: string;

  @Column({
    type: "character varying",
    length: 64,
  })
  public license: string;

  @Column({
    type: "character varying",
    length: 255,
  })
  public url: string;

  @ApiHideProperty()
  @ManyToOne(() => DbUser, user => user.repos)
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
  })
  public user!: DbUser;

  @ApiHideProperty()
  @OneToMany(() => DbContribution, contribution => contribution.repo)
  public contributions: DbContribution[];

  @ApiHideProperty()
  @OneToMany(() => DbRepoToUserVotes, repoToUserVotes => repoToUserVotes.repo)
  public repoToUserVotes: DbRepoToUserVotes[];

  @ApiHideProperty()
  @OneToMany(() => DbRepoToUserStars, repoToUserStars => repoToUserStars.repo)
  public repoToUserStars: DbRepoToUserStars[];

  @ApiHideProperty()
  @OneToMany(() => DbRepoToUserSubmissions, repoToUserSubmissions => repoToUserSubmissions.repo)
  public repoToUserSubmissions: DbRepoToUserSubmissions[];

  @ApiHideProperty()
  @OneToMany(() => DbRepoToUserStargazers, repoToUserStargazers => repoToUserStargazers.repo)
  public repoToUserStargazers: DbRepoToUserStargazers[];
}
