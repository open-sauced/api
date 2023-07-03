import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { DbRepoToUserSubmissions } from "../repo/entities/repo.to.user.submissions.entity";

@Injectable()
export class SubmitService {
  constructor(
    @InjectRepository(DbRepoToUserSubmissions, "ApiConnection")
    private repoSubmitRepository: Repository<DbRepoToUserSubmissions>
  ) {}

  baseQueryBuilder() {
    const builder = this.repoSubmitRepository.createQueryBuilder("r2submits").withDeleted();

    return builder;
  }

  async submitByRepoId(repoId: number, userId: number): Promise<DbRepoToUserSubmissions> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder.where("r2submits.repo_id = :repoId", { repoId }).andWhere("r2submits.user_id = :userId", { userId });

    const submitExists = await queryBuilder.getOne();

    if (submitExists) {
      if (!submitExists.deleted_at) {
        throw new ConflictException("You have already submitd for this repo");
      }

      await this.repoSubmitRepository.restore(submitExists.id);

      return submitExists;
    }

    return this.repoSubmitRepository.save({
      repo_id: repoId,
      user_id: userId,
    });
  }

  async downSubmitByRepoId(repoId: number, userId: number): Promise<DbRepoToUserSubmissions> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder.where("r2submits.repo_id = :repoId", { repoId }).andWhere("r2submits.user_id = :userId", { userId });

    const submitExists = await queryBuilder.getOne();

    if (!submitExists) {
      throw new NotFoundException("You have not submitd for this repo");
    }

    if (submitExists.deleted_at) {
      throw new ConflictException("You have already removed your submit");
    }

    await this.repoSubmitRepository.softDelete(submitExists.id);

    return submitExists;
  }
}
