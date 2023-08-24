import { Entity, BaseEntity, PrimaryColumn, Column } from "typeorm";
import { ApiModelProperty } from "@nestjs/swagger/dist/decorators/api-model-property.decorator";

@Entity({ name: "pull_requests" })
export class DbPRInsight extends BaseEntity {
  @ApiModelProperty({
    description: "Repository identifier",
    example: 71359796,
    type: "integer",
  })
  @PrimaryColumn({
    type: "bigint",
    select: false,
  })
  public id!: number;

  @ApiModelProperty({
    description: "Selected interval in numerical days, goes back with number, 0 means today",
    example: 1,
    default: 0,
    type: "integer",
  })
  @Column({
    type: "integer",
    default: 0,
    select: false,
  })
  public interval: number;

  @ApiModelProperty({
    description: "Selected interval computed date in human readable format",
    example: "2022-08-28 22:04:39.000000",
    type: "date-time",
  })
  @Column({
    type: "timestamp without time zone",
    default: () => "now()",
    select: false,
  })
  public day: Date;

  @ApiModelProperty({
    description: "PR Type: all requests count",
    example: 287,
    type: "integer",
  })
  @Column({
    type: "integer",
    default: 0,
    select: false,
  })
  public all_prs: number;

  @ApiModelProperty({
    description: "PR Type: accepted requests count",
    example: 287,
    type: "integer",
  })
  @Column({
    type: "integer",
    default: 0,
    select: false,
  })
  public accepted_prs: number;

  @ApiModelProperty({
    description: "PR Type: spam requests count",
    example: 287,
    type: "integer",
  })
  @Column({
    type: "integer",
    default: 0,
    select: false,
  })
  public spam_prs: number;
}
