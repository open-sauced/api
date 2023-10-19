import { BadRequestException, Body, Controller, Get, Param, ParseIntPipe, Post, Query } from "@nestjs/common";
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";

import { ApiPaginatedResponse } from "../common/decorators/api-paginated-response.decorator";
import { PageOptionsDto } from "../common/dtos/page-options.dto";
import { PageDto } from "../common/dtos/page.dto";
import { BakeRepoDto } from "./dtos/baked-repo.dto";
import { PizzaOvenService } from "./pizza-oven.service";
import { DbBakedRepo } from "./entities/baked-repo.entity";
import { DbCommitAuthors } from "./entities/commit_authors.entity";
import { CommitAuthorsService } from "./commit-authors.service";
import { CommitsService } from "./commits.service";
import { DbCommits } from "./entities/commits.entity";

@Controller("bake")
@ApiTags("Pizza oven service")
export class PizzaOvenController {
  constructor(
    private readonly pizzaOvenService: PizzaOvenService,
    private readonly commitAuthorService: CommitAuthorsService,
    private readonly commitsService: CommitsService
  ) {}

  @Post("/")
  @ApiOperation({
    operationId: "Bake a repository with the pizza oven microservice",
    summary: "postToPizzaOvenService",
  })
  @ApiAcceptedResponse()
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiBody({ type: BakeRepoDto })
  async postToPizzaOvenService(@Body() bakeOptionsInfo: BakeRepoDto) {
    const statusCode = await this.pizzaOvenService.postToPizzaOvenService(bakeOptionsInfo);

    if (statusCode !== 202) {
      throw new BadRequestException();
    }
  }

  @Get("repos/:id")
  @ApiOperation({
    operationId: "findBakedRepoById",
    summary: "Finds a baked repo by :id",
  })
  @ApiOkResponse({ type: DbBakedRepo })
  @ApiNotFoundResponse({ description: "Baked repository not found" })
  @ApiParam({ name: "id", type: "integer" })
  async findBakedRepoById(@Param("id", ParseIntPipe) id: number): Promise<DbBakedRepo> {
    return this.pizzaOvenService.findBakedRepoById(id);
  }

  @Get("/repos/list")
  @ApiOperation({
    operationId: "listAllBakedRepos",
    summary: "Finds all baked repos and paginates them",
  })
  @ApiPaginatedResponse(DbBakedRepo)
  @ApiOkResponse({ type: DbBakedRepo })
  async listAllBakedRepos(@Query() pageOptionsDto: PageOptionsDto): Promise<PageDto<DbBakedRepo>> {
    return this.pizzaOvenService.findAllBakedRepos(pageOptionsDto);
  }

  @Get("commit-authors/:id")
  @ApiOperation({
    operationId: "findCommitAuthorById",
    summary: "Finds a commit author by :id",
  })
  @ApiOkResponse({ type: DbCommitAuthors })
  @ApiNotFoundResponse({ description: "Commit author not found" })
  @ApiParam({ name: "id", type: "integer" })
  async findCommitAuthorById(@Param("id", ParseIntPipe) id: number): Promise<DbCommitAuthors> {
    return this.commitAuthorService.findCommitAuthorById(id);
  }

  @Get("/commit-authors/list")
  @ApiOperation({
    operationId: "listAllCommitAuthors",
    summary: "Finds all commit authors and paginates them",
  })
  @ApiPaginatedResponse(DbCommitAuthors)
  @ApiOkResponse({ type: DbCommitAuthors })
  async listAllCommitAuthors(@Query() pageOptionsDto: PageOptionsDto): Promise<PageDto<DbCommitAuthors>> {
    return this.commitAuthorService.findAllCommitAuthors(pageOptionsDto);
  }

  @Get("commits/:id")
  @ApiOperation({
    operationId: "findCommitById",
    summary: "Finds a commit by :id",
  })
  @ApiOkResponse({ type: DbCommits })
  @ApiNotFoundResponse({ description: "Commit not found" })
  @ApiParam({ name: "id", type: "integer" })
  async findCommitById(@Param("id", ParseIntPipe) id: number): Promise<DbCommits> {
    return this.commitsService.findCommitById(id);
  }

  @Get("/commits/list/repo/:id")
  @ApiOperation({
    operationId: "listAllCommitsByBakedRepoId",
    summary: "Finds all commits by baked repo :id and paginates them",
  })
  @ApiPaginatedResponse(DbCommits)
  @ApiOkResponse({ type: DbCommits })
  @ApiParam({ name: "id", type: "integer" })
  async listAllCommitsByBakedRepoId(
    @Query() pageOptionsDto: PageOptionsDto,
    @Param("id", ParseIntPipe) id: number
  ): Promise<PageDto<DbCommits>> {
    return this.commitsService.findAllCommitsByBakedRepoId(pageOptionsDto, id);
  }

  @Get("/commits/list/commit-author/:id")
  @ApiOperation({
    operationId: "listAllCommitsByCommitAuthorId",
    summary: "Finds all commits by commit author :id and paginates them",
  })
  @ApiPaginatedResponse(DbCommits)
  @ApiOkResponse({ type: DbCommits })
  @ApiParam({ name: "id", type: "integer" })
  async listAllCommitsByCommitAuthorId(
    @Query() pageOptionsDto: PageOptionsDto,
    @Param("id", ParseIntPipe) id: number
  ): Promise<PageDto<DbCommits>> {
    return this.commitsService.findAllCommitsByCommitAuthorId(pageOptionsDto, id);
  }
}
