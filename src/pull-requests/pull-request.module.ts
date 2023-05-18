import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { RepoFilterModule } from "../common/filters/repo-filter.module";
import { DbPRInsight } from "./entities/pull-request-insight.entity";
import { DbPullRequest } from "./entities/pull-request.entity";
import { PullRequestInsightsService } from "./pull-request-insights.service";
import { PullRequestController } from "./pull-request.controller";
import { PullRequestService } from "./pull-request.service";
import { PullRequestDescriptionService } from "./pull-request-description.service";
import { PullRequestDescriptionController } from "./pull-request-description.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DbPullRequest,
      DbPRInsight,
    ], "ApiConnection"),
    RepoFilterModule,
  ],
  controllers: [PullRequestController, PullRequestDescriptionController],
  providers: [PullRequestService, PullRequestInsightsService, PullRequestDescriptionService],
  exports: [PullRequestService],
})
export class PullRequestModule {}
