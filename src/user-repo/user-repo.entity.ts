import {
  Entity,
  BaseEntity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
} from "typeorm";

import { ApiModelProperty, ApiModelPropertyOptional } from "@nestjs/swagger/dist/decorators/api-model-property.decorator";

@Entity({ name: "user_repos" })
export class DbUserRepo extends BaseEntity {
  @ApiModelProperty({
    description: "User Repo identifier",
    example: 237133,
  })
  @PrimaryColumn("bigint")
  public id!: number;

  @ApiModelProperty({
    description: "User identifier",
    example: 237133,
  })
  @Column("bigint")
  public user_id: number;

  @ApiModelProperty({
    description: "Repo identifier",
    example: 237133,
  })
  @Column("bigint")
  public repo_id: number;

  @ApiModelProperty({
    description: "Repo Full Name",
    example: "open-sauced/open-sauced",
  })
  @Column({ type: "text" })
  public full_name: string;

  @ApiModelPropertyOptional({
    description: "Timestamp representing user creation",
    example: "2022-10-19 13:24:51.000000",
  })
  @CreateDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public created_at?: Date;
}
