import { Controller, Get, HttpCode, HttpStatus, NotFoundException, Param, Query } from "@nestjs/common";
import { RepoService } from "./repo.service";
import { Repo } from "./repo.entity";
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { PageOptionsDto } from "../common/dtos/page-options.dto";
import { PageDto } from "../common/dtos/page.dto";
import { ApiPaginatedResponse } from "../common/decorators/api-paginated-response.decorator";

@Controller("repos")
@ApiTags("Repositories")
export class RepoController {
  constructor(private readonly repoService: RepoService) {}

  @Get("/:id")
  @ApiOperation({
    operationId: "findOneById",
    summary: "Finds a repo by :id",
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: Repo })
  @ApiNotFoundResponse({ type: NotFoundException })
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
  @ApiNotFoundResponse({ type: NotFoundException })
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
    @Query() pageOptionsDto: PageOptionsDto
  ): Promise<PageDto<Repo>> {
    return this.repoService.findAll(pageOptionsDto);
  }
}
