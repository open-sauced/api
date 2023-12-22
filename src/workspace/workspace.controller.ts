import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import {
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
  ApiTags,
  ApiBadRequestResponse,
  ApiParam,
  ApiUnprocessableEntityResponse,
  ApiBody,
} from "@nestjs/swagger";

import { PageOptionsDto } from "../common/dtos/page-options.dto";
import { PageDto } from "../common/dtos/page.dto";
import { UserId } from "../auth/supabase.user.decorator";
import { SupabaseGuard } from "../auth/supabase.guard";

import { WorkspaceService } from "./workspace.service";
import { DbWorkspace } from "./entities/workspace.entity";
import { CreateWorkspaceDto } from "./dtos/create-workspace.dto";
import { UpdateWorkspaceDto } from "./dtos/update-workspace.dto";

@Controller("workspaces")
@ApiTags("Workspaces service")
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Get("/")
  @ApiOperation({
    operationId: "getWorkspaceForUser",
    summary: "Gets workspaces for the authenticated user",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOkResponse({ type: DbWorkspace })
  @ApiNotFoundResponse({ description: "Unable to get user workspaces" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  async getWorkspacesForUser(
    @UserId() userId: number,
    @Query() pageOptionsDto: PageOptionsDto
  ): Promise<PageDto<DbWorkspace>> {
    return this.workspaceService.findAllByUserId(pageOptionsDto, userId);
  }

  @Post("/")
  @ApiOperation({
    operationId: "createWorkspaceForUser",
    summary: "Create a new workspace for the authenticated user",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOkResponse({ type: DbWorkspace })
  @ApiBadRequestResponse({ description: "Invalid request" })
  async createWorkspaceForUser(@UserId() userId: number, @Body() createWorkspaceDto: CreateWorkspaceDto) {
    return this.workspaceService.createWorkspace(createWorkspaceDto, userId);
  }

  @Patch("/:id")
  @ApiOperation({
    operationId: "updateWorkspaceForUser",
    summary: "Updates a workspace for the authenticated user",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOkResponse({ type: DbWorkspace })
  @ApiNotFoundResponse({ description: "Unable to update workspace" })
  @ApiUnprocessableEntityResponse({ description: "Unable to process workspace" })
  @ApiBody({ type: UpdateWorkspaceDto })
  @ApiParam({ name: "id", type: "string" })
  async updateWorkspaceForUser(
    @Param("id") id: string,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
    @UserId() userId: number
  ): Promise<DbWorkspace> {
    return this.workspaceService.updateWorkspace(id, updateWorkspaceDto, userId);
  }

  @Delete("/:id")
  @ApiOperation({
    operationId: "deleteWorkspaceForUser",
    summary: "Deletes a workspace for the authenticated user",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiNotFoundResponse({ description: "Unable to delete workspace" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiParam({ name: "id", type: "string" })
  async deleteWorkspaceForUser(@Param("id") id: string, @UserId() userId: number) {
    return this.workspaceService.deleteWorkspace(id, userId);
  }
}
