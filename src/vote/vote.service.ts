import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { DbRepoToUserVotes } from "../repo/entities/repo.to.user.votes.entity";

@Injectable()
export class VoteService {
  constructor(
    @InjectRepository(DbRepoToUserVotes, "ApiConnection")
    private repoVoteRepository: Repository<DbRepoToUserVotes>
  ) {}

  baseQueryBuilder() {
    const builder = this.repoVoteRepository.createQueryBuilder("r2votes").withDeleted();

    return builder;
  }

  async voteByRepoId(repoId: number, userId: number): Promise<DbRepoToUserVotes> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .addSelect("r2votes.deleted_at")
      .where("r2votes.repo_id = :repoId", { repoId })
      .andWhere("r2votes.user_id = :userId", { userId });

    const voteExists = await queryBuilder.getOne();

    if (voteExists) {
      if (!voteExists.deleted_at) {
        throw new ConflictException("You have already voted for this repo");
      }

      await this.repoVoteRepository.restore(voteExists.id);

      return voteExists;
    }

    return this.repoVoteRepository.save({
      repo_id: repoId,
      user_id: userId,
    });
  }

  async downVoteByRepoId(repoId: number, userId: number): Promise<DbRepoToUserVotes> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .addSelect("r2votes.deleted_at")
      .where("r2votes.repo_id = :repoId", { repoId })
      .andWhere("r2votes.user_id = :userId", { userId });

    const voteExists = await queryBuilder.getOne();

    if (!voteExists) {
      throw new NotFoundException("You have not voted for this repo");
    }

    if (voteExists.deleted_at) {
      throw new ConflictException("You have already removed your vote");
    }

    await this.repoVoteRepository.softDelete(voteExists.id);

    return voteExists;
  }
}
