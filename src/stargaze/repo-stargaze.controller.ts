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
import { DbRepoToUserStargazers } from "../repo/entities/repo.to.user.stargazers.entity";
import { ApiPaginatedResponse } from "../common/decorators/api-paginated-response.decorator";
import { DbRepo } from "../repo/entities/repo.entity";
import { RepoPageOptionsDto } from "../repo/dtos/repo-page-options.dto";
import { PageDto } from "../common/dtos/page.dto";
import { StargazeService } from "./stargaze.service";

@Controller("repos")
@ApiTags("Repository service guarded", "Stargaze service")
export class RepoStargazeController {
  constructor(private readonly repoService: RepoService, private readonly stargazeService: StargazeService) {}

  @Get("/listUserStargazed")
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOperation({
    operationId: "findAllUserStargazed",
    summary: "Finds all repos followed by authenticated user and paginates them",
  })
  @ApiPaginatedResponse(DbRepo)
  @ApiOkResponse({ type: DbRepo })
  async findAllUserStargazed(
    @Query() pageOptionsDto: RepoPageOptionsDto,
    @UserId() userId: number
  ): Promise<PageDto<DbRepo>> {
    return this.repoService.findAll(pageOptionsDto, userId, ["Stargazers"]);
  }

  @Put("/:id/stargaze")
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOperation({
    operationId: "stargazeOneById",
    summary: "Finds a repo by :id and follows",
  })
  @ApiOkResponse({
    description: "Returns the repo follow",
    type: DbRepoToUserStargazers,
  })
  @ApiNotFoundResponse({ description: "Repo or follow not found" })
  @ApiConflictResponse({ description: "You have already followed this repo" })
  @ApiParam({ name: "id", type: "integer" })
  async stargazeOneById(
    @Param("id", ParseIntPipe) id: number,
    @UserId() userId: number
  ): Promise<DbRepoToUserStargazers> {
    const item = await this.repoService.findOneById(id);

    return this.stargazeService.stargazeByRepoId(item.id, userId);
  }

  @Put("/:owner/:repo/stargaze")
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOperation({
    operationId: "stargazeOneByOwnerAndRepo",
    summary: "Finds a repo by :owner and :repo and follows",
  })
  @ApiOkResponse({
    description: "Returns the repo follow",
    type: DbRepoToUserStargazers,
  })
  @ApiNotFoundResponse({ description: "Repo or follow not found" })
  @ApiConflictResponse({ description: "You have already followed this repo" })
  async stargazeOneByOwnerAndRepo(
    @Param("owner") owner: string,
    @Param("repo") repo: string,
    @UserId() userId: number
  ): Promise<DbRepoToUserStargazers> {
    const item = await this.repoService.findOneByOwnerAndRepo(owner, repo);

    return this.stargazeService.stargazeByRepoId(item.id, userId);
  }

  @Delete("/:id/stargaze")
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOperation({
    operationId: "downStargazeOneById",
    summary: "Finds a repo by :id and unfollows",
  })
  @ApiOkResponse({
    description: "Returns the repo follow",
    type: DbRepoToUserStargazers,
  })
  @ApiNotFoundResponse({ description: "Repo or follow not found" })
  @ApiConflictResponse({ description: "You have already unfollowed this repo" })
  @ApiParam({ name: "id", type: "integer" })
  async downStargazeOneById(
    @Param("id", ParseIntPipe) id: number,
    @UserId() userId: number
  ): Promise<DbRepoToUserStargazers> {
    const item = await this.repoService.findOneById(id);

    return this.stargazeService.downStargazeByRepoId(item.id, userId);
  }

  @Delete("/:owner/:repo/stargaze")
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOperation({
    operationId: "downStargazeOneByOwnerAndRepo",
    summary: "Finds a repo by :owner and :repo and unfollows",
  })
  @ApiOkResponse({
    description: "Returns the repo follow",
    type: DbRepoToUserStargazers,
  })
  @ApiNotFoundResponse({ description: "Repo or stargaze not found" })
  @ApiConflictResponse({ description: "You have already unfollowed this repo" })
  async downStargazeOneByOwnerAndRepo(
    @Param("owner") owner: string,
    @Param("repo") repo: string,
    @UserId() userId: number
  ): Promise<DbRepoToUserStargazers> {
    const item = await this.repoService.findOneByOwnerAndRepo(owner, repo);

    return this.stargazeService.downStargazeByRepoId(item.id, userId);
  }
}
