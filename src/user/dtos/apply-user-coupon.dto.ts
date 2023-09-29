import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ApplyUserCouponDto {
  @ApiProperty({
    description: "Coupon Code",
    type: String,
    example: "saucy",
  })
  @IsString()
  couponCode: string;
}
