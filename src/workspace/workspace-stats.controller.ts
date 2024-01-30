import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import {
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
  ApiTags,
  ApiBadRequestResponse,
  ApiParam,
} from "@nestjs/swagger";

import { UserId } from "../auth/supabase.user.decorator";
import { SupabaseGuard } from "../auth/supabase.guard";

import { DbWorkspaceStats } from "./entities/workspace-stats.entity";
import { WorkspaceStatsService } from "./workspace-stats.service";
import { WorkspaceStatsOptionsDto } from "./dtos/workspace-stats.dto";

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
  @UseGuards(SupabaseGuard)
  @ApiOkResponse({ type: DbWorkspaceStats })
  @ApiNotFoundResponse({ description: "Unable to get user workspace stats" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiParam({ name: "id", type: "string" })
  async getWorkspaceStatsForUser(
    @Param("id") id: string,
    @UserId() userId: number,
    @Query() workspaceStatsOptionsDto: WorkspaceStatsOptionsDto
  ): Promise<DbWorkspaceStats> {
    return this.workspaceStatsService.findStatsByWorkspaceIdForUserId(workspaceStatsOptionsDto, id, userId);
  }
}
