import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { DbCoupon } from "./entities/coupon.entity";

@Injectable()
export class CouponService {
  constructor(
    @InjectRepository(DbCoupon, "ApiConnection")
    private couponRepository: Repository<DbCoupon>
  ) {}

  baseQueryBuilder() {
    const builder = this.couponRepository.createQueryBuilder("coupons").withDeleted();

    return builder;
  }

  async findCoupon(code: string) {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder.where("code = :code", { code }).andWhere(`(expired_at IS NULL OR expired_at > now())`);

    const entity = await queryBuilder.getOne();

    if (!entity) {
      throw new NotFoundException("The coupon does not exist");
    }

    return entity;
  }

  async deleteCoupon(code: string) {
    return this.couponRepository.softDelete(code);
  }
}
