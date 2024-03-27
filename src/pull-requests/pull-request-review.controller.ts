import { Controller, Get, Query } from "@nestjs/common";
import { ApiOperation, ApiOkResponse, ApiTags } from "@nestjs/swagger";

import { ApiPaginatedResponse } from "../common/decorators/api-paginated-response.decorator";
import { PageDto } from "../common/dtos/page.dto";
import { PullRequestReviewGithubEventsService } from "../timescale/pull_request_review_github_events.service";
import { DbPullRequestReviewGitHubEvents } from "../timescale/entities/pull_request_review_github_event.entity";
import { PullRequestPageOptionsDto } from "./dtos/pull-request-page-options.dto";

@Controller("prs/reviews")
@ApiTags("Pull Requests Reviews service")
export class PullRequestReviewsController {
  constructor(private readonly pullRequestReviewService: PullRequestReviewGithubEventsService) {}

  @Get("/search")
  @ApiOperation({
    operationId: "searchAllPullRequestsReviews",
    summary: "Searches pull requests reviews using filters and paginates them",
  })
  @ApiPaginatedResponse(DbPullRequestReviewGitHubEvents)
  @ApiOkResponse({ type: DbPullRequestReviewGitHubEvents })
  async searchAllPullRequestsReviews(
    @Query() pageOptionsDto: PullRequestPageOptionsDto
  ): Promise<PageDto<DbPullRequestReviewGitHubEvents>> {
    return this.pullRequestReviewService.findAllWithFilters(pageOptionsDto);
  }
}
