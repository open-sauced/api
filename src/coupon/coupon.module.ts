import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DbCoupon } from "./entities/coupon.entity";
import { CouponService } from "./coupon.service";

@Module({
  imports: [TypeOrmModule.forFeature([DbCoupon], "ApiConnection")],
  providers: [CouponService],
  exports: [CouponService],
})
export class CouponModule {}
