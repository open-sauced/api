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

  baseQueryBuilder (): SelectQueryBuilder<DbUser> {
    const builder = this.userRepository.createQueryBuilder("users");

    return builder;
  }

  async findOneById (id: number): Promise<DbUser> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder.where("id = :id", { id });

    let item: DbUser | null;

    try {
      item = await queryBuilder.getOne();
    } catch (e) {
      // handle error
      item = null;
    }

    if (!item) {
      throw new NotFoundException("User Not Found");
    }

    return item;
  }

  async updateOnboarding (id: number) {
    try {
      await this.findOneById(id);

      await this.userRepository.update(id, { is_onboarded: true });
    } catch (e) {
      // handle error
    }
  }
}
