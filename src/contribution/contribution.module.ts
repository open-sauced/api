import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DbRepo } from "../repo/entities/repo.entity";
import { DbContribution } from "./contribution.entity";
import { RepoService } from "../repo/repo.service";
import { ContributionService } from "./contribution.service";
import { RepoContributionsController } from "./repo-contributions.controller";

@Module({
  imports: [TypeOrmModule.forFeature([
    DbRepo,
    DbContribution,
  ])],
  controllers: [RepoContributionsController],
  providers: [RepoService, ContributionService],
  exports: [ContributionService],
})
export class ContributionModule {}
