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

import { PageOptionsDto } from "../common/dtos/page-options.dto";
import { PageDto } from "../common/dtos/page.dto";
import { UserId } from "../auth/supabase.user.decorator";
import { SupabaseGuard } from "../auth/supabase.guard";

import { WorkspaceContributorsService } from "./workspace-contributors.service";
import { DbWorkspaceContributor } from "./entities/workspace-contributors.entity";
import { UpdateWorkspaceContributorsDto } from "./dtos/update-workspace-contributors.dto";
import { DbWorkspace } from "./entities/workspace.entity";
import { DeleteWorkspaceContributorsDto } from "./dtos/delete-workspace-contributors.dto";

@Controller("workspaces/:id/contributors")
@ApiTags("Workspace contributors service")
export class WorkspaceContributorController {
  constructor(private readonly workspaceContributorService: WorkspaceContributorsService) {}

  @Get()
  @ApiOperation({
    operationId: "getWorkspaceContributorsForUser",
    summary: "Gets workspace contributors for the authenticated user",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOkResponse({ type: DbWorkspaceContributor })
  @ApiNotFoundResponse({ description: "Unable to get user workspace contributors" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  async getWorkspaceContributorsForUser(
    @Param("id") id: string,
    @UserId() userId: number,
    @Query() pageOptionsDto: PageOptionsDto
  ): Promise<PageDto<DbWorkspaceContributor>> {
    return this.workspaceContributorService.findAllContributorsByWorkspaceIdForUserId(pageOptionsDto, id, userId);
  }

  @Post()
  @ApiOperation({
    operationId: "addWorkspaceContributorsForUser",
    summary: "Updates workspace contributor for the authenticated user",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOkResponse({ type: DbWorkspaceContributor })
  @ApiNotFoundResponse({ description: "Unable to update workspace contributors" })
  @ApiUnprocessableEntityResponse({ description: "Unable to process workspace contributors" })
  @ApiBody({ type: UpdateWorkspaceContributorsDto })
  @ApiParam({ name: "id", type: "string" })
  async addWorkspaceContributorsForUser(
    @Param("id") id: string,
    @Body() updateWorkspaceContributorsDto: UpdateWorkspaceContributorsDto,
    @UserId() userId: number
  ): Promise<DbWorkspace> {
    return this.workspaceContributorService.addWorkspaceContributors(updateWorkspaceContributorsDto, id, userId);
  }

  @Post("id/:contributorId")
  @ApiOperation({
    operationId: "addOneWorkspaceContributorForUser",
    summary: "Updates a workspace contributor for the authenticated user",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOkResponse({ type: DbWorkspaceContributor })
  @ApiNotFoundResponse({ description: "Unable to update workspace contributor" })
  @ApiUnprocessableEntityResponse({ description: "Unable to process workspace contributor" })
  @ApiParam({ name: "id", type: "string" })
  @ApiParam({ name: "contributorId", type: "string" })
  async addOneWorkspaceContributorForUser(
    @Param("id") id: string,
    @Param("contributorId") contributorId: number,
    @UserId() userId: number
  ): Promise<DbWorkspace> {
    return this.workspaceContributorService.addOneWorkspaceContributor(id, userId, contributorId);
  }

  @Post("login/:contributorLogin")
  @ApiOperation({
    operationId: "addOneWorkspaceContributorByLoginForUser",
    summary: "Updates a workspace contributor for the authenticated user by the contributor login",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOkResponse({ type: DbWorkspaceContributor })
  @ApiNotFoundResponse({ description: "Unable to update workspace contributor" })
  @ApiUnprocessableEntityResponse({ description: "Unable to process workspace contributor" })
  @ApiParam({ name: "id", type: "string" })
  @ApiParam({ name: "contributorLogin", type: "string" })
  async addOneWorkspaceContributorByLoginForUser(
    @Param("id") id: string,
    @Param("contributorLogin") contributorLogin: string,
    @UserId() userId: number
  ): Promise<DbWorkspace> {
    return this.workspaceContributorService.addOneWorkspaceContributor(id, userId, undefined, contributorLogin);
  }

  @Delete()
  @ApiOperation({
    operationId: "deleteWorkspaceContributorsForUser",
    summary: "Deletes workspace contributors for the authenticated user",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiNotFoundResponse({ description: "Unable to delete workspace contributors" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiBody({ type: DeleteWorkspaceContributorsDto })
  @ApiParam({ name: "id", type: "string" })
  async deleteWorkspaceContributorsForUser(
    @Param("id") id: string,
    @Body() deleteWorkspaceContributorsDto: DeleteWorkspaceContributorsDto,
    @UserId() userId: number
  ) {
    return this.workspaceContributorService.deleteWorkspaceContributors(deleteWorkspaceContributorsDto, id, userId);
  }

  @Delete("id/:contributorId")
  @ApiOperation({
    operationId: "deleteOneWorkspaceContributorForUser",
    summary: "Delete a workspace contributors for the authenticated user",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiNotFoundResponse({ description: "Unable to delete workspace contributor" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiParam({ name: "id", type: "string" })
  @ApiParam({ name: "contributorId", type: "number" })
  async deleteOneWorkspaceContributorForUser(
    @Param("id") id: string,
    @Param("contributorId") contributorId: number,
    @UserId() userId: number
  ) {
    return this.workspaceContributorService.deleteOneWorkspaceContributor(id, userId, contributorId);
  }

  @Delete("login/:contributorLogin")
  @ApiOperation({
    operationId: "deleteOneWorkspaceContributorByLoginForUser",
    summary: "Delete a workspace contributor by their login for the authenticated user",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiNotFoundResponse({ description: "Unable to delete workspace contributor" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiParam({ name: "id", type: "string" })
  @ApiParam({ name: "contributorLogin", type: "string" })
  async deleteOneWorkspaceContributorByLoginForUser(
    @Param("id") id: string,
    @Param("contributorLogin") contributorLogin: string,
    @UserId() userId: number
  ) {
    return this.workspaceContributorService.deleteOneWorkspaceContributor(id, userId, undefined, contributorLogin);
  }
}
