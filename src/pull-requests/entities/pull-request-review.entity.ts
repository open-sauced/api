import { Entity, Column, ManyToOne, JoinColumn, BaseEntity, CreateDateColumn, PrimaryColumn } from "typeorm";
import {
  ApiModelProperty,
  ApiModelPropertyOptional,
} from "@nestjs/swagger/dist/decorators/api-model-property.decorator";
import { DbPullRequest } from "./pull-request.entity";

@Entity("pull_request_reviews")
export class DbPullRequestReview extends BaseEntity {
  @ApiModelProperty({
    description: "Pull request review identifier",
    example: 123456789,
    type: "integer",
  })
  @PrimaryColumn("integer")
  public id: number;

  @ManyToOne(() => DbPullRequest)
  @JoinColumn({ name: "pull_request_id" })
  public pullRequest: DbPullRequest;

  @ApiModelProperty({
    description: "Pull request reviewer username",
    example: "Bdougie",
  })
  @Column("text")
  public reviewer_login: string;

  @ApiModelPropertyOptional({
    description: "Timestamp representing pr review creation date",
    example: "2022-08-28 22:04:29.000000",
  })
  @CreateDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public created_at?: Date;

  @ApiModelProperty({
    description: "Timestamp representing pr review published date",
    example: "2022-08-28 22:04:29.000000",
  })
  @Column({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public published_at?: Date;

  @ApiModelProperty({
    description: "Timestamp representing pr review update date",
    example: "2022-08-28 22:04:29.000000",
  })
  @Column({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public updated_at?: Date;

  @ApiModelProperty({
    description: "Pull request review state",
    example: "approved",
  })
  @Column("text")
  public state?: string;
}
