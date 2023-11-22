import {
  Entity,
  Column,
  BaseEntity,
  PrimaryColumn,
  OneToMany,
  CreateDateColumn,
  DeleteDateColumn,
  Relation,
  UpdateDateColumn,
} from "typeorm";
import { ApiHideProperty, ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import { DbRepo } from "../repo/entities/repo.entity";
import { DbRepoToUserVotes } from "../repo/entities/repo.to.user.votes.entity";
import { DbRepoToUserStars } from "../repo/entities/repo.to.user.stars.entity";
import { DbRepoToUserSubmissions } from "../repo/entities/repo.to.user.submissions.entity";
import { DbRepoToUserStargazers } from "../repo/entities/repo.to.user.stargazers.entity";
import { DbInsight } from "../insight/entities/insight.entity";
import { DbUserList } from "../user-lists/entities/user-list.entity";
import { DbUserListContributor } from "../user-lists/entities/user-list-contributor.entity";
import { DbUserNotification } from "./entities/user-notification.entity";
import { DbUserHighlight } from "./entities/user-highlight.entity";
import { DbUserHighlightReaction } from "./entities/user-highlight-reaction.entity";
import { DbUserTopRepo } from "./entities/user-top-repo.entity";
import { DbUserCollaboration } from "./entities/user-collaboration.entity";
import { DbUserOrganization } from "./entities/user-organization.entity";

@Entity({ name: "users" })
export class DbUser extends BaseEntity {
  @ApiProperty({
    description: "User identifier",
    example: 237133,
    type: "integer",
  })
  @PrimaryColumn("bigint")
  public id!: number;

  @ApiProperty({
    description: "Total number of open issues user has across public activity",
    example: 498,
    type: "integer",
  })
  @Column({
    type: "bigint",
    default: 0,
  })
  public open_issues: number;

  @ApiPropertyOptional({
    description: "Timestamp representing user creation",
    example: "2016-10-19 13:24:51.000000",
  })
  @CreateDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public created_at?: Date;

  @ApiPropertyOptional({
    description: "Timestamp representing user last update",
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

  @ApiHideProperty()
  @Column({
    type: "timestamp without time zone",
    default: () => "to_timestamp(0)",
    select: false,
  })
  public last_fetched_users_at?: Date;

  @ApiPropertyOptional({
    description: "Timestamp representing user first open PR",
    example: "2022-08-28 22:04:29.000000",
  })
  @Column({
    type: "timestamp without time zone",
    default: null,
  })
  public first_opened_pr_at?: Date;

  @ApiPropertyOptional({
    description: "Timestamp representing user first commit push",
    example: "2022-08-28 22:04:29.000000",
  })
  @Column({
    type: "timestamp without time zone",
    default: null,
  })
  public first_pushed_commit_at?: Date;

  @ApiPropertyOptional({
    description: "Timestamp representing user logging in to open sauced for the first time",
    example: "2022-08-28 22:04:29.000000",
  })
  @Column({
    type: "timestamp without time zone",
    default: null,
  })
  public connected_at?: Date;

  @ApiProperty({
    description: "User GitHub node id",
    example: "MDQ6VXNlcjIzNzEzMw==",
  })
  @Column({
    type: "character varying",
    length: 20,
  })
  public node_id: string;

  @ApiProperty({
    description: "User GitHub avatar URL",
    example: "https://avatars.githubusercontent.com/u/237133?v=4",
  })
  @Column({
    type: "character varying",
    length: 255,
  })
  public avatar_url: string;

  @ApiPropertyOptional({
    description: "User GitHub gravatar URL",
    example: "",
  })
  @Column({
    type: "character varying",
    length: 255,
  })
  public gravatar_id?: string;

  @ApiPropertyOptional({
    description: "User GitHub profile URL",
    example: "https://api.github.com/users/0-vortex",
  })
  @Column({
    type: "character varying",
    length: 255,
  })
  public url?: string;

  @ApiProperty({
    description: "User unique login name",
    example: "0-vortex",
  })
  @Column({
    type: "character varying",
    length: 255,
  })
  public login: string;

  @ApiProperty({
    description: "User email address",
    example: "hello@opensauced.pizza",
  })
  @Column({
    type: "character varying",
    length: 255,
    select: false,
  })
  public email: string;

  @ApiHideProperty()
  @Column({
    default: false,
    select: false,
  })
  public has_stars_data: boolean;

  @ApiProperty({
    description: "Flag indicating whether user opted to have a private profile (beta feature",
    example: false,
    default: false,
  })
  @Column({ default: false })
  public is_private: boolean;

  @ApiProperty({
    description: "Flag indicating app.opensauced user status",
    example: false,
    default: false,
  })
  @Column({ default: false })
  public is_open_sauced_member: boolean;

  @ApiProperty({
    description: "Flag indicating user's onboarding status",
    example: false,
    default: false,
  })
  @Column({ default: false })
  public is_onboarded: boolean;

  @ApiProperty({
    description: "Flag indicating user's waitlist status",
    example: false,
    default: false,
  })
  @Column({ default: false })
  public is_waitlisted: boolean;

  @ApiProperty({
    description: "Insights Role",
    example: 10,
    default: 10,
    type: "integer",
  })
  @Column({ default: 10 })
  public role: number;

  @ApiPropertyOptional({
    description: "User bio information",
    example: "OpenSauced User",
  })
  @Column({
    type: "character varying",
    length: 255,
  })
  readonly bio?: string;

  @ApiPropertyOptional({
    description: "GitHub blog information",
    example: "https://opensauced.pizza/blog",
  })
  @Column({
    type: "character varying",
    length: 255,
  })
  public blog?: string;

  @ApiPropertyOptional({
    description: "User name information",
    example: "MrPizza",
  })
  @Column({
    type: "character varying",
    length: 255,
  })
  readonly name?: string;

  @ApiPropertyOptional({
    description: "User Twitter information",
    example: "saucedopen",
  })
  @Column({
    type: "character varying",
    length: 15,
  })
  readonly twitter_username?: string;

  @ApiPropertyOptional({
    description: "LinkedIn URL",
    example: "https://www.linkedin.com/in/brianldouglas",
  })
  @Column({
    type: "character varying",
    length: 255,
  })
  readonly linkedin_url?: string;

  @ApiPropertyOptional({
    description: "GitHub Sponsors URL",
    example: "https://github.com/sponsors/open-sauced",
  })
  @Column({
    type: "character varying",
    length: 255,
  })
  readonly github_sponsors_url?: string;

  @ApiPropertyOptional({
    description: "Discord URL",
    example: "https://discord.gg/opensauced",
  })
  @Column({
    type: "character varying",
    length: 255,
  })
  readonly discord_url?: string;

  @ApiPropertyOptional({
    description: "User company information",
    example: "OpenSauced",
  })
  @Column({
    type: "character varying",
    length: 255,
  })
  readonly company?: string;

  @ApiPropertyOptional({
    description: "User location information",
    example: "San Francisco, CA",
  })
  @Column({
    type: "character varying",
    length: 255,
  })
  readonly location?: string;

  @ApiPropertyOptional({
    description: "User display local time information",
    example: false,
  })
  @Column({
    type: "boolean",
    default: false,
  })
  readonly display_local_time?: boolean;

  @ApiPropertyOptional({
    description: "User topic interests",
    example: "javascript",
  })
  @Column({
    type: "character varying",
    length: 200,
  })
  readonly interests?: string;

  @ApiPropertyOptional({
    description: "GitHub user hireable status",
    example: false,
  })
  @Column({
    type: "boolean",
    default: false,
  })
  public hireable?: boolean;

  @ApiProperty({
    description: "GitHub user public repos number",
    example: 0,
    type: "integer",
  })
  @Column({
    type: "bigint",
    default: 0,
  })
  public public_repos: number;

  @ApiProperty({
    description: "GitHub user public gists number",
    example: 0,
    type: "integer",
  })
  @Column({
    type: "bigint",
    default: 0,
  })
  public public_gists: number;

  @ApiProperty({
    description: "GitHub user public followers number",
    example: 0,
    type: "integer",
  })
  @Column({
    type: "bigint",
    select: false,
    default: 0,
  })
  public followers: number;

  @ApiProperty({
    description: "GitHub user public following number",
    example: 0,
    type: "integer",
  })
  @Column({
    type: "bigint",
    select: false,
    default: 0,
  })
  public following: number;

  @ApiProperty({
    description: "GitHub user type",
    example: "User",
    default: "User",
  })
  @Column({
    type: "character varying",
    length: 20,
    default: "User",
  })
  public type: string;

  @ApiPropertyOptional({
    description: "User display public email",
    example: false,
  })
  @Column({
    type: "boolean",
    default: false,
  })
  readonly display_email?: boolean;

  @ApiPropertyOptional({
    description: "User receives collaboration requests",
    example: false,
  })
  @Column({
    type: "boolean",
    default: false,
  })
  readonly receive_collaboration?: boolean;

  @ApiPropertyOptional({
    description: "User receives product updates through email",
    example: false,
  })
  @Column({
    type: "boolean",
    default: true,
  })
  readonly receive_product_updates?: boolean;

  @ApiPropertyOptional({
    description: "User timezone in UTC",
    example: "UTC-5",
  })
  @Column({
    type: "character varying",
    length: 50,
  })
  readonly timezone?: string;

  @ApiPropertyOptional({
    description: "Coupon Code",
    example: "saucy",
  })
  @Column({
    type: "character varying",
    length: 50,
  })
  readonly coupon_code?: string;

  @ApiProperty({
    description: "GitHub top languages",
    example: "{ TypeScript: 33128, HTML: 453, JavaScript: 90, CSS: 80 }",
    default: {},
  })
  @Column({
    type: "jsonb",
    default: {},
    nullable: false,
  })
  public languages: object;

  @ApiProperty({
    description: "User notification count",
    example: 0,
    type: "integer",
  })
  @Column({
    type: "bigint",
    select: false,
    insert: false,
  })
  public notification_count: number;

  @ApiProperty({
    description: "User insight pages count",
    example: 0,
    type: "integer",
  })
  @Column({
    type: "bigint",
    select: false,
    insert: false,
  })
  public insights_count: number;

  @ApiProperty({
    description: "User highlights count",
    example: 0,
    type: "integer",
  })
  @Column({
    type: "bigint",
    select: false,
    insert: false,
  })
  public highlights_count: number;

  @ApiProperty({
    description: "User following count",
    example: 0,
    type: "integer",
  })
  @Column({
    type: "bigint",
    select: false,
    insert: false,
  })
  public following_count: number;

  @ApiProperty({
    description: "User followers count",
    example: 0,
    type: "integer",
  })
  @Column({
    type: "bigint",
    select: false,
    insert: false,
  })
  public followers_count: number;

  @ApiProperty({
    description: "Count of user pull requests within the last 30 days",
    example: 0,
    type: "integer",
  })
  @Column({
    type: "bigint",
    select: false,
    insert: false,
  })
  public recent_pull_requests_count: number;

  @ApiProperty({
    description: "User average pull request velocity in days over the last 30 days",
    example: 0,
    type: "integer",
  })
  @Column({
    type: "bigint",
    select: false,
    insert: false,
  })
  public recent_pull_request_velocity_count: number;

  @ApiProperty({
    description: "Flag to indicate if user is a maintainer of any repos",
    example: true,
  })
  @Column({
    type: "bigint",
    select: false,
    insert: false,
  })
  public is_maintainer: boolean;

  @ApiHideProperty()
  @OneToMany(() => DbInsight, (insight) => insight.user, { cascade: true })
  public insights: Relation<DbInsight[]>;

  @ApiHideProperty()
  @OneToMany(() => DbRepo, (repo) => repo.user)
  public repos: Relation<DbRepo[]>;

  @ApiHideProperty()
  @OneToMany(() => DbRepo, (repo) => repo.org_user)
  public repo_orgs: Relation<DbRepo[]>;

  @ApiHideProperty()
  @OneToMany(() => DbUserHighlight, (highlights) => highlights.user, { cascade: true })
  public highlights: Relation<DbUserHighlight[]>;

  @ApiHideProperty()
  @OneToMany(() => DbUserHighlightReaction, (highlightReactions) => highlightReactions.user)
  public reactions: Relation<DbUserHighlightReaction[]>;

  @ApiHideProperty()
  @OneToMany(() => DbUserCollaboration, (collaboration) => collaboration.user, { cascade: true })
  public collaborations: Relation<DbUserCollaboration[]>;

  @ApiHideProperty()
  @OneToMany(() => DbUserCollaboration, (collaboration) => collaboration.request_user, { cascade: true })
  public request_collaborations: Relation<DbUserCollaboration[]>;

  @ApiHideProperty()
  @OneToMany(() => DbRepoToUserVotes, (repoToUserVotes) => repoToUserVotes.user)
  public repoToUserVotes: Relation<DbRepoToUserVotes[]>;

  @ApiHideProperty()
  @OneToMany(() => DbRepoToUserStars, (repoToUserStars) => repoToUserStars.user)
  public repoToUserStars: Relation<DbRepoToUserStars[]>;

  @ApiHideProperty()
  @OneToMany(() => DbRepoToUserSubmissions, (repoToUserSubmissions) => repoToUserSubmissions.user)
  public repoToUserSubmissions: Relation<DbRepoToUserSubmissions[]>;

  @ApiHideProperty()
  @OneToMany(() => DbRepoToUserStargazers, (repoToUserStargazers) => repoToUserStargazers.user)
  public repoToUserStargazers: Relation<DbRepoToUserStargazers[]>;

  @ApiHideProperty()
  @OneToMany(() => DbUserTopRepo, (repoToUserTopRepos) => repoToUserTopRepos.user)
  public topRepos: Relation<DbUserTopRepo[]>;

  @ApiHideProperty()
  @OneToMany(() => DbUserNotification, (fromUserNotifications) => fromUserNotifications.from_user)
  public from_user_notifications: Relation<DbUserNotification[]>;

  @ApiHideProperty()
  @OneToMany(() => DbUserOrganization, (userOrgs) => userOrgs.organization_user)
  public organizations: Relation<DbUserOrganization[]>;

  @ApiHideProperty()
  @OneToMany(() => DbUserList, (userLists) => userLists.list_user, { cascade: true })
  public lists: Relation<DbUserList[]>;

  @ApiHideProperty()
  @OneToMany(() => DbUserListContributor, (userLists) => userLists.user_list_contributor)
  public user_list_contributors: Relation<DbUserListContributor[]>;
}
