import { Controller, Delete, Get, Param, ParseIntPipe, Put, Query, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";

import { RepoService } from "../repo/repo.service";
import { SupabaseGuard } from "../auth/supabase.guard";
import { UserId } from "../auth/supabase.user.decorator";
import { DbRepoToUserStars } from "../repo/entities/repo.to.user.stars.entity";
import { ApiPaginatedResponse } from "../common/decorators/api-paginated-response.decorator";
import { DbRepo } from "../repo/entities/repo.entity";
import { RepoPageOptionsDto } from "../repo/dtos/repo-page-options.dto";
import { PageDto } from "../common/dtos/page.dto";
import { StarService } from "./star.service";

@Controller("repos")
@ApiTags("Repository service guarded", "Star service")
export class RepoStarController {
  constructor(private readonly repoService: RepoService, private readonly starService: StarService) {}

  @Get("/listUserStarred")
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOperation({
    operationId: "findAllUserStarred",
    summary: "Finds all repos starred by authenticated user and paginates them",
  })
  @ApiPaginatedResponse(DbRepo)
  @ApiOkResponse({ type: DbRepo })
  async findAllUserStarred(
    @Query() pageOptionsDto: RepoPageOptionsDto,
    @UserId() userId: number
  ): Promise<PageDto<DbRepo>> {
    return this.repoService.findAll(pageOptionsDto, userId, ["Stars"]);
  }

  @Put("/:id/star")
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOperation({
    operationId: "starOneById",
    summary: "Finds a repo by :id and adds a star",
  })
  @ApiOkResponse({
    description: "Returns the repo star",
    type: DbRepoToUserStars,
  })
  @ApiNotFoundResponse({ description: "Repo or star not found" })
  @ApiConflictResponse({ description: "You have already starred this repo" })
  @ApiParam({ name: "id", type: "integer" })
  async starOneById(@Param("id", ParseIntPipe) id: number, @UserId() userId: number): Promise<DbRepoToUserStars> {
    const item = await this.repoService.findOneById(id);

    return this.starService.starByRepoId(item.id, userId);
  }

  @Put("/:owner/:repo/star")
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOperation({
    operationId: "starOneByOwnerAndRepo",
    summary: "Finds a repo by :owner and :repo and adds a star",
  })
  @ApiOkResponse({
    description: "Returns the repo star",
    type: DbRepoToUserStars,
  })
  @ApiNotFoundResponse({ description: "Repo or star not found" })
  @ApiConflictResponse({ description: "You have already starred this repo" })
  async starOneByOwnerAndRepo(
    @Param("owner") owner: string,
    @Param("repo") repo: string,
    @UserId() userId: number
  ): Promise<DbRepoToUserStars> {
    const item = await this.repoService.findOneByOwnerAndRepo(owner, repo);

    return this.starService.starByRepoId(item.id, userId);
  }

  @Delete("/:id/star")
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOperation({
    operationId: "downStarOneById",
    summary: "Finds a repo by :id and removes existing star",
  })
  @ApiOkResponse({
    description: "Returns the repo star",
    type: DbRepoToUserStars,
  })
  @ApiNotFoundResponse({ description: "Repo or star not found" })
  @ApiConflictResponse({ description: "You have already removed your star" })
  @ApiParam({ name: "id", type: "integer" })
  async downStarOneById(@Param("id", ParseIntPipe) id: number, @UserId() userId: number): Promise<DbRepoToUserStars> {
    const item = await this.repoService.findOneById(id);

    return this.starService.downStarByRepoId(item.id, userId);
  }

  @Delete("/:owner/:repo/star")
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOperation({
    operationId: "downStarOneByOwnerAndRepo",
    summary: "Finds a repo by :owner and :repo and removes existing star",
  })
  @ApiOkResponse({
    description: "Returns the repo star",
    type: DbRepoToUserStars,
  })
  @ApiNotFoundResponse({ description: "Repo or star not found" })
  @ApiConflictResponse({ description: "You have already removed your star" })
  async downStarOneByOwnerAndRepo(
    @Param("owner") owner: string,
    @Param("repo") repo: string,
    @UserId() userId: number
  ): Promise<DbRepoToUserStars> {
    const item = await this.repoService.findOneByOwnerAndRepo(owner, repo);

    return this.starService.downStarByRepoId(item.id, userId);
  }
}
