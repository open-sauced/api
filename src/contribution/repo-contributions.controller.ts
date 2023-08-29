import { Controller, Get, Param, ParseIntPipe, Query } from "@nestjs/common";
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { RepoService } from "../repo/repo.service";
import { ApiPaginatedResponse } from "../common/decorators/api-paginated-response.decorator";
import { PageDto } from "../common/dtos/page.dto";
import { ContributionService } from "./contribution.service";
import { DbContribution } from "./contribution.entity";
import { ContributionPageOptionsDto } from "./dtos/contribution-page-options.dto";

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
}
