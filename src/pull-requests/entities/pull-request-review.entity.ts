import { Entity, Column, ManyToOne, JoinColumn, BaseEntity, CreateDateColumn, PrimaryColumn } from "typeorm";
import {
  ApiModelProperty,
  ApiModelPropertyOptional,
} from "@nestjs/swagger/dist/decorators/api-model-property.decorator";
import { DbUser } from "../../user/user.entity";
import { DbPullRequest } from "./pull-request.entity";

@Entity("pull_request_reviews")
export class DbPullRequestReview extends BaseEntity {
  @ApiModelProperty({
    description: "Pull request review identifier",
    example: 123456789,
    type: "integer",
  })
  @PrimaryColumn("integer")
  id: number;

  @ManyToOne(() => DbPullRequest)
  @JoinColumn({ name: "pull_request_id" })
  pullRequest: DbPullRequest;

  @ManyToOne(() => DbUser)
  @JoinColumn({ name: "reviewer_login", referencedColumnName: "login" })
  reviewer: DbUser;

  @ApiModelPropertyOptional({
    description: "Timestamp representing pr review creation date",
    example: "2022-08-28 22:04:29.000000",
  })
  @CreateDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  created_at?: Date;

  @ApiModelProperty({
    description: "Timestamp representing pr review published date",
    example: "2022-08-28 22:04:29.000000",
  })
  @Column({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  published_at?: Date;

  @ApiModelProperty({
    description: "Timestamp representing pr review update date",
    example: "2022-08-28 22:04:29.000000",
  })
  @Column({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  updated_at?: Date;

  @Column({ type: "string", nullable: true })
  state?: string;
}
