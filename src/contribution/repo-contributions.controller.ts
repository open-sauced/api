import { Controller, Get, Param, ParseIntPipe, Query } from "@nestjs/common";
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { RepoService } from "../repo/repo.service";
import { ApiPaginatedResponse } from "../common/decorators/api-paginated-response.decorator";
import { PageDto } from "../common/dtos/page.dto";
import { ContributionService } from "./contribution.service";
import { DbContribution } from "./contribution.entity";
import { ContributionPageOptionsDto } from "./dtos/contribution-page-options.dto";
import { DbRepoLoginContributions } from "./entities/repo-user-contributions.entity";

@Controller("repos")
@ApiTags("Repository service", "Contribution service")
export class RepoContributionsController {
  constructor(private readonly repoService: RepoService, private readonly contributionService: ContributionService) {}

  @Get("/:id/contributions")
  @ApiOperation({
    operationId: "findAllByRepoId",
    summary: "Find a repo by :id listing all contributions and paginating them",
  })
  @ApiPaginatedResponse(DbContribution)
  @ApiOkResponse({ type: DbContribution })
  @ApiNotFoundResponse({ description: "Repo not found" })
  @ApiParam({ name: "id", type: "integer" })
  async findAllByRepoId(
    @Param("id", ParseIntPipe) id: number,
    @Query() pageOptionsDto: ContributionPageOptionsDto
  ): Promise<PageDto<DbContribution>> {
    const item = await this.repoService.findOneById(id);

    return this.contributionService.findAll(pageOptionsDto, item.id);
  }

  @Get("/:owner/:repo/contributions")
  @ApiOperation({
    operationId: "findAllByOwnerAndRepo",
    summary: "Finds a repo by :owner and :repo listing all contributions and paginating them",
  })
  @ApiPaginatedResponse(DbContribution)
  @ApiOkResponse({ type: DbContribution })
  @ApiNotFoundResponse({ description: "Repo not found" })
  async findAllByOwnerAndRepo(
    @Param("owner") owner: string,
    @Param("repo") repo: string,
    @Query() pageOptionsDto: ContributionPageOptionsDto
  ): Promise<PageDto<DbContribution>> {
    const item = await this.repoService.findOneByOwnerAndRepo(owner, repo);

    return this.contributionService.findAll(pageOptionsDto, item.id);
  }

  @Get("/:owner/:repo/:login/contributions")
  @ApiOperation({
    operationId: "findAllByOwnerRepoAndContributorLogin",
    summary: "Finds a repo by :owner and :repo listing all contributions for a given :login and paginating them",
  })
  @ApiOkResponse({ type: DbRepoLoginContributions })
  @ApiNotFoundResponse({ description: "Repo not found" })
  @ApiQuery({
    name: "range",
    type: "integer",
    description: "Range in days",
    required: false,
  })
  @ApiQuery({
    name: "prev_days_start_date",
    type: "integer",
    description: "Previous number of days to go back to start date range",
    required: false,
  })
  async findAllByOwnerRepoAndContributorLogin(
    @Param("owner") owner: string,
    @Param("repo") repo: string,
    @Param("login") login: string,
    @Query("range") range = 30,
    @Query("prev_days_start_date") prev_days_start_date = 0
  ): Promise<DbRepoLoginContributions> {
    const item = await this.repoService.findOneByOwnerAndRepo(owner, repo);

    return this.contributionService.findAllByUserLogin(item.id, login, range, prev_days_start_date);
  }
}
