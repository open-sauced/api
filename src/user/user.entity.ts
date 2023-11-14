import {
  Entity,
  Column,
  BaseEntity,
  PrimaryColumn,
  OneToMany,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { ApiHideProperty } from "@nestjs/swagger";

import {
  ApiModelProperty,
  ApiModelPropertyOptional,
} from "@nestjs/swagger/dist/decorators/api-model-property.decorator";
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
  @ApiModelProperty({
    description: "User identifier",
    example: 237133,
    type: "integer",
  })
  @PrimaryColumn("bigint")
  public id!: number;

  @ApiModelProperty({
    description: "Total number of open issues user has across public activity",
    example: 498,
    type: "integer",
  })
  @Column({
    type: "bigint",
    default: 0,
  })
  public open_issues: number;

  @ApiModelPropertyOptional({
    description: "Timestamp representing user creation",
    example: "2016-10-19 13:24:51.000000",
  })
  @CreateDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public created_at?: Date;

  @ApiModelPropertyOptional({
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

  @ApiModelPropertyOptional({
    description: "Timestamp representing user first open PR",
    example: "2022-08-28 22:04:29.000000",
  })
  @Column({
    type: "timestamp without time zone",
    default: null,
  })
  public first_opened_pr_at?: Date;

  @ApiModelPropertyOptional({
    description: "Timestamp representing user first commit push",
    example: "2022-08-28 22:04:29.000000",
  })
  @Column({
    type: "timestamp without time zone",
    default: null,
  })
  public first_pushed_commit_at?: Date;

  @ApiModelPropertyOptional({
    description: "Timestamp representing user logging in to open sauced for the first time",
    example: "2022-08-28 22:04:29.000000",
  })
  @Column({
    type: "timestamp without time zone",
    default: null,
  })
  public connected_at?: Date;

  @ApiModelProperty({
    description: "User GitHub node id",
    example: "MDQ6VXNlcjIzNzEzMw==",
  })
  @Column({
    type: "character varying",
    length: 20,
  })
  public node_id: string;

  @ApiModelProperty({
    description: "User GitHub avatar URL",
    example: "https://avatars.githubusercontent.com/u/237133?v=4",
  })
  @Column({
    type: "character varying",
    length: 255,
  })
  public avatar_url: string;

  @ApiModelProperty({
    description: "User GitHub gravatar URL",
    example: "",
  })
  @Column({
    type: "character varying",
    length: 255,
  })
  public gravatar_id?: string;

  @ApiModelProperty({
    description: "User GitHub profile URL",
    example: "https://api.github.com/users/0-vortex",
  })
  @Column({
    type: "character varying",
    length: 255,
  })
  public url?: string;

  @ApiModelProperty({
    description: "User unique login name",
    example: "0-vortex",
  })
  @Column({
    type: "character varying",
    length: 255,
  })
  public login: string;

  @ApiModelProperty({
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

  @ApiModelProperty({
    description: "Flag indicating whether user opted to have a private profile (beta feature",
    example: false,
    default: false,
  })
  @Column({ default: false })
  public is_private: boolean;

  @ApiModelProperty({
    description: "Flag indicating app.opensauced user status",
    example: false,
    default: false,
  })
  @Column({ default: false })
  public is_open_sauced_member: boolean;

  @ApiModelProperty({
    description: "Flag indicating user's onboarding status",
    example: false,
    default: false,
  })
  @Column({ default: false })
  public is_onboarded: boolean;

  @ApiModelProperty({
    description: "Flag indicating user's waitlist status",
    example: false,
    default: false,
  })
  @Column({ default: false })
  public is_waitlisted: boolean;

  @ApiModelProperty({
    description: "Insights Role",
    example: 10,
    default: 10,
    type: "integer",
  })
  @Column({ default: 10 })
  public role: number;

  @ApiModelProperty({
    description: "User bio information",
    example: "OpenSauced User",
  })
  @Column({
    type: "character varying",
    length: 255,
  })
  readonly bio?: string;

  @ApiModelProperty({
    description: "GitHub blog information",
    example: "https://opensauced.pizza/blog",
  })
  @Column({
    type: "character varying",
    length: 255,
  })
  public blog?: string;

  @ApiModelProperty({
    description: "User name information",
    example: "MrPizza",
  })
  @Column({
    type: "character varying",
    length: 255,
  })
  readonly name?: string;

  @ApiModelProperty({
    description: "User Twitter information",
    example: "saucedopen",
  })
  @Column({
    type: "character varying",
    length: 15,
  })
  readonly twitter_username?: string;

  @ApiModelProperty({
    description: "LinkedIn URL",
    example: "https://www.linkedin.com/in/brianldouglas",
  })
  @Column({
    type: "character varying",
    length: 255,
  })
  readonly linkedin_url?: string;

  @ApiModelProperty({
    description: "GitHub Sponsors URL",
    example: "https://github.com/sponsors/open-sauced",
  })
  @Column({
    type: "character varying",
    length: 255,
  })
  readonly github_sponsors_url?: string;

  @ApiModelProperty({
    description: "Discord URL",
    example: "https://discord.gg/opensauced",
  })
  @Column({
    type: "character varying",
    length: 255,
  })
  readonly discord_url?: string;

  @ApiModelProperty({
    description: "User company information",
    example: "OpenSauced",
  })
  @Column({
    type: "character varying",
    length: 255,
  })
  readonly company?: string;

  @ApiModelProperty({
    description: "User location information",
    example: "San Francisco, CA",
  })
  @Column({
    type: "character varying",
    length: 255,
  })
  readonly location?: string;

  @ApiModelProperty({
    description: "User display local time information",
    example: false,
  })
  @Column({
    type: "boolean",
    default: false,
  })
  readonly display_local_time?: boolean;

  @ApiModelProperty({
    description: "User topic interests",
    example: "javascript",
  })
  @Column({
    type: "character varying",
    length: 200,
  })
  readonly interests?: string;

  @ApiModelProperty({
    description: "GitHub user hireable status",
    example: false,
  })
  @Column({
    type: "boolean",
    default: false,
  })
  public hireable?: boolean;

  @ApiModelProperty({
    description: "GitHub user public repos number",
    example: 0,
    type: "integer",
  })
  @Column({
    type: "bigint",
    default: 0,
  })
  public public_repos: number;

  @ApiModelProperty({
    description: "GitHub user public gists number",
    example: 0,
    type: "integer",
  })
  @Column({
    type: "bigint",
    default: 0,
  })
  public public_gists: number;

  @ApiModelProperty({
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

  @ApiModelProperty({
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

  @ApiModelProperty({
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

  @ApiModelProperty({
    description: "User display public email",
    example: false,
  })
  @Column({
    type: "boolean",
    default: false,
  })
  readonly display_email?: boolean;

  @ApiModelProperty({
    description: "User receives collaboration requests",
    example: false,
  })
  @Column({
    type: "boolean",
    default: false,
  })
  readonly receive_collaboration?: boolean;

  @ApiModelProperty({
    description: "User receives product updates through email",
    example: false,
  })
  @Column({
    type: "boolean",
    default: true,
  })
  readonly receive_product_updates?: boolean;

  @ApiModelProperty({
    description: "User timezone in UTC",
    example: "UTC-5",
  })
  @Column({
    type: "character varying",
    length: 50,
  })
  readonly timezone?: string;

  @ApiModelProperty({
    description: "Coupon Code",
    example: "saucy",
  })
  @Column({
    type: "character varying",
    length: 50,
  })
  readonly coupon_code?: string;

  @ApiModelProperty({
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

  @ApiModelProperty({
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

  @ApiModelProperty({
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

  @ApiModelProperty({
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

  @ApiModelProperty({
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

  @ApiModelProperty({
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

  @ApiModelProperty({
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

  @ApiModelProperty({
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

  @ApiModelProperty({
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
  public insights: DbInsight[];

  @ApiHideProperty()
  @OneToMany(() => DbRepo, (repo) => repo.user)
  public repos: DbRepo[];

  @ApiHideProperty()
  @OneToMany(() => DbRepo, (repo) => repo.org_user)
  public repo_orgs: DbRepo[];

  @ApiHideProperty()
  @OneToMany(() => DbUserHighlight, (highlights) => highlights.user, { cascade: true })
  public highlights: DbUserHighlight[];

  @ApiHideProperty()
  @OneToMany(() => DbUserHighlightReaction, (highlightReactions) => highlightReactions.user)
  public reactions: DbUserHighlightReaction[];

  @ApiHideProperty()
  @OneToMany(() => DbUserCollaboration, (collaboration) => collaboration.user, { cascade: true })
  public collaborations: DbUserCollaboration[];

  @ApiHideProperty()
  @OneToMany(() => DbUserCollaboration, (collaboration) => collaboration.request_user, {
    cascade: true,
  })
  public request_collaborations: DbUserCollaboration[];

  @ApiHideProperty()
  @OneToMany(() => DbRepoToUserVotes, (repoToUserVotes) => repoToUserVotes.user)
  public repoToUserVotes: DbRepoToUserVotes[];

  @ApiHideProperty()
  @OneToMany(() => DbRepoToUserStars, (repoToUserStars) => repoToUserStars.user)
  public repoToUserStars: DbRepoToUserStars[];

  @ApiHideProperty()
  @OneToMany(() => DbRepoToUserSubmissions, (repoToUserSubmissions) => repoToUserSubmissions.user)
  public repoToUserSubmissions: DbRepoToUserSubmissions[];

  @ApiHideProperty()
  @OneToMany(() => DbRepoToUserStargazers, (repoToUserStargazers) => repoToUserStargazers.user)
  public repoToUserStargazers: DbRepoToUserStargazers[];

  @ApiHideProperty()
  @OneToMany(() => DbUserTopRepo, (repoToUserTopRepos) => repoToUserTopRepos.user)
  public topRepos: DbUserTopRepo[];

  @ApiHideProperty()
  @OneToMany(() => DbUserNotification, (fromUserNotifications) => fromUserNotifications.from_user)
  public from_user_notifications: DbUserNotification[];

  @ApiHideProperty()
  @OneToMany(() => DbUserOrganization, (userOrgs) => userOrgs.organization_user)
  public organizations: DbUserOrganization[];

  @ApiHideProperty()
  @OneToMany(() => DbUserList, (userLists) => userLists.list_user, { cascade: true })
  public lists: DbUserList[];

  @ApiHideProperty()
  @OneToMany(() => DbUserListContributor, (userLists) => userLists.user_list_contributor)
  public user_list_contributors: DbUserListContributor[];
}
