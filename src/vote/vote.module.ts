import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DbRepo } from "../repo/entities/repo.entity";
import { DbRepoToUserVotes } from "../repo/entities/repo.to.user.votes.entity";
import { RepoModule } from "../repo/repo.module";
import { VoteService } from "./vote.service";
import { RepoVoteController } from "./repo-vote.controller";

@Module({
  imports: [TypeOrmModule.forFeature([DbRepo, DbRepoToUserVotes], "ApiConnection"), RepoModule],
  controllers: [RepoVoteController],
  providers: [VoteService],
  exports: [VoteService],
})
export class VoteModule {}
