import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { PullRequestModule } from "../pull-requests/pull-request.module";
import { DbPullRequest } from "../pull-requests/entities/pull-request.entity";
import { TimescaleModule } from "../timescale/timescale.module";
import { ContributorController } from "./contributor.controller";
import { ContributorInsightsController } from "./contributor-insights.controller";

@Module({
  imports: [TypeOrmModule.forFeature([DbPullRequest], "ApiConnection"), PullRequestModule, TimescaleModule],
  controllers: [ContributorController, ContributorInsightsController],
})
export class ContributorModule {}
