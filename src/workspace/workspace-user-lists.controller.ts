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
import { DbUserList } from "../user-lists/entities/user-list.entity";
import { CreateUserListDto } from "../user-lists/dtos/create-user-list.dto";
import { WorkspaceUserListsService } from "./workspace-user-lists.service";
import { DbWorkspaceUserLists } from "./entities/workspace-user-list.entity";

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
}
