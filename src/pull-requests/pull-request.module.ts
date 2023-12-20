import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { RepoFilterModule } from "../common/filters/repo-filter.module";
import { OpenAiModule } from "../open-ai/open-ai.module";
import { DbPullRequestGitHubEvents } from "../timescale/entities/pull_request_github_event";
import { TimescaleModule } from "../timescale/timescale.module";
import { DbPRInsight } from "./entities/pull-request-insight.entity";
import { DbPullRequest } from "./entities/pull-request.entity";
import { PullRequestInsightsService } from "./pull-request-insights.service";
import { PullRequestController } from "./pull-request.controller";
import { PullRequestService } from "./pull-request.service";
import { PullRequestDescriptionService } from "./pull-request-description.service";
import { PullRequestDescriptionController } from "./pull-request-description.controller";
import { CodeRefactorSuggestionController } from "./code-refactor-suggestion.controller";
import { CodeRefactorSuggestionService } from "./code-refactor-suggestion.service";
import { CodeTestSuggestionController } from "./code-test.suggestion.controller";
import { CodeExplanationService } from "./code-explanation.service";
import { CodeExplanationController } from "./code-explanation.controller";
import { CodeTestSuggestionService } from "./code-test-suggestion.service";
import { PullRequestReviewService } from "./pull-request-review.service";
import { DbPullRequestReview } from "./entities/pull-request-review.entity";

@Module({
  imports: [
    TimescaleModule,
    TypeOrmModule.forFeature([DbPullRequest, DbPRInsight, DbPullRequestReview], "ApiConnection"),
    TypeOrmModule.forFeature([DbPullRequestGitHubEvents], "TimescaleConnection"),
    RepoFilterModule,
    OpenAiModule,
  ],
  controllers: [
    PullRequestController,
    PullRequestDescriptionController,
    CodeRefactorSuggestionController,
    CodeTestSuggestionController,
    CodeExplanationController,
  ],
  providers: [
    PullRequestService,
    PullRequestInsightsService,
    PullRequestDescriptionService,
    CodeRefactorSuggestionService,
    CodeTestSuggestionService,
    CodeExplanationService,
    PullRequestReviewService,
  ],
  exports: [PullRequestService, PullRequestReviewService],
})
export class PullRequestModule {}
