import { Entity, BaseEntity, Column, PrimaryColumn, CreateDateColumn } from "typeorm";

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

@Entity({ name: "user_repos" })
export class DbUserRepo extends BaseEntity {
  @ApiProperty({
    description: "User Repo identifier",
    example: 237133,
  })
  @PrimaryColumn("bigint")
  public id!: number;

  @ApiProperty({
    description: "User identifier",
    example: 237133,
  })
  @Column("bigint")
  public user_id: number;

  @ApiProperty({
    description: "Repo identifier",
    example: 237133,
  })
  @Column("bigint")
  public repo_id: number;

  @ApiProperty({
    description: "Repo Full Name",
    example: "open-sauced/insights",
  })
  @Column({ type: "text" })
  public full_name: string;

  @ApiPropertyOptional({
    description: "Timestamp representing user creation",
    example: "2022-10-19 13:24:51.000000",
  })
  @CreateDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public created_at?: Date;
}
