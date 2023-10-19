import { Entity, Column, BaseEntity, PrimaryColumn, CreateDateColumn, JoinColumn, ManyToOne, Relation } from "typeorm";
import { ApiHideProperty, ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { DbUser } from "../user.entity";
import { UserNotificationTypes } from "./user-notification.constants";

@Entity({ name: "user_notifications" })
export class DbUserNotification extends BaseEntity {
  @ApiProperty({
    description: "Notification identifier",
    example: 237133,
    type: "integer",
  })
  @PrimaryColumn("bigint")
  public id!: number;

  @ApiProperty({
    description: "User ID",
    example: 498,
    type: "integer",
  })
  @Column({ type: "bigint" })
  public user_id: number;

  @ApiProperty({
    description: "From User ID",
    example: 43311,
    type: "integer",
  })
  @Column({ type: "bigint" })
  public from_user_id?: number;

  @ApiProperty({
    description: "User notification type",
    example: "welcome",
  })
  @Column({
    type: "character varying",
    enum: UserNotificationTypes,
    length: 25,
  })
  public type: string;

  @ApiProperty({
    description: "User notification message",
    example: "bdougie followed you",
  })
  @Column({
    type: "character varying",
    length: 100,
  })
  public message?: string;

  @ApiPropertyOptional({
    description: "Timestamp representing db-user-notification creation",
    example: "2022-10-19 13:24:51.000000",
  })
  @CreateDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public notified_at?: Date;

  @ApiPropertyOptional({
    description: "Timestamp representing user notification read date",
    example: "2023-04-19 13:24:51.000000",
  })
  @Column({
    type: "timestamp without time zone",
  })
  public read_at?: Date;

  @ApiProperty({
    description: "Notification Source ID (highlight, user, invite)",
    example: "133",
  })
  @Column({
    type: "character varying",
    length: 32,
  })
  public meta_id?: string;

  @ApiHideProperty()
  @ManyToOne(() => DbUser, (user) => user.from_user_notifications)
  @JoinColumn({
    name: "from_user_id",
    referencedColumnName: "id",
  })
  public from_user: Relation<DbUser>;
}
