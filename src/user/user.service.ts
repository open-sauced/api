import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository, SelectQueryBuilder } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { DbUser } from "./user.entity";

@Injectable()
export class UserService {
  constructor (
    @InjectRepository(DbUser)
    private userRepository: Repository<DbUser>,
  ) {}

  baseQueryBuilder() {
    const builder = this.userRepository.createQueryBuilder("users")

    return builder;
  }

  async findOneById(id: number): Promise<DbUser> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .where("id = :id", { id });

    const item = await queryBuilder.getOne();

    if (!item) {
      throw (new NotFoundException);
    }

    return item;
  }

  async updateOnboarding(id: number) {
    await this.findOneById(id);

    this.userRepository.update(id, { is_onboarded: true });
  }
}
