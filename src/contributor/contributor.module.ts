import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ContributorController } from "./contributor.controller";
import { PullRequestModule } from "../pull-requests/pull-request.module";
import { DbPullRequest } from "../pull-requests/entities/pull-request.entity";
import { ContributorInsightsController } from "./contributor-insights.controller";

@Module({
  imports: [TypeOrmModule.forFeature([DbPullRequest], "ApiConnection"), PullRequestModule],
  controllers: [ContributorController, ContributorInsightsController],
})
export class ContributorModule {}
