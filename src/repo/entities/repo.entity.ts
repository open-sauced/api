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
import { ApiModelProperty, ApiModelPropertyOptional } from "@nestjs/swagger/dist/decorators/api-model-property.decorator";

@Entity({
  name: "repos",
  orderBy: {
    stars: "DESC",
    name: "ASC",
  },
})
export class DbRepo extends BaseEntity {
  @ApiModelProperty({
    description: "Repository identifier",
    example: 71359796,
  })
  @PrimaryColumn("bigint")
  public id!: number;

  @ApiModelProperty({
    description: "Owner user identifier",
    example: 57568598,
  })
  @Column({
    type: "bigint",
    select: false,
  })
  public user_id!: number;

  @ApiModelProperty({
    description: "Total number of issues",
    example: 274,
  })
  @Column({
    type: "bigint",
    default: 0,
  })
  public issues: number;

  @ApiModelProperty({
    description: "Total number of stars",
    example: 5,
  })
  @Column({
    type: "bigint",
    default: 0,
  })
  public stars: number;

  @ApiModelProperty({
    description: "Total number of watchers",
    example: 5473,
  })
  @Column({
    type: "bigint",
    default: 0,
  })
  public watchers: number;

  @ApiModelProperty({
    description: "Total number of subscribers",
    example: 11756,
  })
  @Column({
    type: "bigint",
    default: 0,
  })
  public subscribers: number;

  @ApiModelProperty({
    description: "Flag indicating fork status, false for sources",
    example: false,
  })
  @Column({ default: false })
  public is_fork: boolean;

  @ApiModelPropertyOptional({
    description: "Timestamp representing repository creation",
    example: "2016-10-19 13:24:51.000000",
  })
  @CreateDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public created_at?: Date;

  @ApiModelPropertyOptional({
    description: "Timestamp representing repository last update",
    example: "2022-08-28 22:04:29.000000",
  })
  @UpdateDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public updated_at?: Date;

  @ApiModelPropertyOptional({
    description: "Timestamp representing repository last push",
    example: "2022-08-28 22:04:39.000000",
  })
  @Column({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public pushed_at?: Date;

  @ApiHideProperty()
  @Column({
    type: "timestamp without time zone",
    default: () => "to_timestamp(0)",
  })
  public last_fetched_contributors_at?: Date;

  @ApiHideProperty()
  @DeleteDateColumn({ type: "timestamp without time zone" })
  public deleted_at?: Date;

  @ApiModelProperty({
    description: "Repository unique name",
    example: "open-sauced",
  })
  @Column({
    type: "character varying",
    length: 255,
  })
  public name: string;

  @ApiModelProperty({
    description: "Repository full name",
    example: "open-sauced/open-sauced",
  })
  @Column({
    type: "character varying",
    length: 255,
  })
  public full_name: string;

  @ApiModelProperty({
    description: "Repository short description",
    example: "🍕This is a project to identify your next open source contribution! 🍕",
  })
  @Column("text")
  public description: string;

  @ApiModelProperty({
    description: "Repository programming language",
    example: "JavaScript",
  })
  @Column({
    type: "character varying",
    length: 64,
  })
  public language: string;

  @ApiModelProperty({
    description: "Repository SPDX license",
    example: "MIT",
  })
  @Column({
    type: "character varying",
    length: 64,
  })
  public license: string;

  @ApiModelProperty({
    description: "Repository GitHub linked URL",
    example: "https://app.opensauced.pizza",
  })
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
