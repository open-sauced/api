import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { DbUserToUserFollows } from "./entities/user-follows.entity";
import { UserNotificationService } from "./user-notifcation.service";
import { UserService } from "./services/user.service";

@Injectable()
export class UserFollowService {
  constructor(
    @InjectRepository(DbUserToUserFollows, "ApiConnection")
    private userFollowRepository: Repository<DbUserToUserFollows>,
    private userService: UserService,
    private userNotificationService: UserNotificationService
  ) {}

  baseQueryBuilder() {
    const builder = this.userFollowRepository.createQueryBuilder("user_follows").withDeleted();

    return builder;
  }

  async findAllFollowers(userId: number) {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .innerJoin("users", "users", "user_follows.user_id=users.id")
      .where("user_follows.following_user_id = :userId", { userId })
      .andWhere("user_follows.deleted_at IS NULL");

    const entities = await queryBuilder.getMany();

    return entities;
  }

  async findUserFollowerById(userId: number, followerUserId: number): Promise<DbUserToUserFollows> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .where("user_follows.user_id = :userId", { userId })
      .andWhere("user_follows.following_user_id = :followerUserId", { followerUserId })
      .andWhere("user_follows.deleted_at IS NULL");
    const followExists = await queryBuilder.getOne();

    if (!followExists) {
      throw new NotFoundException("You are not following this user");
    }

    return followExists;
  }

  async addUserFollowerByUserId(userId: number, followedUserId: number): Promise<DbUserToUserFollows> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .addSelect("user_follows.deleted_at", "user_follows_deleted_at")
      .where("user_follows.user_id = :userId", { userId })
      .andWhere("user_follows.following_user_id = :followedUserId", { followedUserId });

    const followExists = await queryBuilder.getOne();

    if (followExists) {
      if (!followExists.deleted_at) {
        throw new ConflictException("You have already followed this user");
      }

      await this.userFollowRepository.restore(followExists.id);
      await this.userNotificationService.addUserFollowerNotification(userId, followedUserId);

      return followExists;
    }

    await this.userNotificationService.addUserFollowerNotification(userId, followedUserId);

    return this.userFollowRepository.save({
      user_id: userId,
      following_user_id: followedUserId,
    });
  }

  async removeUserFollowerById(userId: number, followerUserId: number): Promise<DbUserToUserFollows> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .addSelect("user_follows.deleted_at", "user_follows_deleted_at")
      .where("user_follows.user_id = :userId", { userId })
      .andWhere("user_follows.following_user_id = :followerUserId", { followerUserId });

    const followExists = await queryBuilder.getOne();

    if (!followExists) {
      throw new NotFoundException("You have not followed this user");
    }

    if (followExists.deleted_at) {
      throw new ConflictException("You are not following this user");
    }

    await this.userFollowRepository.softDelete(followExists.id);

    return queryBuilder.getOneOrFail();
  }
}
