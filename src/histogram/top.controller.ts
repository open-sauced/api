import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiOkResponse, ApiTags } from "@nestjs/swagger";

import { WatchGithubEventsService } from "../timescale/watch_github_events.service";
import { DbTopWatchGitHubEventsHistogram } from "../timescale/entities/watch_github_events_histogram.entity";
import { DbTopForkGitHubEventsHistogram } from "../timescale/entities/fork_github_events_histogram.entity";
import { ForkGithubEventsService } from "../timescale/fork_github_events.service";
import { DbTopCommentGitHubEventsHistogram } from "../timescale/entities/issue_comment_github_events_histogram.entity";
import { IssueCommentGithubEventsService } from "../timescale/issue_comment_github_events.service";

@Controller("histogram/top")
@ApiTags("Top histogram generation service")
export class TopHistogramController {
  constructor(
    private readonly watchGitHubEventsService: WatchGithubEventsService,
    private readonly forkGitHubEventsService: ForkGithubEventsService,
    private readonly issueCommentGitHubEventsService: IssueCommentGithubEventsService
  ) {}

  @Get("/stars")
  @ApiOperation({
    operationId: "starsTopHistogram",
    summary: "Generates a top stars histogram based on 1 day time buckets for all data",
  })
  @ApiOkResponse({ type: DbTopWatchGitHubEventsHistogram, isArray: true })
  async starsTopHistogram(): Promise<DbTopWatchGitHubEventsHistogram[]> {
    return this.watchGitHubEventsService.genStarsTopHistogram();
  }

  @Get("/stars/new")
  @ApiOperation({
    operationId: "starsTopNewHistogram",
    summary: "Generates a top new stars histogram based on 1 day time buckets for all data",
  })
  @ApiOkResponse({ type: DbTopWatchGitHubEventsHistogram, isArray: true })
  async starsTopNewHistogram(): Promise<DbTopWatchGitHubEventsHistogram[]> {
    return this.watchGitHubEventsService.genStarsNewTopHistogram();
  }

  @Get("/forks")
  @ApiOperation({
    operationId: "forksTopHistogram",
    summary: "Generates a top forks histogram based on 1 day time buckets for all data",
  })
  @ApiOkResponse({ type: DbTopWatchGitHubEventsHistogram, isArray: true })
  async forksTopHistogram(): Promise<DbTopForkGitHubEventsHistogram[]> {
    return this.forkGitHubEventsService.genForkTopHistogram();
  }

  @Get("/comments")
  @ApiOperation({
    operationId: "commentsTopHistogram",
    summary: "Generates a top comments histogram based on 1 day time buckets for all data",
  })
  @ApiOkResponse({ type: DbTopCommentGitHubEventsHistogram, isArray: true })
  async commentsTopHistogram(): Promise<DbTopCommentGitHubEventsHistogram[]> {
    return this.issueCommentGitHubEventsService.genCommentTopHistogram();
  }
}
