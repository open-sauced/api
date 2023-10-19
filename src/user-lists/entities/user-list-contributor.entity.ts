import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";
import { ApiHideProperty, ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import { DbUser } from "../../user/user.entity";

@Entity({ name: "user_list_contributors" })
export class DbUserListContributor {
  @ApiProperty({
    description: "User list contributor identifier",
    example: "uuid-v4",
  })
  @PrimaryColumn()
  @PrimaryGeneratedColumn()
  public id!: string;

  @ApiProperty({
    description: "User identifier",
    example: 237133,
    type: "integer",
  })
  @Column()
  public user_id!: number;

  @ApiProperty({
    description: "List identifier",
    example: "uuid-v4",
  })
  @Column()
  public list_id!: string;

  @ApiProperty({
    description: "List user source username",
    example: "sauceduser",
  })
  @Column({ type: "text" })
  public username?: string;

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
  @ManyToOne(() => DbUser, (user) => user.user_list_contributors)
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
  })
  public user_list_contributor!: Relation<DbUser>;

  @ApiProperty({
    description: "User list collaborator's login",
    example: "bdougie",
  })
  @Column({
    type: "text",
    select: false,
    insert: false,
  })
  public login?: string;
}
