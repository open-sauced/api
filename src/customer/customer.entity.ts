import { Entity, Column, BaseEntity, PrimaryColumn } from "typeorm";

import { ApiModelProperty } from "@nestjs/swagger/dist/decorators/api-model-property.decorator";

@Entity({ name: "customers" })
export class DbCustomer extends BaseEntity {
  @ApiModelProperty({
    description: "User identifier",
    example: 237133,
  })
  @PrimaryColumn("bigint")
  public id!: number;

  @ApiModelProperty({
    description: "Stripe Customer Id",
    example: 498,
  })
  @Column({
    type: "character varying",
    length: 50,
  })
  public stripe_customer_id: string;
}
