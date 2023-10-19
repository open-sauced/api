import { Controller, Get, Param, ParseIntPipe, Query } from "@nestjs/common";
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { PageDto } from "../common/dtos/page.dto";
import { ApiPaginatedResponse } from "../common/decorators/api-paginated-response.decorator";
import { DbRepo } from "./entities/repo.entity";
import { RepoService } from "./repo.service";
import { RepoPageOptionsDto } from "./dtos/repo-page-options.dto";
import { RepoSearchOptionsDto } from "./dtos/repo-search-options.dto";

@Controller("repos")
@ApiTags("Repository service")
export class RepoController {
  constructor(private readonly repoService: RepoService) {}

  @Get("/:id")
  @ApiOperation({
    operationId: "findOneById",
    summary: "Finds a repo by :id",
  })
  @ApiOkResponse({ type: DbRepo })
  @ApiNotFoundResponse({ description: "Repository not found" })
  @ApiParam({ name: "id", type: "integer" })
  async findOneById(@Param("id", ParseIntPipe) id: number): Promise<DbRepo> {
    return this.repoService.findOneById(id);
  }

  @Get("/:owner/:repo")
  @ApiOperation({
    operationId: "findOneByOwnerAndRepo",
    summary: "Finds a repo by :owner and :repo",
  })
  @ApiOkResponse({ type: DbRepo })
  @ApiNotFoundResponse({ description: "Repository not found" })
  async findOneByOwnerAndRepo(@Param("owner") owner: string, @Param("repo") repo: string): Promise<DbRepo> {
    return this.repoService.findOneByOwnerAndRepo(owner, repo);
  }

  @Get("/list")
  @ApiOperation({
    operationId: "findAll",
    summary: "Finds all repos and paginates them",
  })
  @ApiPaginatedResponse(DbRepo)
  @ApiOkResponse({ type: DbRepo })
  async findAll(@Query() pageOptionsDto: RepoPageOptionsDto): Promise<PageDto<DbRepo>> {
    return this.repoService.findAll(pageOptionsDto);
  }

  @Get("/search")
  @ApiOperation({
    operationId: "findAllReposWithFilters",
    summary: "Finds all repos using filters and paginates them",
  })
  @ApiPaginatedResponse(DbRepo)
  @ApiOkResponse({ type: DbRepo })
  async findAllReposWithFilters(@Query() pageOptionsDto: RepoSearchOptionsDto): Promise<PageDto<DbRepo>> {
    return this.repoService.findAllWithFilters(pageOptionsDto);
  }
}
