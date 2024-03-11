import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
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

import { CollaboratorsDto } from "../user-lists/dtos/collaborators.dto";
import { DbUserHighlight } from "../user/entities/user-highlight.entity";
import { HighlightOptionsDto } from "../highlight/dtos/highlight-options.dto";
import { DbUserHighlightRepo } from "../highlight/entities/user-highlight-repo.entity";
import { PassthroughSupabaseGuard } from "../auth/passthrough-supabase.guard";
import { PageOptionsDto } from "../common/dtos/page-options.dto";
import { PageDto } from "../common/dtos/page.dto";
import { OptionalUserId, UserId } from "../auth/supabase.user.decorator";
import { SupabaseGuard } from "../auth/supabase.guard";
import { DbUserList } from "../user-lists/entities/user-list.entity";
import { CreateUserListDto } from "../user-lists/dtos/create-user-list.dto";
import { UpdateUserListDto } from "../user-lists/dtos/update-user-list.dto";
import { ApiPaginatedResponse } from "../common/decorators/api-paginated-response.decorator";
import { DbUser } from "../user/user.entity";
import { FilterListContributorsDto } from "../user-lists/dtos/filter-contributors.dto";
import { DbUserListContributor } from "../user-lists/entities/user-list-contributor.entity";
import { MoveWorkspaceUserListDto } from "./dtos/move-workspace-list.dto";
import { DbWorkspaceUserLists } from "./entities/workspace-user-list.entity";
import { WorkspaceUserListsService } from "./workspace-user-lists.service";

@Controller("workspaces/:id/userLists")
@ApiTags("Workspace user lists service")
export class WorkspaceUserListsController {
  constructor(private readonly workspaceUserListsService: WorkspaceUserListsService) {}

  @Get()
  @ApiOperation({
    operationId: "getWorkspaceUserListsForUser",
    summary: "Gets workspace user lists for the authenticated user",
  })
  @ApiBearerAuth()
  @UseGuards(PassthroughSupabaseGuard)
  @ApiOkResponse({ type: DbUserList })
  @ApiNotFoundResponse({ description: "Unable to get user workspace user lists" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  async getWorkspaceUserListsForUser(
    @Param("id") id: string,
    @OptionalUserId() userId: number | undefined,
    @Query() pageOptionsDto: PageOptionsDto
  ): Promise<PageDto<DbUserList>> {
    return this.workspaceUserListsService.findAllUserListsByWorkspaceIdForUserId(pageOptionsDto, id, userId);
  }

  @Get("/:userListId")
  @ApiOperation({
    operationId: "getOneWorkspaceUserListForUser",
    summary: "Retrieves a workspace user list",
  })
  @UseGuards(PassthroughSupabaseGuard)
  @ApiOkResponse({ type: DbUserList })
  @ApiNotFoundResponse({ description: "Unable to get workspace user list" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiParam({ name: "id", type: "string" })
  @ApiParam({ name: "userListId", type: "string" })
  async getOneWorkspaceUserListForUser(
    @Param("id") id: string,
    @Param("userListId") userListId: string,
    @OptionalUserId() userId: number | undefined
  ): Promise<DbUserList> {
    return this.workspaceUserListsService.findOneUserListByWorkspaceeIdForUserId(id, userListId, userId);
  }

  @Post()
  @ApiOperation({
    operationId: "addWorkspaceUserListForUser",
    summary: "Adds a workspace userList page for the authenticated user",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOkResponse({ type: DbWorkspaceUserLists })
  @ApiNotFoundResponse({ description: "Unable to add workspace user list page" })
  @ApiUnprocessableEntityResponse({ description: "Unable to process workspace userList" })
  @ApiBody({ type: CreateUserListDto })
  @ApiParam({ name: "id", type: "string" })
  async addWorkspaceUserListForUser(
    @Param("id") id: string,
    @Body() createWorkspaceUserListDto: CreateUserListDto,
    @UserId() userId: number
  ): Promise<DbWorkspaceUserLists> {
    return this.workspaceUserListsService.addWorkspaceUserList(createWorkspaceUserListDto, id, userId);
  }

  @Post("/:newWorkspaceId")
  @ApiOperation({
    operationId: "moveWorkspaceUserListForUser",
    summary: "Moves a workspace user list for the authenticated user",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOkResponse({ type: DbWorkspaceUserLists })
  @ApiNotFoundResponse({ description: "Unable to move workspace user list" })
  @ApiUnprocessableEntityResponse({ description: "Unable to move workspace user list" })
  @ApiBody({ type: MoveWorkspaceUserListDto })
  @ApiParam({ name: "id", type: "string" })
  @ApiParam({ name: "newWorkspaceId", type: "string" })
  async moveWorkspaceUserListForUser(
    @Param("id") id: string,
    @Param("newWorkspaceId") newWorkspaceId: string,
    @Body() moveWorkspaceUserListDto: MoveWorkspaceUserListDto,
    @UserId() userId: number
  ): Promise<DbWorkspaceUserLists> {
    return this.workspaceUserListsService.moveWorkspaceUserList(moveWorkspaceUserListDto, id, newWorkspaceId, userId);
  }

  @Patch("/:listId")
  @ApiOperation({
    operationId: "updateWorkspaceUserListForUser",
    summary: "Updates a workspace user list for the authenticated user",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOkResponse({ type: DbUserList })
  @ApiNotFoundResponse({ description: "Unable to update workspace user list" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiBody({ type: UpdateUserListDto })
  @ApiParam({ name: "id", type: "string" })
  @ApiParam({ name: "listId", type: "string" })
  async updateWorkspaceUserListForUser(
    @Param("id") id: string,
    @Param("listId") listId: string,
    @Body() updateListDto: UpdateUserListDto,
    @UserId() userId: number
  ): Promise<DbUserList> {
    return this.workspaceUserListsService.updateWorkspaceUserList(updateListDto, id, listId, userId);
  }

  @Delete("/:userListId")
  @ApiOperation({
    operationId: "deleteWorkspaceUserListForUser",
    summary: "Delete a workspace user list for the authenticated user",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiNotFoundResponse({ description: "Unable to delete workspace userList" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiParam({ name: "id", type: "string" })
  @ApiParam({ name: "userListId", type: "string" })
  async deleteOneWorkspaceContributorForUser(
    @Param("id") id: string,
    @Param("userListId") userListId: string,
    @UserId() userId: number
  ) {
    return this.workspaceUserListsService.deleteWorkspaceUserList(id, userListId, userId);
  }

  @Get("/:userListId/contributors")
  @ApiOperation({
    operationId: "getWorkspaceUserListContributors",
    summary: "Retrieves paginated contributors for workspace user list",
  })
  @ApiBearerAuth()
  @UseGuards(PassthroughSupabaseGuard)
  @ApiPaginatedResponse(DbUser)
  @ApiOkResponse({ type: DbUser })
  @ApiNotFoundResponse({ description: "Unable to get workspace user list contributors" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiParam({ name: "id", type: "string" })
  @ApiParam({ name: "userListId", type: "string" })
  async getWorkspaceUserListContributors(
    @Param("id") id: string,
    @Param("userListId") userListId: string,
    @OptionalUserId() userId: number | undefined,
    @Query() pageOptionsDto: FilterListContributorsDto
  ): Promise<PageDto<DbUserListContributor>> {
    return this.workspaceUserListsService.findWorkspaceUserListContributors(pageOptionsDto, id, userListId, userId);
  }

  @Get("/:userListId/contributors/highlights")
  @ApiOperation({
    operationId: "getWorkspaceUserListContributorHighlights",
    summary: "Retrieves highlights for contributors for a workspace user list",
  })
  @ApiBearerAuth()
  @UseGuards(PassthroughSupabaseGuard)
  @ApiPaginatedResponse(DbUserHighlight)
  @ApiOkResponse({ type: DbUserHighlight })
  @ApiNotFoundResponse({ description: "Unable to get workspace user list contributor highlights" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiParam({ name: "id", type: "string" })
  @ApiParam({ name: "userListId", type: "string" })
  async getWorkspaceUserListContributorHighlights(
    @Param("id") id: string,
    @Param("userListId") userListId: string,
    @OptionalUserId() userId: number | undefined,
    @Query() pageOptionsDto: HighlightOptionsDto
  ): Promise<PageDto<DbUserHighlight>> {
    return this.workspaceUserListsService.findWorkspaceUserListContributorHightlights(
      pageOptionsDto,
      id,
      userListId,
      userId
    );
  }

  @Get("/:userListId/contributors/highlights/tagged-repos")
  @ApiOperation({
    operationId: "getWorkspaceUserListContributorHighlightedRepos",
    summary: "Retrieves highlighted repos for contributors for a workspace user list",
  })
  @ApiBearerAuth()
  @UseGuards(PassthroughSupabaseGuard)
  @ApiPaginatedResponse(DbUserHighlightRepo)
  @ApiOkResponse({ type: DbUserHighlightRepo })
  @ApiNotFoundResponse({ description: "Unable to get workspace user list contributor highlights" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiParam({ name: "id", type: "string" })
  @ApiParam({ name: "userListId", type: "string" })
  async getUserListContributorHighlightedRepos(
    @Param("id") id: string,
    @Param("userListId") userListId: string,
    @OptionalUserId() userId: number | undefined,
    @Query() pageOptionsDto: PageOptionsDto
  ): Promise<PageDto<DbUserHighlightRepo>> {
    return this.workspaceUserListsService.findWorkspaceUserListContributorHightlightedRepos(
      pageOptionsDto,
      id,
      userListId,
      userId
    );
  }

  @Post("/:userListId/contributors")
  @ApiOperation({
    operationId: "postWorkspaceUserListContributors",
    summary: "Add new contributors to a workspace user list",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiNotFoundResponse({ description: "Unable to add contributors to the workspace's user list contributors" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiParam({ name: "id", type: "string" })
  @ApiParam({ name: "userListId", type: "string" })
  async postWorkspaceUserListContributors(
    @Param("id") id: string,
    @Param("userListId") userListId: string,
    @UserId() userId: number,
    @Body() updateCollaboratorsDto: CollaboratorsDto
  ): Promise<DbUserListContributor[]> {
    return this.workspaceUserListsService.addWorkspaceUserListContributors(
      updateCollaboratorsDto,
      id,
      userListId,
      userId
    );
  }

  @Delete("/:userListId/contributors/:userListContributorId")
  @ApiOperation({
    operationId: "deleteWorkspaceUserListContributor",
    summary: "Delete contributor from a workspace user list",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiNotFoundResponse({ description: "Unable to delete user from workspace user list contributors" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiParam({ name: "id", type: "string" })
  @ApiParam({ name: "userListId", type: "string" })
  @ApiParam({ name: "userListContributorId", type: "string" })
  async deleteUserListContributors(
    @Param("id") id: string,
    @Param("userListId") userListId: string,
    @Param("userListContributorId") userListContributorId: string,
    @UserId() userId: number
  ): Promise<void> {
    await this.workspaceUserListsService.deleteWorkspaceUserListContributor(
      id,
      userListId,
      userListContributorId,
      userId
    );
  }
}
