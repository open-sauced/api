import { Controller, Get, HttpCode, HttpStatus, Param, Query } from "@nestjs/common";
import { RepoService } from "./repo.service";
import { DbRepo } from "./entities/repo.entity";
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { PageDto } from "../common/dtos/page.dto";
import { ApiPaginatedResponse } from "../common/decorators/api-paginated-response.decorator";
import { RepoPageOptionsDto } from "./dtos/repo-page-options.dto";

@Controller("repos")
@ApiTags("Repository service")
export class RepoController {
  constructor (private readonly repoService: RepoService) {}

  @Get("/:id")
  @ApiOperation({
    operationId: "findOneById",
    summary: "Finds a repo by :id",
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: DbRepo })
  @ApiNotFoundResponse({ description: "Repository not found" })
  async findOneById (
    @Param("id") id: number,
  ): Promise<DbRepo> {
    return this.repoService.findOneById(id);
  }

  @Get("/:owner/:repo")
  @ApiOperation({
    operationId: "findOneByOwnerAndRepo",
    summary: "Finds a repo by :owner and :repo",
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: DbRepo })
  @ApiNotFoundResponse({ description: "Repository not found" })
  async findOneByOwnerAndRepo (
    @Param("owner") owner: string,
      @Param("repo") repo: string,
  ): Promise<DbRepo> {
    return this.repoService.findOneByOwnerAndRepo(owner, repo);
  }

  @Get("/list")
  @ApiOperation({
    operationId: "findAll",
    summary: "Finds all repos and paginates them",
  })
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(DbRepo)
  @ApiOkResponse({ type: DbRepo })
  async findUserList (
    @Query() pageOptionsDto: RepoPageOptionsDto,
  ): Promise<PageDto<DbRepo>> {
    return this.repoService.findAll(pageOptionsDto);
  }
}
