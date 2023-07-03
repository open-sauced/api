import { Controller, Get, Query } from "@nestjs/common";
import { ApiOperation, ApiOkResponse, ApiTags } from "@nestjs/swagger";

import { ApiPaginatedResponse } from "../common/decorators/api-paginated-response.decorator";
import { PageDto } from "../common/dtos/page.dto";
import { PullRequestService } from "../pull-requests/pull-request.service";
import { DbPullRequestContributor } from "../pull-requests/dtos/pull-request-contributor.dto";
import { PullRequestContributorOptionsDto } from "../pull-requests/dtos/pull-request-contributor-options.dto";

@Controller("contributors")
@ApiTags("Contributors service")
export class ContributorController {
  constructor(private readonly pullRequestService: PullRequestService) {}

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
    return this.pullRequestService.findAllContributorsWithFilters(pageOptionsDto);
  }
}
