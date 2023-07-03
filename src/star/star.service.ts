import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { DbRepoToUserStars } from "../repo/entities/repo.to.user.stars.entity";

@Injectable()
export class StarService {
  constructor(
    @InjectRepository(DbRepoToUserStars, "ApiConnection")
    private repoStarRepository: Repository<DbRepoToUserStars>
  ) {}

  baseQueryBuilder() {
    const builder = this.repoStarRepository.createQueryBuilder("r2stars").withDeleted();

    return builder;
  }

  async starByRepoId(repoId: number, userId: number): Promise<DbRepoToUserStars> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder.where("r2stars.repo_id = :repoId", { repoId }).andWhere("r2stars.user_id = :userId", { userId });

    const starExists = await queryBuilder.getOne();

    if (starExists) {
      if (!starExists.deleted_at) {
        throw new ConflictException("You have already starred this repo");
      }

      await this.repoStarRepository.restore(starExists.id);

      return starExists;
    }

    return this.repoStarRepository.save({
      repo_id: repoId,
      user_id: userId,
    });
  }

  async downStarByRepoId(repoId: number, userId: number): Promise<DbRepoToUserStars> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder.where("r2stars.repo_id = :repoId", { repoId }).andWhere("r2stars.user_id = :userId", { userId });

    const starExists = await queryBuilder.getOne();

    if (!starExists) {
      throw new NotFoundException("You have not starred this repo");
    }

    if (starExists.deleted_at) {
      throw new ConflictException("You have already removed your star");
    }

    await this.repoStarRepository.softDelete(starExists.id);

    return starExists;
  }
}
