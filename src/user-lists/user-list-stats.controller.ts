import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import {
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
  ApiTags,
  ApiBadRequestResponse,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";

import { PageDto } from "../common/dtos/page.dto";
import { SupabaseGuard } from "../auth/supabase.guard";

import { ApiPaginatedResponse } from "../common/decorators/api-paginated-response.decorator";
import { UserListMostActiveContributorsDto } from "./dtos/most-active-contributors.dto";
import { DbUserListContributorStat } from "./entities/user-list-contributor-stats.entity";
import { UserListStatsService } from "./user-list-stat.service";
import { DbContributionStatTimeframe } from "./entities/contributions-timeframe.entity";
import { ContributionsTimeframeDto } from "./dtos/contributions-timeframe.dto";
import { DbContributionsProjects } from "./entities/contributions-projects.entity";
import { DbContributorCategoryTimeframe } from "./entities/contributors-timeframe.entity";
import { ContributionsByProjectDto } from "./dtos/contributions-by-project.dto";

@Controller("lists")
@ApiTags("User Lists service")
export class UserListStatsController {
  constructor(private readonly userListStatsService: UserListStatsService) {}

  @Get(":id/stats/most-active-contributors")
  @ApiOperation({
    operationId: "getMostActiveContributors",
    summary: "Gets most active contributors for a given list",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiPaginatedResponse(DbUserListContributorStat)
  @ApiOkResponse({ type: DbUserListContributorStat })
  @ApiNotFoundResponse({ description: "Unable to get list most active contributors" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiParam({ name: "id", type: "string" })
  async getMostActiveContributors(
    @Param("id") id: string,
    @Query() pageOptionsDto: UserListMostActiveContributorsDto
  ): Promise<PageDto<DbUserListContributorStat>> {
    return this.userListStatsService.findAllListContributorStats(pageOptionsDto, id);
  }

  @Get(":id/stats/contributions-evolution-by-type")
  @ApiOperation({
    operationId: "getContributionsByTimeFrame",
    summary: "Gets contributions in a given timeframe",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOkResponse({ type: DbContributionStatTimeframe })
  @ApiNotFoundResponse({ description: "Unable to get contributions" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiParam({ name: "id", type: "string" })
  async getContributionsByTimeFrame(
    @Param("id") id: string,
    @Query() options: ContributionsTimeframeDto
  ): Promise<DbContributionStatTimeframe[]> {
    return this.userListStatsService.findContributionsInTimeframe(options, id);
  }

  @Get(":id/stats/contributions-by-project")
  @ApiOperation({
    operationId: "getContributionsByProject",
    summary: "Gets contributions in a given timeframe",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOkResponse({ type: DbContributionsProjects })
  @ApiNotFoundResponse({ description: "Unable to get contributions by project" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiParam({ name: "id", type: "string" })
  @ApiQuery({ name: "range", type: "integer", required: false })
  async getContributionsByProject(
    @Param("id") id: string,
    @Query() options: ContributionsByProjectDto
  ): Promise<DbContributionsProjects[]> {
    return this.userListStatsService.findContributionsByProject(id, options);
  }

  @Get(":id/stats/top-project-contributions-by-contributor/")
  @ApiOperation({
    operationId: "getContributorContributionsByProject",
    summary: "Gets top 20 contributor stats in a list by a given project",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOkResponse({ type: DbUserListContributorStat })
  @ApiNotFoundResponse({ description: "Unable to get contributions" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiParam({ name: "id", type: "string" })
  async getContributorContributionsByProject(
    @Param("id") id: string,
    @Query("repoId") repoId: number
  ): Promise<DbUserListContributorStat[]> {
    return this.userListStatsService.findListContributorStatsByProject(id, repoId);
  }

  @Get(":id/stats/contributions-evolution-by-contributor-type")
  @ApiOperation({
    operationId: "getContributorsByTimeframe",
    summary: "Gets contributions by category within timeframe",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOkResponse({ type: DbContributorCategoryTimeframe })
  @ApiNotFoundResponse({ description: "Unable to get contributions" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiParam({ name: "id", type: "string" })
  async getContributionsByTimeframe(
    @Param("id") id: string,
    @Query() options: ContributionsTimeframeDto
  ): Promise<DbContributorCategoryTimeframe[]> {
    return this.userListStatsService.findContributorCategoriesByTimeframe(options, id);
  }
}
