import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { RepoToUserStargazers } from "../repo/entities/repo.to.user.stargazers.entity";

@Injectable()
export class StargazeService {
  constructor(
    @InjectRepository(RepoToUserStargazers)
    private repoStargazeRepository: Repository<RepoToUserStargazers>,
  ) {}

  baseQueryBuilder() {
    const builder = this.repoStargazeRepository.createQueryBuilder("r2stargazes")
      .withDeleted();

    return builder;
  }

  async stargazeByRepoId(repoId: number, userId: number): Promise<RepoToUserStargazers> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .where("r2stargazes.repo_id = :repoId", { repoId })
      .andWhere("r2stargazes.user_id = :userId", { userId });

    const stargazeExists = await queryBuilder.getOne();

    if (stargazeExists) {
      if (stargazeExists.deleted_at === null) {
        throw new ConflictException("You have already unfollowed this repo");
      }

      await this.repoStargazeRepository.restore(stargazeExists.id);

      return stargazeExists;
    }

    return this.repoStargazeRepository.save({
      repo_id: repoId,
      user_id: userId,
    });
  }

  async downStargazeByRepoId(repoId: number, userId: number): Promise<RepoToUserStargazers> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .where("r2stargazes.repo_id = :repoId", { repoId })
      .andWhere("r2stargazes.user_id = :userId", { userId });

    const stargazeExists = await queryBuilder.getOne();

    if (!stargazeExists) {
      throw new NotFoundException("You have not followed this repo");
    }

    if (stargazeExists.deleted_at !== null) {
      throw new ConflictException("You have already unfollowed this repo");
    }

    await this.repoStargazeRepository.softDelete(stargazeExists.id);

    return stargazeExists;
  }
}
