import { Controller, Get, Query, Version } from "@nestjs/common";
import { ApiOperation, ApiOkResponse, ApiTags } from "@nestjs/swagger";

import { PushGithubEventsService } from "../timescale/push_github_events.service";
import { DbPushGitHubEventsHistogram } from "../timescale/entities/push_github_events_histogram";
import { WatchGithubEventsService } from "../timescale/watch_github_events.service";
import { DbWatchGitHubEventsHistogram } from "../timescale/entities/watch_github_events_histogram";
import { DbForkGitHubEventsHistogram } from "../timescale/entities/fork_github_events_histogram";
import { ForkGithubEventsService } from "../timescale/fork_github_events.service";
import { DbIssueCommentGitHubEventsHistogram } from "../timescale/entities/issue_comment_github_events_histogram";
import { IssueCommentGithubEventsService } from "../timescale/issue_comment_github_events.service";
import { StarsHistogramDto } from "./dtos/stars";
import { PushesHistogramDto } from "./dtos/pushes";
import { ForksHistogramDto } from "./dtos/forks";
import { IssueCommentsHistogramDto } from "./dtos/issue_comments";

@Controller("histogram")
@ApiTags("Histogram generation service")
export class HistogramController {
  constructor(
    private readonly forkGitHubEventsService: ForkGithubEventsService,
    private readonly issueCommentGitHubEventsService: IssueCommentGithubEventsService,
    private readonly pushGitHubEventsService: PushGithubEventsService,
    private readonly watchGitHubEventsService: WatchGithubEventsService
  ) {}

  @Version("2")
  @Get("/stars")
  @ApiOperation({
    operationId: "starsHistogram",
    summary: "Generates a stars histogram based on 1 day time buckets",
  })
  @ApiOkResponse({ type: DbWatchGitHubEventsHistogram, isArray: true })
  async starsHistogram(@Query() options: StarsHistogramDto): Promise<DbWatchGitHubEventsHistogram[]> {
    return this.watchGitHubEventsService.genStarsHistogram(options);
  }

  @Version("2")
  @Get("/pushes")
  @ApiOperation({
    operationId: "pushesHistogram",
    summary: "Generates a pushes histogram based on 1 day time buckets",
  })
  @ApiOkResponse({ type: DbPushGitHubEventsHistogram, isArray: true })
  async pushesHistogram(@Query() options: PushesHistogramDto): Promise<DbPushGitHubEventsHistogram[]> {
    return this.pushGitHubEventsService.genPushHistogram(options);
  }

  @Version("2")
  @Get("/forks")
  @ApiOperation({
    operationId: "forksHistogram",
    summary: "Generates a forks histogram based on 1 day time buckets",
  })
  @ApiOkResponse({ type: DbPushGitHubEventsHistogram, isArray: true })
  async forksHistogram(@Query() options: ForksHistogramDto): Promise<DbForkGitHubEventsHistogram[]> {
    return this.forkGitHubEventsService.genForkHistogram(options);
  }

  @Version("2")
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
}
