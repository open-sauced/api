import {
  Entity,
  Column,
  BaseEntity,
  PrimaryColumn,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Relation,
  OneToMany,
  DeleteDateColumn,
} from "typeorm";
import { ApiHideProperty, ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import { DbUser } from "../../user/user.entity";
import { DbContribution } from "../../contribution/contribution.entity";
import { DbUserTopRepo } from "../../user/entities/user-top-repo.entity";
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
  @ApiProperty({
    description: "Repository identifier",
    example: 71359796,
    type: "integer",
  })
  @PrimaryColumn("bigint")
  public id!: number;

  @ApiProperty({
    description: "Owner user identifier",
    example: 57568598,
    type: "integer",
  })
  @Column({
    type: "bigint",
    select: false,
  })
  public user_id!: number;

  @ApiProperty({
    description: "Total size in bytes",
    example: 274322,
    type: "integer",
  })
  @Column({
    type: "bigint",
    default: 0,
  })
  public size: number;

  @ApiProperty({
    description: "Total number of issues",
    example: 274,
    type: "integer",
  })
  @Column({
    type: "bigint",
    default: 0,
  })
  public issues: number;

  @ApiProperty({
    description: "Total number of stars",
    example: 5,
    type: "integer",
  })
  @Column({
    type: "bigint",
    default: 0,
  })
  public stars: number;

  @ApiProperty({
    description: "Total number of forks",
    example: 1,
    type: "integer",
  })
  @Column({
    type: "bigint",
    default: 0,
  })
  public forks: number;

  @ApiProperty({
    description: "Total number of watchers",
    example: 5473,
    type: "integer",
  })
  @Column({
    type: "bigint",
    default: 0,
  })
  public watchers: number;

  @ApiProperty({
    description: "Total number of subscribers",
    example: 11756,
    type: "integer",
  })
  @Column({
    type: "bigint",
    default: 0,
  })
  public subscribers: number;

  @ApiProperty({
    description: "Total number of network usages",
    example: 4,
    type: "integer",
  })
  @Column({
    type: "bigint",
    default: 0,
  })
  public network: number;

  @ApiProperty({
    description: "Flag indicating repo is a fork",
    example: false,
  })
  @Column({ default: false })
  public is_fork: boolean;

  @ApiProperty({
    description: "Flag indicating repo is private",
    example: false,
  })
  @Column({ default: false })
  public is_private: boolean;

  @ApiProperty({
    description: "Flag indicating repo is a template",
    example: false,
  })
  @Column({ default: false })
  public is_template: boolean;

  @ApiProperty({
    description: "Flag indicating repo is archived",
    example: false,
  })
  @Column({ default: false })
  public is_archived: boolean;

  @ApiProperty({
    description: "Flag indicating repo is disabled",
    example: false,
  })
  @Column({ default: false })
  public is_disabled: boolean;

  @ApiProperty({
    description: "Flag indicating repo has issues enabled",
    example: false,
  })
  @Column({ default: true })
  public has_issues: boolean;

  @ApiProperty({
    description: "Flag indicating repo has projects enabled",
    example: false,
  })
  @Column({ default: true })
  public has_projects: boolean;

  @ApiProperty({
    description: "Flag indicating repo has downloads enabled",
    example: false,
  })
  @Column({ default: true })
  public has_downloads: boolean;

  @ApiProperty({
    description: "Flag indicating repo has wiki enabled",
    example: false,
  })
  @Column({ default: true })
  public has_wiki: boolean;

  @ApiProperty({
    description: "Flag indicating repo has pages enabled",
    example: false,
  })
  @Column({ default: true })
  public has_pages: boolean;

  @ApiProperty({
    description: "Flag indicating repo has discussions enabled",
    example: false,
  })
  @Column({ default: true })
  public has_discussions: boolean;

  @ApiPropertyOptional({
    description: "Timestamp representing repository creation",
    example: "2016-10-19 13:24:51.000000",
  })
  @CreateDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public created_at?: Date;

  @ApiPropertyOptional({
    description: "Timestamp representing repository last update",
    example: "2022-08-28 22:04:29.000000",
  })
  @UpdateDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public updated_at?: Date;

  @ApiPropertyOptional({
    description: "Timestamp representing repository last push",
    example: "2022-08-28 22:04:39.000000",
  })
  @Column({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public pushed_at?: Date;

  @ApiHideProperty()
  @DeleteDateColumn({
    type: "timestamp without time zone",
    select: false,
  })
  public deleted_at?: Date;

  @ApiProperty({
    description: "Repository default branch",
    example: "main",
  })
  @Column({
    type: "character varying",
    length: 255,
    default: "main",
  })
  public default_branch: string;

  @ApiProperty({
    description: "Repository GQL node id",
    example: "MDEwOlJlcG9zaXRvcnk3MTM1OTc5Ng==",
  })
  @Column({
    type: "character varying",
    length: 255,
  })
  public node_id: string;

  @ApiProperty({
    description: "Repository git url",
    example: "git://github.com/open-sauced/insights.git",
  })
  @Column({
    type: "character varying",
    length: 255,
  })
  public git_url: string;

  @ApiProperty({
    description: "Repository ssh url",
    example: "git@github.com:open-sauced/insights.git",
  })
  @Column({
    type: "character varying",
    length: 255,
  })
  public ssh_url: string;

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
    description: "Repository svn url",
    example: "https://github.com/open-sauced/insights",
  })
  @Column({
    type: "character varying",
    length: 255,
  })
  public svn_url: string;

  @ApiPropertyOptional({
    description: "Repository mirror url",
    example: null,
  })
  @Column({
    type: "character varying",
    length: 255,
  })
  public mirror_url?: string;

  @ApiProperty({
    description: "Repository unique name",
    example: "open-sauced",
  })
  @Column({
    type: "character varying",
    length: 255,
  })
  public name: string;

  @ApiProperty({
    description: "Repository full name",
    example: "open-sauced/insights",
  })
  @Column({
    type: "character varying",
    length: 255,
  })
  public full_name: string;

  @ApiProperty({
    description: "Repository short description",
    example: "🍕This is a project to identify your next open source contribution! 🍕",
  })
  @Column({
    type: "text",
    default: "",
  })
  public description: string;

  @ApiProperty({
    description: "Repository programming language",
    example: "JavaScript",
  })
  @Column({
    type: "character varying",
    length: 64,
  })
  public language: string;

  @ApiProperty({
    description: "Repository SPDX license",
    example: "MIT",
  })
  @Column({
    type: "character varying",
    length: 64,
  })
  public license: string;

  @ApiProperty({
    description: "Repository GitHub linked URL",
    example: "https://api.github.com/repos/open-sauced/insights",
  })
  @Column({
    type: "character varying",
    length: 255,
    default: "",
  })
  public url: string;

  @ApiProperty({
    description: "Repository GitHub homepage",
    example: "https://app.opensauced.pizza",
  })
  @Column({
    type: "character varying",
    length: 255,
    default: "",
  })
  public homepage: string;

  @ApiProperty({
    description: "Repository GitHub topics",
    isArray: true,
    example: ["open-sauced", "open-source", "github"],
  })
  @Column({
    type: "varchar",
    array: true,
    default: "{}",
  })
  public topics: string[];

  @ApiHideProperty()
  @Column({
    type: "timestamp without time zone",
    default: () => "to_timestamp(0)",
    select: false,
  })
  public last_fetched_repos_at?: Date;

  @ApiHideProperty()
  @Column({
    type: "timestamp without time zone",
    default: () => "to_timestamp(0)",
    select: false,
  })
  public last_fetched_prs_at?: Date;

  @ApiHideProperty()
  @Column({
    type: "timestamp without time zone",
    default: () => "to_timestamp(0)",
    select: false,
  })
  public last_fetched_commits_at?: Date;

  @ApiHideProperty()
  @Column({
    type: "timestamp without time zone",
    default: () => "to_timestamp(0)",
    select: false,
  })
  public last_fetched_contributors_at?: Date;

  @ApiHideProperty()
  @ManyToOne(() => DbUser, (user) => user.repos)
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
  })
  public user!: Relation<DbUser>;

  @ApiHideProperty()
  @ManyToOne(() => DbUser, (user) => user.repo_orgs)
  @JoinColumn({
    name: "organization_id",
    referencedColumnName: "id",
  })
  public org_user!: Relation<DbUser>;

  @ApiHideProperty()
  @OneToMany(() => DbContribution, (contribution) => contribution.repo)
  public contributions: Relation<DbContribution[]>;

  @ApiHideProperty()
  @OneToMany(() => DbRepoToUserVotes, (repoToUserVotes) => repoToUserVotes.repo)
  public repoToUserVotes: Relation<DbRepoToUserVotes[]>;

  @ApiHideProperty()
  @OneToMany(() => DbRepoToUserStars, (repoToUserStars) => repoToUserStars.repo)
  public repoToUserStars: Relation<DbRepoToUserStars[]>;

  @ApiHideProperty()
  @OneToMany(() => DbRepoToUserSubmissions, (repoToUserSubmissions) => repoToUserSubmissions.repo)
  public repoToUserSubmissions: Relation<DbRepoToUserSubmissions[]>;

  @ApiHideProperty()
  @OneToMany(() => DbRepoToUserStargazers, (repoToUserStargazers) => repoToUserStargazers.repo)
  public repoToUserStargazers: Relation<DbRepoToUserStargazers[]>;

  @ApiHideProperty()
  @OneToMany(() => DbUserTopRepo, (repoToUserTopRepos) => repoToUserTopRepos.repo)
  public repoToUserTopRepos: Relation<DbUserTopRepo[]>;

  // virtual columns
  @ApiPropertyOptional({
    description: "Repository number of open PRs",
    example: 5,
    type: "integer",
  })
  @Column({
    type: "bigint",
    select: false,
    insert: false,
  })
  public open_prs_count?: number;

  @ApiPropertyOptional({
    description: "Repository number of closed PRs",
    example: 173,
    type: "integer",
  })
  @Column({
    type: "bigint",
    select: false,
    insert: false,
  })
  public closed_prs_count?: number;

  @ApiPropertyOptional({
    description: "Repository number of merged PRs",
    example: 276,
    type: "integer",
  })
  @Column({
    type: "bigint",
    select: false,
    insert: false,
  })
  public merged_prs_count?: number;

  @ApiPropertyOptional({
    description: "Repository number of draft PRs",
    example: 2,
    type: "integer",
  })
  @Column({
    type: "bigint",
    select: false,
    insert: false,
  })
  public draft_prs_count?: number;

  @ApiPropertyOptional({
    description: "Repository number of spam PRs",
    example: 2,
    type: "integer",
  })
  @Column({
    type: "bigint",
    select: false,
    insert: false,
  })
  public spam_prs_count?: number;

  @ApiPropertyOptional({
    description: "Repository average open/close time for PRs",
    example: 0,
    type: "integer",
  })
  @Column({
    type: "bigint",
    select: false,
    insert: false,
  })
  public pr_velocity_count?: number;

  @ApiPropertyOptional({
    description: "Number of non-closed PRs updated within the day range",
    example: 0,
    type: "integer",
  })
  @Column({
    type: "bigint",
    select: false,
    insert: false,
  })
  public pr_active_count?: number;
}
