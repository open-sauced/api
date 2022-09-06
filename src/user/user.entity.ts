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

import { DbRepo } from "../repo/entities/repo.entity";
import { DbRepoToUserVotes } from "../repo/entities/repo.to.user.votes.entity";
import { DbRepoToUserStars } from "../repo/entities/repo.to.user.stars.entity";
import { DbRepoToUserSubmissions } from "../repo/entities/repo.to.user.submissions.entity";
import { DbRepoToUserStargazers } from "../repo/entities/repo.to.user.stargazers.entity";
import { ApiModelProperty, ApiModelPropertyOptional } from "@nestjs/swagger/dist/decorators/api-model-property.decorator";

@Entity({ name: "users" })
export class DbUser extends BaseEntity {
  @ApiModelProperty({
    description: "User identifier",
    example: 237133,
  })
  @PrimaryColumn("bigint")
  public id!: number;

  @ApiModelProperty({
    description: "Total number of open issues user has across public activity",
    example: 498,
  })
  @Column({
    type: "bigint",
    default: 0,
  })
  public open_issues: number;

  @ApiHideProperty()
  @Column({ default: false })
  public has_stars_data: boolean;

  @ApiModelProperty({
    description: "Flag indicating whether user opted to have a private profile (beta feature",
    example: false,
  })
  @Column({ default: false })
  public is_private: boolean;

  @ApiModelProperty({
    description: "Flag indicating app.opensauced user status",
    example: false,
  })
  @Column({ default: false })
  public is_open_sauced_member: boolean;

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

  @ApiModelProperty({
    description: "User unique login name",
    example: "0-vortex",
  })
  @Column({
    type: "character varying",
    length: 255,
  })
  public login: string;

  @ApiHideProperty()
  @DeleteDateColumn({
    type: "timestamp without time zone",
    select: false,
  })
  public deleted_at?: Date;

  @ApiHideProperty()
  @OneToMany(() => DbRepo, repo => repo.user)
  public repos: DbRepo[];

  @ApiHideProperty()
  @OneToMany(() => DbRepoToUserVotes, repoToUserVotes => repoToUserVotes.user)
  public repoToUserVotes: DbRepoToUserVotes[];

  @ApiHideProperty()
  @OneToMany(() => DbRepoToUserStars, repoToUserStars => repoToUserStars.user)
  public repoToUserStars: DbRepoToUserStars[];

  @ApiHideProperty()
  @OneToMany(() => DbRepoToUserSubmissions, repoToUserSubmissions => repoToUserSubmissions.user)
  public repoToUserSubmissions: DbRepoToUserSubmissions[];

  @ApiHideProperty()
  @OneToMany(() => DbRepoToUserStargazers, repoToUserStargazers => repoToUserStargazers.user)
  public repoToUserStargazers: DbRepoToUserStargazers[];
}
