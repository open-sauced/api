import { ApiModelProperty } from "@nestjs/swagger/dist/decorators/api-model-property.decorator";
import { Column, Entity } from "typeorm";

@Entity("workspaces")
export class DbRossIndexHistogram {
  @ApiModelProperty({
    description: "Timestamp representing histogram bucket day",
    example: "2022-08-28 22:04:29.000000",
  })
  @Column({
    type: "timestamp without time zone",
    select: false,
    insert: false,
  })
  public bucket: Date;

  @ApiModelProperty({
    description: "Ross index for given time period",
    example: 4,
    type: "integer",
  })
  @Column({
    type: "integer",
    select: false,
    insert: false,
  })
  public index: number;
}

@Entity("workspaces")
export class DbRossContributorsHistogram {
  @ApiModelProperty({
    description: "Timestamp representing histogram bucket day",
    example: "2022-08-28 22:04:29.000000",
  })
  @Column({
    type: "timestamp without time zone",
    select: false,
    insert: false,
  })
  public bucket: Date;

  @ApiModelProperty({
    description:
      "Number of new contributors within time range. These are contributors whose affiliation to a repo is 'NONE'.",
    example: 4,
    type: "integer",
  })
  @Column({
    type: "integer",
    select: false,
    insert: false,
  })
  public new: number;

  @ApiModelProperty({
    description:
      "Number of returning contributors within time range. These are contributors whose affiliation to a repo is 'CONTRIBUTOR'.",
    example: 4,
    type: "integer",
  })
  @Column({
    type: "integer",
    select: false,
    insert: false,
  })
  public returning: number;

  @ApiModelProperty({
    description:
      "Number of internal contributors within time range. These are contributors whose affiliation to a repo is 'MEMBER' - i.e., org members.",
    example: 4,
    type: "integer",
  })
  @Column({
    type: "integer",
    select: false,
    insert: false,
  })
  public internal: number;
}
