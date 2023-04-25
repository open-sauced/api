import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { RepoFilterModule } from "../common/filters/repo-filter.module";
import { DbPRInsight } from "./entities/pull-request-insight.entity";
import { DbPullRequest } from "./entities/pull-request.entity";
import { PullRequestInsightsService } from "./pull-request-insights.service";
import { PullRequestController } from "./pull-request.controller";
import { PullRequestService } from "./pull-request.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DbPullRequest,
      DbPRInsight,
    ], "ApiConnection"),
    RepoFilterModule,
  ],
  controllers: [PullRequestController],
  providers: [PullRequestService, PullRequestInsightsService],
  exports: [PullRequestService],
})
export class PullRequestModule {}
