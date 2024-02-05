import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";

import { DbCoupon } from "./entities/coupon.entity";

@Injectable()
export class CouponService {
  constructor(
    @InjectRepository(DbCoupon, "ApiConnection")
    private couponRepository: Repository<DbCoupon>,
    private configService: ConfigService
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

  async checkDeveloperPack(token: string) {
    try {
      const response = await fetch(this.configService.get<string>("github.developerPackApi")!, {
        headers: {
          Authorization: `token ${token}`,
        },
      });

      if (response.ok) {
        const data: { student: boolean } = (await response.json()) as { student: boolean };

        return data.student;
      }

      return false;
    } catch (e) {
      return false;
    }
  }
}
