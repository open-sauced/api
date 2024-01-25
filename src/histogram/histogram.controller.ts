import { Controller, Get, Query } from "@nestjs/common";
import { ApiOperation, ApiOkResponse, ApiTags } from "@nestjs/swagger";

import { DbIssueGitHubEventsHistogram } from "../timescale/entities/issue_github_events_histogram";
import { IssueGithubEventsService } from "../timescale/issue_github_events.service";
import { PushGithubEventsService } from "../timescale/push_github_events.service";
import { DbPushGitHubEventsHistogram } from "../timescale/entities/push_github_events_histogram";
import { WatchGithubEventsService } from "../timescale/watch_github_events.service";
import { DbWatchGitHubEventsHistogram } from "../timescale/entities/watch_github_events_histogram";
import { DbForkGitHubEventsHistogram } from "../timescale/entities/fork_github_events_histogram";
import { ForkGithubEventsService } from "../timescale/fork_github_events.service";
import { DbIssueCommentGitHubEventsHistogram } from "../timescale/entities/issue_comment_github_events_histogram";
import { IssueCommentGithubEventsService } from "../timescale/issue_comment_github_events.service";
import { DbPullRequestGitHubEventsHistogram } from "../timescale/entities/pull_request_github_events_histogram";
import { PullRequestGithubEventsService } from "../timescale/pull_request_github_events.service";
import { DbPullRequestReviewGitHubEventsHistogram } from "../timescale/entities/pull_request_review_github_events_histogram";
import { PullRequestReviewGithubEventsService } from "../timescale/pull_request_review_github_events.service";
import { StarsHistogramDto } from "./dtos/stars";
import { PushesHistogramDto } from "./dtos/pushes";
import { ForksHistogramDto } from "./dtos/forks";
import { IssueCommentsHistogramDto } from "./dtos/issue_comments";
import { IssueHistogramDto } from "./dtos/issue";
import { PullRequestHistogramDto } from "./dtos/pull_request";
import { PullRequestReviewHistogramDto } from "./dtos/pull_request_review";

@Controller("histogram")
@ApiTags("Histogram generation service")
export class HistogramController {
  constructor(
    private readonly forkGitHubEventsService: ForkGithubEventsService,
    private readonly issueCommentGitHubEventsService: IssueCommentGithubEventsService,
    private readonly issueGitHubEventsService: IssueGithubEventsService,
    private readonly pullRequestGitHubEventsService: PullRequestGithubEventsService,
    private readonly pullRequestReviewGitHubEventsService: PullRequestReviewGithubEventsService,
    private readonly pushGitHubEventsService: PushGithubEventsService,
    private readonly watchGitHubEventsService: WatchGithubEventsService
  ) {}

  @Get("/stars")
  @ApiOperation({
    operationId: "starsHistogram",
    summary: "Generates a stars histogram based on 1 day time buckets",
  })
  @ApiOkResponse({ type: DbWatchGitHubEventsHistogram, isArray: true })
  async starsHistogram(@Query() options: StarsHistogramDto): Promise<DbWatchGitHubEventsHistogram[]> {
    return this.watchGitHubEventsService.genStarsHistogram(options);
  }

  @Get("/pushes")
  @ApiOperation({
    operationId: "pushesHistogram",
    summary: "Generates a pushes histogram based on 1 day time buckets",
  })
  @ApiOkResponse({ type: DbPushGitHubEventsHistogram, isArray: true })
  async pushesHistogram(@Query() options: PushesHistogramDto): Promise<DbPushGitHubEventsHistogram[]> {
    return this.pushGitHubEventsService.genPushHistogram(options);
  }

  @Get("/forks")
  @ApiOperation({
    operationId: "forksHistogram",
    summary: "Generates a forks histogram based on 1 day time buckets",
  })
  @ApiOkResponse({ type: DbPushGitHubEventsHistogram, isArray: true })
  async forksHistogram(@Query() options: ForksHistogramDto): Promise<DbForkGitHubEventsHistogram[]> {
    return this.forkGitHubEventsService.genForkHistogram(options);
  }

  @Get("/issue-comments")
  @ApiOperation({
    operationId: "issueCommentsHistogram",
    summary: "Generates a issue comments created histogram based on 1 day time buckets",
  })
  @ApiOkResponse({ type: DbPushGitHubEventsHistogram, isArray: true })
  async issueCommentsHistogram(
    @Query() options: IssueCommentsHistogramDto
  ): Promise<DbIssueCommentGitHubEventsHistogram[]> {
    return this.issueCommentGitHubEventsService.genIssueCommentHistogram(options);
  }

  @Get("/issues")
  @ApiOperation({
    operationId: "issuesHistogram",
    summary: "Generates a issues created histogram based on 1 day time buckets",
  })
  @ApiOkResponse({ type: DbPushGitHubEventsHistogram, isArray: true })
  async issuesHistogram(@Query() options: IssueHistogramDto): Promise<DbIssueGitHubEventsHistogram[]> {
    return this.issueGitHubEventsService.genIssueHistogram(options);
  }

  @Get("/pull-requests")
  @ApiOperation({
    operationId: "prsHistogram",
    summary: "Generates a pull request created histogram based on 1 day time buckets",
  })
  @ApiOkResponse({ type: DbPullRequestGitHubEventsHistogram, isArray: true })
  async prsHistogram(@Query() options: PullRequestHistogramDto): Promise<DbPullRequestGitHubEventsHistogram[]> {
    return this.pullRequestGitHubEventsService.genPrHistogram(options);
  }

  @Get("/pull-request-reviews")
  @ApiOperation({
    operationId: "prReviewsHistogram",
    summary: "Generates a request reviews histogram based on 1 day time buckets",
  })
  @ApiOkResponse({ type: DbPullRequestGitHubEventsHistogram, isArray: true })
  async prReviewsHistogram(
    @Query() options: PullRequestReviewHistogramDto
  ): Promise<DbPullRequestReviewGitHubEventsHistogram[]> {
    return this.pullRequestReviewGitHubEventsService.genPrReviewHistogram(options);
  }
}
