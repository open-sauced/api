import {
  Entity,
  Column,
  BaseEntity,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";

import {
  ApiModelProperty,
  ApiModelPropertyOptional,
} from "@nestjs/swagger/dist/decorators/api-model-property.decorator";
import { ApiHideProperty } from "@nestjs/swagger";

import { DbUser } from "../../user/user.entity";
import { DbInsightRepo } from "./insight-repo.entity";

@Entity({ name: "insights" })
export class DbInsight extends BaseEntity {
  @ApiModelProperty({
    description: "Insight identifier",
    example: 237133,
    type: "integer",
  })
  @PrimaryColumn()
  @PrimaryGeneratedColumn()
  public id!: number;

  @ApiModelProperty({
    description: "User ID",
    example: 237133,
    type: "integer",
  })
  @Column({
    type: "bigint",
    select: false,
  })
  public user_id: number;

  @ApiModelProperty({
    description: "Insight Page Name",
    example: "Open Sauced Team",
  })
  @Column({
    type: "character varying",
    length: 255,
  })
  public name: string;

  @ApiModelProperty({
    description: "Flag indicating insight visibility",
    example: false,
  })
  @Column({ default: false })
  public is_public: boolean;

  @ApiModelProperty({
    description: "Flag indicating insight favorite",
    example: false,
  })
  @Column({ default: false })
  public is_favorite: boolean;

  @ApiModelProperty({
    description: "Title",
    example: "Insight Page Short Code",
  })
  @Column({
    type: "character varying",
    length: 25,
  })
  public short_code: string;

  @ApiModelPropertyOptional({
    description: "Timestamp representing insight creation",
    example: "2022-10-19 13:24:51.000000",
  })
  @CreateDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public created_at?: Date;

  @ApiModelPropertyOptional({
    description: "Timestamp representing insight last updated",
    example: "2022-10-19 13:24:51.000000",
  })
  @UpdateDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public updated_at?: Date;

  @ApiModelPropertyOptional({
    description: "Timestamp representing insight deletion",
    example: "2022-10-19 13:24:51.000000",
  })
  @DeleteDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public deleted_at?: Date;

  @ApiHideProperty()
  @ManyToOne(() => DbUser, (user) => user.insights)
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
  })
  public user!: DbUser;

  @ApiHideProperty()
  @OneToMany(() => DbInsightRepo, (insightRepo) => insightRepo.insight)
  public repos: DbInsightRepo[];
}
