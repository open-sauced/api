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

import { WorkspaceOrgsService } from "./workspace-orgs.service";
import { DbWorkspaceOrg } from "./entities/workspace-org.entity";
import { UpdateWorkspaceOrgsDto } from "./dtos/update-workspace-orgs.dto";
import { DbWorkspace } from "./entities/workspace.entity";
import { DeleteWorkspaceOrgsDto } from "./dtos/delete-workspace-orgs.dto";

@Controller("workspaces/:id/orgs")
@ApiTags("Workspace orgs service")
export class WorkspaceOrgController {
  constructor(private readonly workspaceOrgService: WorkspaceOrgsService) {}

  @Get()
  @ApiOperation({
    operationId: "getWorkspaceOrgsForUser",
    summary: "Gets workspace orgs for the authenticated user",
  })
  @ApiBearerAuth()
  @UseGuards(PassthroughSupabaseGuard)
  @ApiOkResponse({ type: DbWorkspaceOrg })
  @ApiNotFoundResponse({ description: "Unable to get user workspace orgs" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  async getWorkspaceOrgsForUser(
    @Param("id") id: string,
    @OptionalUserId() userId: number | undefined,
    @Query() pageOptionsDto: PageOptionsDto
  ): Promise<PageDto<DbWorkspaceOrg>> {
    return this.workspaceOrgService.findAllOrgsByWorkspaceIdForUserId(pageOptionsDto, id, userId);
  }

  @Post()
  @ApiOperation({
    operationId: "addWorkspaceOrgsForUser",
    summary: "Adds workspace orgs for the authenticated user",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOkResponse({ type: DbWorkspaceOrg })
  @ApiNotFoundResponse({ description: "Unable to add workspace orgs" })
  @ApiUnprocessableEntityResponse({ description: "Unable to add workspace orgs" })
  @ApiBody({ type: UpdateWorkspaceOrgsDto })
  @ApiParam({ name: "id", type: "string" })
  async addWorkspaceOrgsForUser(
    @Param("id") id: string,
    @Body() updateWorkspaceOrgsDto: UpdateWorkspaceOrgsDto,
    @UserId() userId: number
  ): Promise<DbWorkspace> {
    return this.workspaceOrgService.addWorkspaceOrgs(updateWorkspaceOrgsDto, id, userId);
  }

  @Post("/:orgUserId")
  @ApiOperation({
    operationId: "addOneWorkspaceOrgForUser",
    summary: "Adds one workspace org for the authenticated user",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOkResponse({ type: DbWorkspaceOrg })
  @ApiNotFoundResponse({ description: "Unable to add workspace org" })
  @ApiUnprocessableEntityResponse({ description: "Unable to add workspace org" })
  @ApiParam({ name: "id", type: "string" })
  @ApiParam({ name: "orgUserId", type: "number" })
  async addOneWorkspaceOrgForUser(
    @Param("id") id: string,
    @Param("orgUserId") orgUserId: number,
    @UserId() userId: number
  ): Promise<DbWorkspace> {
    return this.workspaceOrgService.addOneWorkspaceOrg(id, orgUserId, userId);
  }

  @Delete()
  @ApiOperation({
    operationId: "deleteWorkspaceOrgsForUser",
    summary: "Deletes workspace orgs for the authenticated user",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiNotFoundResponse({ description: "Unable to delete workspace orgs" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiBody({ type: DeleteWorkspaceOrgsDto })
  @ApiParam({ name: "id", type: "string" })
  async deleteWorkspaceOrgsForUser(
    @Param("id") id: string,
    @Body() deleteWorkspaceOrgsDto: DeleteWorkspaceOrgsDto,
    @UserId() userId: number
  ) {
    return this.workspaceOrgService.deleteWorkspaceOrgs(deleteWorkspaceOrgsDto, id, userId);
  }

  @Delete("/:orgUserId")
  @ApiOperation({
    operationId: "deleteOneWorkspaceOrgForUser",
    summary: "Deletes a workspace org for the authenticated user",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiNotFoundResponse({ description: "Unable to delete workspace orgs" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiParam({ name: "id", type: "string" })
  @ApiParam({ name: "orgUserId", type: "number" })
  async deleteOneWorkspaceOrgForUser(
    @Param("id") id: string,
    @Param("orgUserId") orgUserId: number,
    @UserId() userId: number
  ) {
    return this.workspaceOrgService.deleteOneWorkspaceOrg(id, orgUserId, userId);
  }
}
