import { Controller, Get, Query } from "@nestjs/common";
import { ApiOperation, ApiOkResponse, ApiTags } from "@nestjs/swagger";

import { DbCommitCommentGitHubEventsHistogram } from "../timescale/entities/commit_comment_github_events_histogram.entity";
import { CommitCommentGithubEventsService } from "../timescale/commit_comment_github_events.service";
import { DbReleaseGitHubEventsHistogram } from "../timescale/entities/release_github_events_histogram.entity";
import { ReleaseGithubEventsService } from "../timescale/release_github_events.service";
import { DbCreateGitHubEventsHistogram } from "../timescale/entities/create_github_events_histogram.entity";
import { CreateGithubEventsService } from "../timescale/create_github_events.service";
import { DbDeleteGitHubEventsHistogram } from "../timescale/entities/delete_github_events_histogram.entity";
import { DeleteGithubEventsService } from "../timescale/delete_github_events.service";
import { GollumGithubEventsService } from "../timescale/gollum_github_events.service";
import { DbGollumGitHubEventsHistogram } from "../timescale/entities/gollum_github_events_histogram.entity";
import { DbMemberGitHubEventsHistogram } from "../timescale/entities/member_github_events_histogram.entity";
import { MemberGithubEventsService } from "../timescale/member_github_events.service";
import { DbIssuesGitHubEventsHistogram } from "../timescale/entities/issues_github_events_histogram.entity";
import { IssuesGithubEventsService } from "../timescale/issues_github_events.service";
import { PushGithubEventsService } from "../timescale/push_github_events.service";
import { DbPushGitHubEventsHistogram } from "../timescale/entities/push_github_events_histogram.entity";
import { WatchGithubEventsService } from "../timescale/watch_github_events.service";
import { DbWatchGitHubEventsHistogram } from "../timescale/entities/watch_github_events_histogram.entity";
import { DbForkGitHubEventsHistogram } from "../timescale/entities/fork_github_events_histogram.entity";
import { ForkGithubEventsService } from "../timescale/fork_github_events.service";
import { DbIssueCommentGitHubEventsHistogram } from "../timescale/entities/issue_comment_github_events_histogram.entity";
import { IssueCommentGithubEventsService } from "../timescale/issue_comment_github_events.service";
import { DbPullRequestGitHubEventsHistogram } from "../timescale/entities/pull_request_github_events_histogram.entity";
import { PullRequestGithubEventsService } from "../timescale/pull_request_github_events.service";
import { DbPullRequestReviewGitHubEventsHistogram } from "../timescale/entities/pull_request_review_github_events_histogram.entity";
import { PullRequestReviewGithubEventsService } from "../timescale/pull_request_review_github_events.service";
import { DbPullRequestReviewCommentGitHubEventsHistogram } from "../timescale/entities/pull_request_review_comment_github_events_histogram.entity";
import { PullRequestReviewCommentGithubEventsService } from "../timescale/pull_request_review_comment_github_events.service";
import { StarsHistogramDto } from "./dtos/stars.dto";
import { PushesHistogramDto } from "./dtos/pushes.dto";
import { ForksHistogramDto } from "./dtos/forks.dto";
import { IssueCommentsHistogramDto } from "./dtos/issue_comments.dto";
import { IssueHistogramDto } from "./dtos/issue.dto";
import { PullRequestHistogramDto } from "./dtos/pull_request.dto";
import { PullRequestReviewHistogramDto } from "./dtos/pull_request_review.dto";
import { ReleaseHistogramDto } from "./dtos/releases.dto";
import { CreateHistogramDto } from "./dtos/create.dto";
import { GollumHistogramDto } from "./dtos/gollum.dto";
import { MemberHistogramDto } from "./dtos/member.dto";
import { PullRequestReviewCommentHistogramDto } from "./dtos/pull_request_review_comment.dto";
import { CommitCommentsHistogramDto } from "./dtos/commit_comments.dto";

@Controller("histogram")
@ApiTags("Histogram generation service")
export class HistogramController {
  constructor(
    private readonly commitCommentGitHubEventsService: CommitCommentGithubEventsService,
    private readonly createGitHubEventsService: CreateGithubEventsService,
    private readonly deleteGitHubEventsService: DeleteGithubEventsService,
    private readonly forkGitHubEventsService: ForkGithubEventsService,
    private readonly gollumGitHubEventsService: GollumGithubEventsService,
    private readonly issueCommentGitHubEventsService: IssueCommentGithubEventsService,
    private readonly issueGitHubEventsService: IssuesGithubEventsService,
    private readonly memberGitHubEventsService: MemberGithubEventsService,
    private readonly pullRequestGitHubEventsService: PullRequestGithubEventsService,
    private readonly pullRequestRevieCommentsGitHubEventsService: PullRequestReviewCommentGithubEventsService,
    private readonly pullRequestReviewGitHubEventsService: PullRequestReviewGithubEventsService,
    private readonly pushGitHubEventsService: PushGithubEventsService,
    private readonly releaseGitHubEventsService: ReleaseGithubEventsService,
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
  @ApiOkResponse({ type: DbForkGitHubEventsHistogram, isArray: true })
  async forksHistogram(@Query() options: ForksHistogramDto): Promise<DbForkGitHubEventsHistogram[]> {
    return this.forkGitHubEventsService.genForkHistogram(options);
  }

  @Get("/issue-comments")
  @ApiOperation({
    operationId: "issueCommentsHistogram",
    summary: "Generates a issue comments histogram based on 1 day time buckets",
  })
  @ApiOkResponse({ type: DbIssueCommentGitHubEventsHistogram, isArray: true })
  async issueCommentsHistogram(
    @Query() options: IssueCommentsHistogramDto
  ): Promise<DbIssueCommentGitHubEventsHistogram[]> {
    return this.issueCommentGitHubEventsService.genIssueCommentHistogram(options);
  }

  @Get("/issues")
  @ApiOperation({
    operationId: "issuesHistogram",
    summary:
      "Generates a issues histogram based on 1 day time buckets. Note: issues in the API are BOTH GitHub pull requests and issues",
  })
  @ApiOkResponse({ type: DbIssuesGitHubEventsHistogram, isArray: true })
  async issuesHistogram(@Query() options: IssueHistogramDto): Promise<DbIssuesGitHubEventsHistogram[]> {
    return this.issueGitHubEventsService.genIssueHistogram(options);
  }

  @Get("/pull-requests")
  @ApiOperation({
    operationId: "prsHistogram",
    summary: "Generates a pull request histogram based on 1 day time buckets",
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
  @ApiOkResponse({ type: DbPullRequestReviewGitHubEventsHistogram, isArray: true })
  async prReviewsHistogram(
    @Query() options: PullRequestReviewHistogramDto
  ): Promise<DbPullRequestReviewGitHubEventsHistogram[]> {
    return this.pullRequestReviewGitHubEventsService.genPrReviewHistogram(options);
  }

  @Get("/pull-request-review-comments")
  @ApiOperation({
    operationId: "prReviewCommentsHistogram",
    summary: "Generates a request review comments histogram based on 1 day time buckets",
  })
  @ApiOkResponse({ type: DbPullRequestReviewCommentGitHubEventsHistogram, isArray: true })
  async prReviewCommentsHistogram(
    @Query() options: PullRequestReviewCommentHistogramDto
  ): Promise<DbPullRequestReviewCommentGitHubEventsHistogram[]> {
    return this.pullRequestRevieCommentsGitHubEventsService.genPullRequestReviewCommentHistogram(options);
  }

  @Get("/commit-comments")
  @ApiOperation({
    operationId: "commitCommentsHistogram",
    summary: "Generates a commit comments histogram based on 1 day time buckets",
  })
  @ApiOkResponse({ type: DbCommitCommentGitHubEventsHistogram, isArray: true })
  async commitCommentHistogram(
    @Query() options: CommitCommentsHistogramDto
  ): Promise<DbCommitCommentGitHubEventsHistogram[]> {
    return this.commitCommentGitHubEventsService.genCommitCommentHistogram(options);
  }

  @Get("/releases")
  @ApiOperation({
    operationId: "releasesHistogram",
    summary: "Generates a release histogram based on 1 day time buckets",
  })
  @ApiOkResponse({ type: DbReleaseGitHubEventsHistogram, isArray: true })
  async releaseHistogram(@Query() options: ReleaseHistogramDto): Promise<DbReleaseGitHubEventsHistogram[]> {
    return this.releaseGitHubEventsService.genReleaseHistogram(options);
  }

  @Get("/creates")
  @ApiOperation({
    operationId: "createHistogram",
    summary:
      "Generates a 'create' events histogram based on 1 day time buckets. Create events are associate with new tags, branches, and repos",
  })
  @ApiOkResponse({ type: DbCreateGitHubEventsHistogram, isArray: true })
  async createHistogram(@Query() options: CreateHistogramDto): Promise<DbCreateGitHubEventsHistogram[]> {
    return this.createGitHubEventsService.genCreateHistogram(options);
  }

  @Get("/deletes")
  @ApiOperation({
    operationId: "deleteHistogram",
    summary:
      "Generates a 'delete' events histogram based on 1 day time buckets. Delete events are associated with deleted tags, branches, and repos",
  })
  @ApiOkResponse({ type: DbDeleteGitHubEventsHistogram, isArray: true })
  async deleteHistogram(@Query() options: ReleaseHistogramDto): Promise<DbDeleteGitHubEventsHistogram[]> {
    return this.deleteGitHubEventsService.genDeleteHistogram(options);
  }

  @Get("/gollums")
  @ApiOperation({
    operationId: "gollumHistogram",
    summary:
      "Generates a 'gollum' events histogram based on 1 day time buckets. Gollum events are associated with new / edited wiki pages",
  })
  @ApiOkResponse({ type: DbGollumGitHubEventsHistogram, isArray: true })
  async gollumHistogram(@Query() options: GollumHistogramDto): Promise<DbGollumGitHubEventsHistogram[]> {
    return this.gollumGitHubEventsService.genGollumHistogram(options);
  }

  @Get("/members")
  @ApiOperation({
    operationId: "memberHistogram",
    summary: "Generates a member events histogram based on 1 day time buckets",
  })
  @ApiOkResponse({ type: DbMemberGitHubEventsHistogram, isArray: true })
  async memberHistogram(@Query() options: MemberHistogramDto): Promise<DbMemberGitHubEventsHistogram[]> {
    return this.memberGitHubEventsService.genMemberHistogram(options);
  }
}
