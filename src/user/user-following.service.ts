import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { DbUserToUserFollows } from "./entities/user-follows.entity";

@Injectable()
export class UserFollowingService {
  constructor(
    @InjectRepository(DbUserToUserFollows, "ApiConnection")
    private userFollowRepository: Repository<DbUserToUserFollows>
  ) {}

  baseQueryBuilder() {
    return this.userFollowRepository.createQueryBuilder("user_follows").withDeleted();
  }

  async findAllFollowingList(userId: number): Promise<DbUserToUserFollows[]> {
    const queryBuilder = this.baseQueryBuilder();

    return queryBuilder
      .innerJoin("users", "users", "user_follows.user_id=users.id")
      .where("user_follows.user_id = :userId", { userId })
      .andWhere("user_follows.deleted_at IS NULL")
      .getMany();
  }
}
