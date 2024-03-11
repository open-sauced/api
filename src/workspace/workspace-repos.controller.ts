import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import {
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
  ApiTags,
  ApiBadRequestResponse,
  ApiUnprocessableEntityResponse,
  ApiBody,
  ApiParam,
} from "@nestjs/swagger";

import { PassthroughSupabaseGuard } from "../auth/passthrough-supabase.guard";
import { PageOptionsDto } from "../common/dtos/page-options.dto";
import { PageDto } from "../common/dtos/page.dto";
import { OptionalUserId, UserId } from "../auth/supabase.user.decorator";
import { SupabaseGuard } from "../auth/supabase.guard";

import { ApiPaginatedResponse } from "../common/decorators/api-paginated-response.decorator";
import { DbRepo } from "../repo/entities/repo.entity";
import { RepoSearchOptionsDto } from "../repo/dtos/repo-search-options.dto";
import { WorkspaceReposService } from "./workspace-repos.service";
import { DbWorkspaceRepo } from "./entities/workspace-repos.entity";
import { UpdateWorkspaceReposDto } from "./dtos/update-workspace-repos.dto";
import { DbWorkspace } from "./entities/workspace.entity";
import { DeleteWorkspaceReposDto } from "./dtos/delete-workspace-repos.dto";

@Controller("workspaces/:id/repos")
@ApiTags("Workspace repos service")
export class WorkspaceRepoController {
  constructor(private readonly workspaceRepoService: WorkspaceReposService) {}

  @Get()
  @ApiOperation({
    operationId: "getWorkspaceReposForUser",
    summary: "Gets workspace repos for the authenticated user",
  })
  @ApiBearerAuth()
  @UseGuards(PassthroughSupabaseGuard)
  @ApiOkResponse({ type: DbWorkspaceRepo })
  @ApiNotFoundResponse({ description: "Unable to get user workspace repos" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  async getWorkspaceReposForUser(
    @Param("id") id: string,
    @OptionalUserId() userId: number | undefined,
    @Query() pageOptionsDto: PageOptionsDto
  ): Promise<PageDto<DbWorkspaceRepo>> {
    return this.workspaceRepoService.findAllReposByWorkspaceIdForUserId(pageOptionsDto, id, userId);
  }

  @Get("/search")
  @ApiOperation({
    operationId: "findAllWorkspaceReposWithFilters",
    summary: "Finds all workspace repos using filters and paginates them",
  })
  @ApiBearerAuth()
  @UseGuards(PassthroughSupabaseGuard)
  @ApiPaginatedResponse(DbRepo)
  @ApiOkResponse({ type: DbRepo })
  @ApiParam({ name: "id", type: "string" })
  async findAllWorkspaceReposWithFilters(
    @Param("id") id: string,
    @OptionalUserId() userId: number | undefined,
    @Query() pageOptionsDto: RepoSearchOptionsDto
  ): Promise<PageDto<DbRepo>> {
    return this.workspaceRepoService.findAllReposByFilterInWorkspace(pageOptionsDto, id, userId);
  }

  @Post()
  @ApiOperation({
    operationId: "addWorkspaceReposForUser",
    summary: "Adds workspace repos for the authenticated user",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOkResponse({ type: DbWorkspaceRepo })
  @ApiNotFoundResponse({ description: "Unable to add workspace repos" })
  @ApiUnprocessableEntityResponse({ description: "Unable to process workspace repos" })
  @ApiBody({ type: UpdateWorkspaceReposDto })
  @ApiParam({ name: "id", type: "string" })
  async addWorkspaceReposForUser(
    @Param("id") id: string,
    @Body() updateWorkspaceReposDto: UpdateWorkspaceReposDto,
    @UserId() userId: number
  ): Promise<DbWorkspace> {
    return this.workspaceRepoService.addWorkspaceRepos(updateWorkspaceReposDto, id, userId);
  }

  @Post("/:owner/:repo")
  @ApiOperation({
    operationId: "addOneWorkspaceRepoForUser",
    summary: "Adds workspace repos for the authenticated user",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOkResponse({ type: DbWorkspaceRepo })
  @ApiNotFoundResponse({ description: "Unable to add workspace repos" })
  @ApiUnprocessableEntityResponse({ description: "Unable to process workspace repos" })
  @ApiParam({ name: "id", type: "string" })
  @ApiParam({ name: "owner", type: "string" })
  @ApiParam({ name: "repo", type: "string" })
  async addOneWorkspaceReposForUser(
    @Param("id") id: string,
    @Param("owner") owner: string,
    @Param("repo") repo: string,
    @UserId() userId: number
  ): Promise<DbWorkspace> {
    return this.workspaceRepoService.addOneWorkspaceRepo(id, owner, repo, userId);
  }

  @Delete()
  @ApiOperation({
    operationId: "deleteWorkspaceReposForUser",
    summary: "Deletes workspace repos for the authenticated user",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiNotFoundResponse({ description: "Unable to delete workspace repos" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiBody({ type: DeleteWorkspaceReposDto })
  @ApiParam({ name: "id", type: "string" })
  async deleteWorkspaceReposForUser(
    @Param("id") id: string,
    @Body() deleteWorkspaceReposDto: DeleteWorkspaceReposDto,
    @UserId() userId: number
  ) {
    return this.workspaceRepoService.deleteWorkspaceRepos(deleteWorkspaceReposDto, id, userId);
  }

  @Delete("/:owner/:repo")
  @ApiOperation({
    operationId: "deleteOneWorkspaceRepoForUser",
    summary: "Delete a workspace repos for the authenticated user",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiNotFoundResponse({ description: "Unable to delete workspace repo" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiParam({ name: "id", type: "string" })
  @ApiParam({ name: "owner", type: "string" })
  @ApiParam({ name: "repo", type: "string" })
  async deleteOneWorkspaceRepoForUser(
    @Param("id") id: string,
    @Param("owner") owner: string,
    @Param("repo") repo: string,
    @UserId() userId: number
  ) {
    return this.workspaceRepoService.deleteOneWorkspaceRepo(id, owner, repo, userId);
  }
}
