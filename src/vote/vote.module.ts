import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DbRepo } from "../repo/entities/repo.entity";
import { RepoToUserVotes } from "../repo/entities/repo.to.user.votes.entity";
import { RepoService } from "../repo/repo.service";
import { VoteService } from "./vote.service";
import { RepoVoteController } from "./repo-vote.controller";

@Module({
  imports: [TypeOrmModule.forFeature([
    DbRepo,
    RepoToUserVotes
  ])],
  controllers: [RepoVoteController],
  providers: [RepoService, VoteService],
  exports: [VoteService],
})
export class VoteModule {}
