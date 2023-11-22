import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DbRepo } from "../repo/entities/repo.entity";
import { RepoModule } from "../repo/repo.module";
import { DbUser } from "../user/user.entity";
import { DbPullRequest } from "../pull-requests/entities/pull-request.entity";
import { DbContribution } from "./contribution.entity";
import { ContributionService } from "./contribution.service";
import { RepoContributionsController } from "./repo-contributions.controller";

@Module({
  imports: [TypeOrmModule.forFeature([DbRepo, DbContribution, DbUser, DbPullRequest], "ApiConnection"), RepoModule],
  controllers: [RepoContributionsController],
  providers: [ContributionService],
  exports: [ContributionService],
})
export class ContributionModule {}
