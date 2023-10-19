import { Entity, Column, BaseEntity, PrimaryColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: "customers" })
export class DbCustomer extends BaseEntity {
  @ApiProperty({
    description: "User identifier",
    example: 237133,
  })
  @PrimaryColumn("bigint")
  public id!: number;

  @ApiProperty({
    description: "Stripe Customer Id",
    example: 498,
  })
  @Column({
    type: "character varying",
    length: 50,
  })
  public stripe_customer_id: string;
}
