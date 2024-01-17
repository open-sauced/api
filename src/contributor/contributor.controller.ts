import { Controller, Get, Query } from "@nestjs/common";
import { ApiOperation, ApiOkResponse, ApiTags } from "@nestjs/swagger";

import { ApiPaginatedResponse } from "../common/decorators/api-paginated-response.decorator";
import { PageDto } from "../common/dtos/page.dto";
import { DbPullRequestContributor } from "../pull-requests/dtos/pull-request-contributor.dto";
import { PullRequestContributorOptionsDto } from "../pull-requests/dtos/pull-request-contributor-options.dto";
import { PullRequestGithubEventsService } from "../timescale/pull_request_github_events.service";

@Controller("contributors")
@ApiTags("Contributors service")
export class ContributorController {
  constructor(private readonly pullRequestGithubEventsService: PullRequestGithubEventsService) {}

  @Get("/search")
  @ApiOperation({
    operationId: "searchAllPullRequestContributors",
    summary: "Searches contributors from pull requests using filters and paginates them",
  })
  @ApiPaginatedResponse(DbPullRequestContributor)
  @ApiOkResponse({ type: DbPullRequestContributor })
  async searchAllPullRequestContributors(
    @Query() pageOptionsDto: PullRequestContributorOptionsDto
  ): Promise<PageDto<DbPullRequestContributor>> {
    return this.pullRequestGithubEventsService.findAuthorsWithFilters(pageOptionsDto);
  }
}
