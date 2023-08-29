import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ApiHideProperty } from "@nestjs/swagger";
import {
  ApiModelProperty,
  ApiModelPropertyOptional,
} from "@nestjs/swagger/dist/decorators/api-model-property.decorator";
import { DbUser } from "../../user/user.entity";
import { DbRepo } from "./repo.entity";

@Entity({ name: "users_to_repos_votes" })
export class DbRepoToUserVotes {
  @ApiModelProperty({
    description: "Vote identifier",
    example: 196,
    type: "integer",
  })
  @PrimaryGeneratedColumn()
  public id!: number;

  @ApiModelProperty({
    description: "User identifier",
    example: 237133,
    type: "integer",
  })
  @Column()
  public user_id!: number;

  @ApiModelProperty({
    description: "Repository identifier",
    example: 71359796,
    type: "integer",
  })
  @Column()
  public repo_id!: number;

  @ApiModelPropertyOptional({
    description: "Timestamp representing vote creation",
    example: "2016-10-19 13:24:51.000000",
  })
  @CreateDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public created_at?: Date;

  @ApiModelPropertyOptional({
    description: "Timestamp representing vote last update",
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
  @ManyToOne(() => DbUser, (user) => user.repoToUserVotes)
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
  })
  public user!: DbUser;

  @ApiHideProperty()
  @ManyToOne(() => DbRepo, (repo) => repo.repoToUserVotes)
  @JoinColumn({
    name: "repo_id",
    referencedColumnName: "id",
  })
  public repo!: DbRepo;
}
