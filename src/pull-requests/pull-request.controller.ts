import { Controller, Get, Query } from "@nestjs/common";
import { ApiOperation, ApiOkResponse, ApiTags } from "@nestjs/swagger";

import { ApiPaginatedResponse } from "../common/decorators/api-paginated-response.decorator";
import { PageDto } from "../common/dtos/page.dto";
import { DbPullRequestGitHubEvents } from "../timescale/entities/pull_request_github_event.entity";
import { PullRequestGithubEventsService } from "../timescale/pull_request_github_events.service";
import { PullRequestPageOptionsDto } from "./dtos/pull-request-page-options.dto";

@Controller("prs")
@ApiTags("Pull Requests service")
export class PullRequestController {
  constructor(private readonly pullRequestEventsService: PullRequestGithubEventsService) {}

  @Get("/search")
  @ApiOperation({
    operationId: "searchAllPullRequestEvents",
    summary: "Searches pull request events using filters and paginates them",
  })
  @ApiPaginatedResponse(DbPullRequestGitHubEvents)
  @ApiOkResponse({ type: DbPullRequestGitHubEvents })
  async searchAllPullRequestEvents(
    @Query() pageOptionsDto: PullRequestPageOptionsDto
  ): Promise<PageDto<DbPullRequestGitHubEvents>> {
    return this.pullRequestEventsService.findAllWithFilters(pageOptionsDto);
  }
}
