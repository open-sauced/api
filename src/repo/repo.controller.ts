import { Controller, Get, HttpCode, HttpStatus, Param, Query } from "@nestjs/common";
import { RepoService } from "./repo.service";
import { Repo } from "./entities/repo.entity";
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { PageDto } from "../common/dtos/page.dto";
import { ApiPaginatedResponse } from "../common/decorators/api-paginated-response.decorator";
import { RepoPageOptionsDto } from "./dtos/repo-page-options.dto";

@Controller("repos")
@ApiTags("Repository service")
export class RepoController {
  constructor(private readonly repoService: RepoService) {}

  @Get("/:id")
  @ApiOperation({
    operationId: "findOneById",
    summary: "Finds a repo by :id",
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: Repo })
  @ApiNotFoundResponse({
    description: "Repository not found",
  })
  async findOneById(
    @Param("id") id: number,
  ): Promise<Repo> {
    return this.repoService.findOneById(id);
  }

  @Get("/:owner/:repo")
  @ApiOperation({
    operationId: "findOneByOwnerAndRepo",
    summary: "Finds a repo by :owner and :repo",
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: Repo })
  @ApiNotFoundResponse({
    description: "Repository not found",
  })
  async findOneByOwnerAndRepo(
    @Param("owner") owner: string,
      @Param("repo") repo: string,
  ): Promise<Repo> {
    return this.repoService.findOneByOwnerAndRepo(owner, repo);
  }

  @Get("/list")
  @ApiOperation({
    operationId: "findAll",
    summary: "Finds all repos and paginates them",
  })
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(Repo)
  @ApiOkResponse({ type: Repo })
  async findUserList(
    @Query() pageOptionsDto: RepoPageOptionsDto,
  ): Promise<PageDto<Repo>> {
    return this.repoService.findAll(pageOptionsDto);
  }
}
