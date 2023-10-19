import { Entity, BaseEntity, CreateDateColumn, DeleteDateColumn, PrimaryColumn } from "typeorm";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

@Entity({ name: "coupons" })
export class DbCoupon extends BaseEntity {
  @ApiProperty({
    description: "Coupon identifier",
    example: "saucy",
    type: "string",
  })
  @PrimaryColumn({ type: "text" })
  public code: string;

  @ApiPropertyOptional({
    description: "Timestamp representing highlight creation date",
    example: "2023-01-19 13:24:51.000000",
  })
  @CreateDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public created_at?: Date;

  @ApiPropertyOptional({
    description: "Timestamp representing coupon expiration date",
    example: "2023-01-19 13:24:51.000000",
  })
  @DeleteDateColumn({ type: "timestamp without time zone" })
  public expired_at?: Date;
}
