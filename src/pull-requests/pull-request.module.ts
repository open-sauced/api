import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { RepoFilterModule } from "../common/filters/repo-filter.module";
import { OpenAiModule } from "../open-ai/open-ai.module";
import { DbPullRequestGitHubEvents } from "../timescale/entities/pull_request_github_event";
import { TimescaleModule } from "../timescale/timescale.module";
import { DbPullRequestReviewGitHubEvents } from "../timescale/entities/pull_request_review_github_event";
import { DbPRInsight } from "./entities/pull-request-insight.entity";
import { DbPullRequest } from "./entities/pull-request.entity";
import { PullRequestInsightsService } from "./pull-request-insights.service";
import { PullRequestController } from "./pull-request.controller";
import { PullRequestDescriptionService } from "./pull-request-description.service";
import { PullRequestDescriptionController } from "./pull-request-description.controller";
import { CodeRefactorSuggestionController } from "./code-refactor-suggestion.controller";
import { CodeRefactorSuggestionService } from "./code-refactor-suggestion.service";
import { CodeTestSuggestionController } from "./code-test.suggestion.controller";
import { CodeExplanationService } from "./code-explanation.service";
import { CodeExplanationController } from "./code-explanation.controller";
import { CodeTestSuggestionService } from "./code-test-suggestion.service";
import { PullRequestReviewsController } from "./pull-request-review.controller";

@Module({
  imports: [
    TimescaleModule,
    TypeOrmModule.forFeature([DbPullRequest, DbPRInsight], "ApiConnection"),
    TypeOrmModule.forFeature([DbPullRequestGitHubEvents, DbPullRequestReviewGitHubEvents], "TimescaleConnection"),
    RepoFilterModule,
    OpenAiModule,
  ],
  controllers: [
    PullRequestController,
    PullRequestDescriptionController,
    CodeRefactorSuggestionController,
    CodeTestSuggestionController,
    CodeExplanationController,
    PullRequestReviewsController,
  ],
  providers: [
    PullRequestInsightsService,
    PullRequestDescriptionService,
    CodeRefactorSuggestionService,
    CodeTestSuggestionService,
    CodeExplanationService,
  ],
})
export class PullRequestModule {}
