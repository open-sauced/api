import { Entity, BaseEntity, CreateDateColumn, DeleteDateColumn, PrimaryColumn } from "typeorm";

import {
  ApiModelProperty,
  ApiModelPropertyOptional,
} from "@nestjs/swagger/dist/decorators/api-model-property.decorator";

@Entity({ name: "coupons" })
export class DbCoupon extends BaseEntity {
  @ApiModelProperty({
    description: "Coupon identifier",
    example: "saucy",
    type: "string",
  })
  @PrimaryColumn({ type: "text" })
  public code: string;

  @ApiModelPropertyOptional({
    description: "Timestamp representing highlight creation date",
    example: "2023-01-19 13:24:51.000000",
  })
  @CreateDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public created_at?: Date;

  @ApiModelPropertyOptional({
    description: "Timestamp representing coupon expiration date",
    example: "2023-01-19 13:24:51.000000",
  })
  @DeleteDateColumn({ type: "timestamp without time zone" })
  public expired_at?: Date;
}
