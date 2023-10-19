import { Entity, BaseEntity, PrimaryColumn, Column, CreateDateColumn } from "typeorm";

import { ApiHideProperty, ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

@Entity({ name: "subscriptions" })
export class DbSubscription extends BaseEntity {
  @ApiProperty({
    description: "Subscription identifier",
    example: "sub_1234",
  })
  @PrimaryColumn("text")
  public id!: string;

  @ApiProperty({
    description: "User identifier",
    example: 42211,
  })
  @Column({ type: "bigint" })
  public user_id!: number;

  @ApiProperty({
    description: "Subscription Status",
    example: "active",
  })
  @Column({
    type: "text",
    default: "active",
  })
  public status!: string;

  @ApiHideProperty()
  @Column({
    type: "text",
    select: false,
  })
  public metadata!: string;

  @ApiProperty({
    description: "Price ID",
    example: "price_12345",
  })
  @Column({ type: "text" })
  public price_id!: string;

  @ApiProperty({
    description: "Quantity",
    example: 1,
  })
  @Column({ type: "bigint" })
  public quantity!: number;

  @ApiPropertyOptional({
    description: "Timestamp representing subscription creation",
    example: "2016-10-19 13:24:51.000000",
  })
  @Column({ type: "boolean" })
  public cancel_at_period_end!: boolean;

  @ApiPropertyOptional({
    description: "Timestamp representing subscription creation",
    example: "2016-10-19 13:24:51.000000",
  })
  @CreateDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public created_at?: Date;

  @ApiPropertyOptional({
    description: "Timestamp representing current period start date",
    example: "2016-10-19 13:24:51.000000",
  })
  @Column({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public current_period_start_at?: Date;

  @ApiPropertyOptional({
    description: "Timestamp representing current period end date",
    example: "2016-10-19 13:24:51.000000",
  })
  @Column({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public current_period_end_at?: Date;

  @ApiPropertyOptional({
    description: "Timestamp representing end date",
    example: "2016-10-19 13:24:51.000000",
  })
  @Column({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public ended_at?: Date;

  @ApiPropertyOptional({
    description: "Timestamp representing cancel date",
    example: "2016-10-19 13:24:51.000000",
  })
  @Column({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public cancel_at?: Date;

  @ApiPropertyOptional({
    description: "Timestamp representing canceled date",
    example: "2016-10-19 13:24:51.000000",
  })
  @Column({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public canceled_at?: Date;

  @ApiPropertyOptional({
    description: "Timestamp representing trial start date",
    example: "2016-10-19 13:24:51.000000",
  })
  @Column({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public trial_start_at?: Date;

  @ApiPropertyOptional({
    description: "Timestamp representing trial end date",
    example: "2016-10-19 13:24:51.000000",
  })
  @Column({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public trial_end_at?: Date;
}
