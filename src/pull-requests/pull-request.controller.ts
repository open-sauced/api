import { Controller, Get, Query } from "@nestjs/common";
import { ApiOperation, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { ApiPaginatedResponse } from "../common/decorators/api-paginated-response.decorator";
import { PageOptionsDto } from "../common/dtos/page-options.dto";
import { DbPullRequest } from "./entities/pull-request.entity";
import { PageDto } from "../common/dtos/page.dto";
import { PullRequestService } from "./pull-request.service";

@Controller("prs")
@ApiTags("Pull Requests service")
export class PullRequestController {
  constructor (
    private readonly pullRequestService: PullRequestService,
  ) {}

  @Get("/list")
  @ApiOperation({
    operationId: "findAllPullRequests",
    summary: "Finds all pull requests and paginates them",
  })
  @ApiPaginatedResponse(DbPullRequest)
  @ApiOkResponse({ type: DbPullRequest })
  async findAllPullRequests (
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<DbPullRequest>> {
    return this.pullRequestService.findAll(pageOptionsDto);
  }
}
