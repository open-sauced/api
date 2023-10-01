import { Repository, SelectQueryBuilder } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { Injectable } from "@nestjs/common";

import { DbUser } from "../user/user.entity";
import { DbTimezone } from "./entities/timezones.entity";

@Injectable()
export class TimezoneService {
  constructor(
    @InjectRepository(DbUser, "ApiConnection")
    private userRepository: Repository<DbUser>
  ) {}

  baseQueryBuilder(): SelectQueryBuilder<DbUser> {
    const builder = this.userRepository.createQueryBuilder("users");

    return builder;
  }

  async findAll(): Promise<DbTimezone[]> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder.select("users.timezone").distinct(true);

    const items = await queryBuilder.getMany();

    return items.map((item) => ({ timezone: item.timezone })) as DbTimezone[];
  }
}
