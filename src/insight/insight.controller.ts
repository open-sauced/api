import { Controller, Delete, Get, Param, ParseIntPipe, Query, UnauthorizedException, UseGuards } from "@nestjs/common";
import {
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
} from "@nestjs/swagger";
import { PageDto } from "../common/dtos/page.dto";
import { SupabaseGuard } from "../auth/supabase.guard";
import { UserId } from "../auth/supabase.user.decorator";
import { UpdateInsightDto } from "./dtos/update-insight.dto";

import { DbInsight } from "./entities/insight.entity";
import { DbInsightRepo } from "./entities/insight-repo.entity";
import { InsightsService } from "./insights.service";
import { InsightPageOptionsDto } from "./dtos/insight-page-options.dto";
import { InsightRepoService } from "./insight-repo.service";
import { InsightDto } from "./dtos/insight.dto";

@Controller("insights")
@ApiTags("Insights service")
export class InsightController {
  constructor(
    private readonly insightsService: InsightsService,
    private readonly insightReposService: InsightRepoService
  ) {}

  @Get("/:id")
  @ApiOperation({
    operationId: "findInsightPageById",
    summary: "Finds a insight page by :id",
  })
  @ApiOkResponse({ type: DbInsight })
  @ApiNotFoundResponse({ description: "Insight page not found" })
  @ApiUnauthorizedResponse({ description: "Not Authorized to view this Insight" })
  @ApiParam({ name: "id", type: "integer" })
  async findInsightPageById(@Query() options: InsightDto, @Param("id", ParseIntPipe) id: number): Promise<DbInsight> {
    return this.insightsService.findOneById(id, options.include === "all");
  }

  @Get("/:id/repos")
  @ApiOperation({
    operationId: "findInsightReposById",
    summary: "Finds a insight page repositories by :id",
  })
  @ApiOkResponse({ type: DbInsightRepo })
  @ApiNotFoundResponse({ description: "Insight page not found" })
  @ApiUnauthorizedResponse({ description: "Not Authorized to view this Insight" })
  @ApiParam({ name: "id", type: "integer" })
  async findInsightReposById(@Param("id", ParseIntPipe) id: number): Promise<DbInsightRepo[]> {
    return this.insightReposService.findReposById(id);
  }

  @Get("/featured")
  @ApiOperation({
    operationId: "findFeaturedInsights",
    summary: "Finds featured insights",
  })
  @ApiOkResponse({ type: DbInsight })
  @ApiBadRequestResponse({ description: "Invalid request" })
  async findFeaturedInsights(@Query() pageOptionsDto: InsightPageOptionsDto): Promise<PageDto<DbInsight>> {
    return this.insightsService.findAllFeatured(pageOptionsDto);
  }

  @Delete("/:id")
  @ApiOperation({
    operationId: "removeInsightForUser",
    summary: "Removes an insight page for the authenticated user",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOkResponse({ type: DbInsight })
  @ApiNotFoundResponse({ description: "Unable to remove user insight" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiBody({ type: UpdateInsightDto })
  @ApiParam({ name: "id", type: "integer" })
  async removeInsightForUser(@Param("id", ParseIntPipe) id: number, @UserId() userId: number): Promise<void> {
    const insight = await this.insightsService.findOneByIdAndUserId(id, userId);

    const membership = insight.members.find((member) => member.user_id === userId);

    if (!membership || membership.access !== "admin") {
      throw new UnauthorizedException();
    }

    await this.insightsService.removeInsight(id);
  }
}
