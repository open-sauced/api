import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  Relation,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ApiHideProperty, ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { DbUser } from "../../user/user.entity";
import { DbRepo } from "./repo.entity";

@Entity({ name: "users_to_repos_stargazers" })
export class DbRepoToUserStargazers {
  @ApiProperty({
    description: "Stargaze identifier",
    example: 196,
    type: "integer",
  })
  @PrimaryGeneratedColumn()
  public id!: number;

  @ApiProperty({
    description: "User identifier",
    example: 237133,
    type: "integer",
  })
  @Column()
  public user_id!: number;

  @ApiProperty({
    description: "Repository identifier",
    example: 71359796,
    type: "integer",
  })
  @Column()
  public repo_id!: number;

  @ApiPropertyOptional({
    description: "Timestamp representing stargaze creation",
    example: "2016-10-19 13:24:51.000000",
  })
  @CreateDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public created_at?: Date;

  @ApiPropertyOptional({
    description: "Timestamp representing stargaze last update",
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
  @ManyToOne(() => DbUser, (user) => user.repoToUserStargazers)
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
  })
  public user!: Relation<DbUser>;

  @ApiHideProperty()
  @ManyToOne(() => DbRepo, (repo) => repo.repoToUserStargazers)
  @JoinColumn({
    name: "repo_id",
    referencedColumnName: "id",
  })
  public repo!: Relation<DbRepo>;
}
