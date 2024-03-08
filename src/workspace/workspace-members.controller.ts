import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import {
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
  ApiTags,
  ApiBadRequestResponse,
  ApiUnprocessableEntityResponse,
  ApiParam,
  ApiBody,
} from "@nestjs/swagger";

import { PassthroughSupabaseGuard } from "../auth/passthrough-supabase.guard";
import { PageOptionsDto } from "../common/dtos/page-options.dto";
import { PageDto } from "../common/dtos/page.dto";
import { OptionalUserId, UserId } from "../auth/supabase.user.decorator";
import { SupabaseGuard } from "../auth/supabase.guard";

import { DbWorkspaceMember } from "./entities/workspace-member.entity";
import { WorkspaceMembersService } from "./workspace-members.service";
import { UpdateWorkspaceMemberDto, UpdateWorkspaceMembersDto } from "./dtos/update-workspace-members.dto";
import { DbWorkspace } from "./entities/workspace.entity";
import { DeleteWorkspaceMembersDto } from "./dtos/delete-workspace-member.dto";

@Controller("workspaces/:id/members")
@ApiTags("Workspace members service")
export class WorkspaceMemberController {
  constructor(private readonly workspaceMemberService: WorkspaceMembersService) {}

  @Get()
  @ApiOperation({
    operationId: "getWorkspaceMembersForUser",
    summary: "Gets workspace members for the authenticated user",
  })
  @ApiBearerAuth()
  @UseGuards(PassthroughSupabaseGuard)
  @ApiOkResponse({ type: DbWorkspaceMember })
  @ApiNotFoundResponse({ description: "Unable to get user workspace members" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  async getWorkspaceMembersForUser(
    @Param("id") id: string,
    @OptionalUserId() userId: undefined,
    @Query() pageOptionsDto: PageOptionsDto
  ): Promise<PageDto<DbWorkspaceMember>> {
    return this.workspaceMemberService.findAllMembersByWorkspaceIdForUserId(pageOptionsDto, id, userId);
  }

  @Post()
  @ApiOperation({
    operationId: "updateWorkspaceMembersForUser",
    summary: "Updates workspace members for the authenticated user",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOkResponse({ type: DbWorkspaceMember })
  @ApiNotFoundResponse({ description: "Unable to update workspace members" })
  @ApiUnprocessableEntityResponse({ description: "Unable to process workspace members" })
  @ApiBody({ type: UpdateWorkspaceMembersDto })
  @ApiParam({ name: "id", type: "string" })
  async updateWorkspaceMembersForUser(
    @Param("id") id: string,
    @Body() updateWorkspaceMembersDto: UpdateWorkspaceMembersDto,
    @UserId() userId: number
  ): Promise<DbWorkspace> {
    return this.workspaceMemberService.updateWorkspaceMembers(updateWorkspaceMembersDto, id, userId);
  }

  @Patch("/:memberId")
  @ApiOperation({
    operationId: "updateOneWorkspaceMemberForUser",
    summary: "Updates a workspace member for the authenticated user",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOkResponse({ type: DbWorkspaceMember })
  @ApiNotFoundResponse({ description: "Unable to update workspace member" })
  @ApiUnprocessableEntityResponse({ description: "Unable to process workspace member" })
  @ApiBody({ type: UpdateWorkspaceMemberDto })
  @ApiParam({ name: "id", type: "string" })
  @ApiParam({ name: "memberId", type: "string" })
  async updateWorkspaceMemberForUser(
    @Param("id") id: string,
    @Param("memberId") memberId: string,
    @Body() updateWorkspaceMemberDto: UpdateWorkspaceMemberDto,
    @UserId() userId: number
  ): Promise<DbWorkspace> {
    return this.workspaceMemberService.updateOneWorkspaceMember(updateWorkspaceMemberDto, id, memberId, userId);
  }

  @Delete()
  @ApiOperation({
    operationId: "deleteWorkspaceMembersForUser",
    summary: "Deletes workspace members for the authenticated user",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiNotFoundResponse({ description: "Unable to delete workspace members" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiBody({ type: DeleteWorkspaceMembersDto })
  @ApiParam({ name: "id", type: "string" })
  async deleteWorkspaceMembersForUser(
    @Param("id") id: string,
    @Body() deleteWorkspaceMembersDto: DeleteWorkspaceMembersDto,
    @UserId() userId: number
  ) {
    return this.workspaceMemberService.deleteWorkspaceMembers(deleteWorkspaceMembersDto, id, userId);
  }

  @Delete("/:memberId")
  @ApiOperation({
    operationId: "deleteOneWorkspaceMemberForUser",
    summary: "Delete a workspace member for the authenticated user",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiNotFoundResponse({ description: "Unable to delete workspace member" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiParam({ name: "id", type: "string" })
  @ApiParam({ name: "memberId", type: "string" })
  async deleteOneWorkspaceMemberForUser(
    @Param("id") id: string,
    @Param("memberId") memberId: string,
    @UserId() userId: number
  ) {
    return this.workspaceMemberService.deleteOneWorkspaceMember(id, memberId, userId);
  }
}
