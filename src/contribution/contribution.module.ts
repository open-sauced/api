import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DbRepo } from "../repo/entities/repo.entity";
import { DbContribution } from "./contribution.entity";
import { ContributionService } from "./contribution.service";
import { RepoContributionsController } from "./repo-contributions.controller";
import { RepoModule } from "../repo/repo.module";

@Module({
  imports: [TypeOrmModule.forFeature([DbRepo, DbContribution], "ApiConnection"), RepoModule],
  controllers: [RepoContributionsController],
  providers: [ContributionService],
  exports: [ContributionService],
})
export class ContributionModule {}
