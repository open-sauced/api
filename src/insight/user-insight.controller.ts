import { BadRequestException, Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiOkResponse, ApiNotFoundResponse, ApiBearerAuth, ApiTags, ApiBadRequestResponse, ApiBody } from "@nestjs/swagger";

import { SupabaseGuard } from "../auth/supabase.guard";
import { UserId } from "../auth/supabase.user.decorator";
import { ApiPaginatedResponse } from "../common/decorators/api-paginated-response.decorator";
import { PageDto } from "../common/dtos/page.dto";
import { CreateInsightDto } from "./dtos/create-insight.dto";

import { InsightPageOptionsDto } from "./dtos/insight-page-options.dto";
import { DbInsight } from "./entities/insight.entity";
import { InsightRepoService } from "./insight-repo.service";
import { InsightsService } from "./insights.service";

@Controller("user/insights")
@ApiTags("Insights service")
export class UserInsightsController {
  constructor (
    private readonly insightsService: InsightsService,
    private readonly insightsRepoService: InsightRepoService,
  ) {}

  @Get("/")
  @ApiOperation({
    operationId: "findAllInsightsByUserId",
    summary: "Listing all insights for a user and paginate them",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiPaginatedResponse(DbInsight)
  @ApiOkResponse({ type: DbInsight })
  @ApiNotFoundResponse({ description: "Insights not found" })
  async findAllInsightsByUserId (
    @Query() pageOptionsDto: InsightPageOptionsDto,
      @UserId() userId: string,
  ): Promise<PageDto<DbInsight>> {
    return this.insightsService.findAllByUserId(pageOptionsDto, userId);
  }

  @Post("/")
  @ApiOperation({
    operationId: "addInsightForUser",
    summary: "Adds a new insight page for the authenticated user",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOkResponse({ type: DbInsight })
  @ApiNotFoundResponse({ description: "Unable to add user insight" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiBody({ type: CreateInsightDto })
  async addInsightForUser (
    @Body() body: CreateInsightDto,
      @UserId() userId: number,
  ): Promise<DbInsight> {
    if (!body.name || !Array.isArray(body.ids)) {
      throw (new BadRequestException);
    }

    const newInsight = await this.insightsService.addInsight({
      name: body.name,
      user_id: userId,
    });

    if (Array.isArray(body.ids)) {
      const repoIds = body.ids;

      repoIds.forEach(async repoId => {
        await this.insightsRepoService.addInsightRepo(newInsight.id, repoId);
      });
    }

    return newInsight;
  }
}
