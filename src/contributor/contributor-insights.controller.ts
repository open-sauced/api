import { Controller, Get, Query } from "@nestjs/common";
import { ApiOperation, ApiOkResponse, ApiTags } from "@nestjs/swagger";

import { ApiPaginatedResponse } from "../common/decorators/api-paginated-response.decorator";
import { PageDto } from "../common/dtos/page.dto";
import { PullRequestService } from "../pull-requests/pull-request.service";
import { DbPullRequestContributor } from "../pull-requests/dtos/pull-request-contributor.dto";
import { PullRequestContributorOptionsDto } from "../pull-requests/dtos/pull-request-contributor-options.dto";

@Controller("contributors/insights")
@ApiTags("Contributors service")
export class ContributorInsightsController {
  constructor(private readonly pullRequestService: PullRequestService) {}

  @Get("/new")
  @ApiOperation({
    operationId: "newPullRequestContributors",
    summary: "Gets new contributors given a date range for repo IDs",
  })
  @ApiPaginatedResponse(DbPullRequestContributor)
  @ApiOkResponse({ type: DbPullRequestContributor })
  async newPullRequestContributors(
    @Query() pageOptionsDto: PullRequestContributorOptionsDto
  ): Promise<PageDto<DbPullRequestContributor>> {
    return this.pullRequestService.findNewContributorsInTimeRange(pageOptionsDto);
  }
}
