import { Controller, Get, Header, Param, Query, UseGuards } from "@nestjs/common";
import {
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
  ApiTags,
  ApiBadRequestResponse,
  ApiParam,
} from "@nestjs/swagger";

import { PassthroughSupabaseGuard } from "../auth/passthrough-supabase.guard";
import { OptionalUserId } from "../auth/supabase.user.decorator";

import { DbWorkspaceStats } from "./entities/workspace-stats.entity";
import { WorkspaceStatsService } from "./workspace-stats.service";
import { WorkspaceStatsOptionsDto } from "./dtos/workspace-stats.dto";
import { DbWorkspaceRossIndex } from "./entities/workspace-ross.entity";

@Controller("workspaces/:id")
@ApiTags("Workspaces stats service")
export class WorkspaceStatsController {
  constructor(private readonly workspaceStatsService: WorkspaceStatsService) {}

  @Get("/stats")
  @ApiOperation({
    operationId: "getWorkspaceStatsForUser",
    summary: "Gets workspace stats for the authenticated user",
  })
  @ApiBearerAuth()
  @UseGuards(PassthroughSupabaseGuard)
  @ApiOkResponse({ type: DbWorkspaceStats })
  @ApiNotFoundResponse({ description: "Unable to get user workspace stats" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiParam({ name: "id", type: "string" })
  @Header("Cache-Control", "private, max-age=600")
  async getWorkspaceStatsForUser(
    @Param("id") id: string,
    @OptionalUserId() userId: number | undefined,
    @Query() workspaceStatsOptionsDto: WorkspaceStatsOptionsDto
  ): Promise<DbWorkspaceStats> {
    return this.workspaceStatsService.findStatsByWorkspaceIdForUserId(workspaceStatsOptionsDto, id, userId);
  }

  @Get("/ross")
  @ApiOperation({
    operationId: "getWorkspaceRossIndex",
    summary: "Gets workspace ross index/stats for the authenticated user",
  })
  @ApiBearerAuth()
  @UseGuards(PassthroughSupabaseGuard)
  @ApiOkResponse({ type: DbWorkspaceStats })
  @ApiNotFoundResponse({ description: "Unable to get user workspace ross index" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiParam({ name: "id", type: "string" })
  @Header("Cache-Control", "private, max-age=600")
  async getWorkspaceRossIndex(
    @Param("id") id: string,
    @OptionalUserId() userId: number | undefined,
    @Query() workspaceStatsOptionsDto: WorkspaceStatsOptionsDto
  ): Promise<DbWorkspaceRossIndex> {
    return this.workspaceStatsService.findRossByWorkspaceIdForUserId(workspaceStatsOptionsDto, id, userId);
  }
}
