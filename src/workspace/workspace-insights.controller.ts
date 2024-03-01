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
import { DbInsight } from "../insight/entities/insight.entity";
import { PageOptionsDto } from "../common/dtos/page-options.dto";
import { PageDto } from "../common/dtos/page.dto";
import { OptionalUserId, UserId } from "../auth/supabase.user.decorator";
import { SupabaseGuard } from "../auth/supabase.guard";

import { CreateInsightDto } from "../insight/dtos/create-insight.dto";
import { DbWorkspaceInsight } from "./entities/workspace-insights.entity";
import { WorkspaceInsightsService } from "./workspace-insights.service";
import { MoveWorkspaceInsightDto } from "./dtos/move-workspace-insight.dto";

@Controller("workspaces/:id/insights")
@ApiTags("Workspace insights service")
export class WorkspaceInsightsController {
  constructor(private readonly workspaceInsightsService: WorkspaceInsightsService) {}

  @Get()
  @ApiOperation({
    operationId: "getWorkspaceInsightsForUser",
    summary: "Gets workspace insights for the authenticated user",
  })
  @ApiBearerAuth()
  @UseGuards(PassthroughSupabaseGuard)
  @ApiOkResponse({ type: DbInsight })
  @ApiNotFoundResponse({ description: "Unable to get user workspace insights" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  async getWorkspaceInsightsForUser(
    @Param("id") id: string,
    @OptionalUserId() userId: number | undefined,
    @Query() pageOptionsDto: PageOptionsDto
  ): Promise<PageDto<DbInsight>> {
    return this.workspaceInsightsService.findAllInsightsByWorkspaceIdForUserId(pageOptionsDto, id, userId);
  }

  @Post()
  @ApiOperation({
    operationId: "addWorkspaceInsightForUser",
    summary: "Adds a workspace insight page for the authenticated user",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOkResponse({ type: DbWorkspaceInsight })
  @ApiNotFoundResponse({ description: "Unable to add workspace insight page" })
  @ApiUnprocessableEntityResponse({ description: "Unable to process workspace insight" })
  @ApiBody({ type: CreateInsightDto })
  @ApiParam({ name: "id", type: "string" })
  async addWorkspaceInsightForUser(
    @Param("id") id: string,
    @Body() createWorkspaceInsightDto: CreateInsightDto,
    @UserId() userId: number
  ): Promise<DbWorkspaceInsight> {
    return this.workspaceInsightsService.addWorkspaceInsight(createWorkspaceInsightDto, id, userId);
  }

  @Post("/:newWorkspaceId")
  @ApiOperation({
    operationId: "moveWorkspaceInsightForUser",
    summary: "Moves a workspace insight page for the authenticated user",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOkResponse({ type: DbWorkspaceInsight })
  @ApiNotFoundResponse({ description: "Unable to move workspace insight page" })
  @ApiUnprocessableEntityResponse({ description: "Unable to move workspace insight" })
  @ApiBody({ type: MoveWorkspaceInsightDto })
  @ApiParam({ name: "id", type: "string" })
  @ApiParam({ name: "newWorkspaceId", type: "string" })
  async moveWorkspaceInsightForUser(
    @Param("id") id: string,
    @Param("newWorkspaceId") newWorkspaceId: string,
    @Body() moveWorkspaceInsightDto: MoveWorkspaceInsightDto,
    @UserId() userId: number
  ): Promise<DbWorkspaceInsight> {
    return this.workspaceInsightsService.moveWorkspaceInsight(moveWorkspaceInsightDto, id, newWorkspaceId, userId);
  }

  @Get("/:insightId")
  @ApiOperation({
    operationId: "getOneWorkspaceInsightForUser",
    summary: "Gets one workspace insight for the authenticated user",
  })
  @ApiBearerAuth()
  @UseGuards(PassthroughSupabaseGuard)
  @ApiOkResponse({ type: DbInsight })
  @ApiNotFoundResponse({ description: "Unable to get user workspace insight" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  async getOneWorkspaceInsightForUser(
    @Param("id") id: string,
    @Param("insightId") insightId: number,
    @OptionalUserId() userId: number | undefined
  ): Promise<DbInsight> {
    return this.workspaceInsightsService.findOneInsightByWorkspaceIdForUserId(id, insightId, userId);
  }

  @Delete("/:insightId")
  @ApiOperation({
    operationId: "deleteWorkspaceInsightForUser",
    summary: "Delete a workspace insight for the authenticated user",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiNotFoundResponse({ description: "Unable to delete workspace insight" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiParam({ name: "id", type: "string" })
  @ApiParam({ name: "insightId", type: "number" })
  async deleteOneWorkspaceContributorForUser(
    @Param("id") id: string,
    @Param("insightId") insightId: number,
    @UserId() userId: number
  ) {
    return this.workspaceInsightsService.deleteWorkspaceInsight(id, insightId, userId);
  }
}
