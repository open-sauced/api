import { Controller, Get, Query } from "@nestjs/common";
import { ApiOperation, ApiOkResponse, ApiTags } from "@nestjs/swagger";

import { ApiPaginatedResponse } from "../common/decorators/api-paginated-response.decorator";
import { PageDto } from "../common/dtos/page.dto";
import { PullRequestService } from "../pull-requests/pull-request.service";
import { DbPullRequestContributor } from "../pull-requests/dtos/pull-request-contributor.dto";
import { PullRequestContributorInsightsDto } from "../pull-requests/dtos/pull-request-contributor-insights.dto";

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
    @Query() pageOptionsDto: PullRequestContributorInsightsDto
  ): Promise<PageDto<DbPullRequestContributor>> {
    return this.pullRequestService.findNewContributorsInTimeRange(pageOptionsDto);
  }

  @Get("/recent")
  @ApiOperation({
    operationId: "findAllRecentPullRequestContributors",
    summary: "Gets all recent contributors for the last 30 days based on repo IDs",
  })
  @ApiPaginatedResponse(DbPullRequestContributor)
  @ApiOkResponse({ type: DbPullRequestContributor })
  async findAllRecentPullRequestContributors(
    @Query() pageOptionsDto: PullRequestContributorInsightsDto
  ): Promise<PageDto<DbPullRequestContributor>> {
    return this.pullRequestService.findAllRecentContributors(pageOptionsDto);
  }

  @Get("/churn")
  @ApiOperation({
    operationId: "findAllChurnPullRequestContributors",
    summary: "Gets all recent churned contributors for the last 30 days based on repo IDs",
  })
  @ApiPaginatedResponse(DbPullRequestContributor)
  @ApiOkResponse({ type: DbPullRequestContributor })
  async findAllChurnPullRequestContributors(
    @Query() pageOptionsDto: PullRequestContributorInsightsDto
  ): Promise<PageDto<DbPullRequestContributor>> {
    return this.pullRequestService.findAllChurnContributors(pageOptionsDto);
  }

  @Get("/repeat")
  @ApiOperation({
    operationId: "findAllRepeatPullRequestContributors",
    summary: "Gets all recent repeat contributors for the last 30 days based on repo IDs",
  })
  @ApiPaginatedResponse(DbPullRequestContributor)
  @ApiOkResponse({ type: DbPullRequestContributor })
  async findAllRepeatPullRequestContributors(
    @Query() pageOptionsDto: PullRequestContributorInsightsDto
  ): Promise<PageDto<DbPullRequestContributor>> {
    return this.pullRequestService.findAllRepeatContributors(pageOptionsDto);
  }
}
