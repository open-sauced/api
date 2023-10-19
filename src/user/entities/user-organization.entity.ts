import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";
import { ApiHideProperty, ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import { DbUser } from "../user.entity";

@Entity({ name: "user_organizations" })
export class DbUserOrganization {
  @ApiProperty({
    description: "User organization identifier",
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
    description: "Organization identifier",
    example: 71359796,
    type: "integer",
  })
  @Column()
  public organization_id!: number;

  @ApiPropertyOptional({
    description: "Timestamp representing top repo first index",
    example: "2016-10-19 13:24:51.000000",
  })
  @CreateDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public created_at?: Date;

  @ApiHideProperty()
  @DeleteDateColumn({
    type: "timestamp without time zone",
    select: false,
  })
  public deleted_at?: Date;

  @ApiHideProperty()
  @ManyToOne(() => DbUser, (user) => user.organizations)
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
  })
  public user!: Relation<DbUser>;

  @ApiHideProperty()
  @ManyToOne(() => DbUser, (user) => user.organizations)
  @JoinColumn({
    name: "organization_id",
    referencedColumnName: "id",
  })
  public organization_user: Relation<DbUser>;
}
