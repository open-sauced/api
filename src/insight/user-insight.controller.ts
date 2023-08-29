import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UnauthorizedException,
  UnprocessableEntityException,
  UseGuards,
} from "@nestjs/common";
import {
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
  ApiTags,
  ApiBadRequestResponse,
  ApiBody,
  ApiUnprocessableEntityResponse,
  ApiParam,
} from "@nestjs/swagger";

import { SupabaseGuard } from "../auth/supabase.guard";
import { UserId } from "../auth/supabase.user.decorator";
import { ApiPaginatedResponse } from "../common/decorators/api-paginated-response.decorator";
import { PageDto } from "../common/dtos/page.dto";
import { CreateInsightDto } from "./dtos/create-insight.dto";

import { InsightPageOptionsDto } from "./dtos/insight-page-options.dto";
import { UpdateInsightDto } from "./dtos/update-insight.dto";
import { DbInsight } from "./entities/insight.entity";
import { InsightMemberService } from "./insight-member.service";
import { InsightRepoService } from "./insight-repo.service";
import { InsightsService } from "./insights.service";

@Controller("user/insights")
@ApiTags("Insights service")
export class UserInsightsController {
  constructor(
    private readonly insightsService: InsightsService,
    private readonly insightsRepoService: InsightRepoService,
    private insightMemberService: InsightMemberService
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
  async findAllInsightsByUserId(
    @Query() pageOptionsDto: InsightPageOptionsDto,
    @UserId() userId: string
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
  async addInsightForUser(@Body() createInsightDto: CreateInsightDto, @UserId() userId: number): Promise<DbInsight> {
    if (!createInsightDto.name || !Array.isArray(createInsightDto.repos)) {
      throw new BadRequestException();
    }

    const newInsight = await this.insightsService.addInsight({
      name: createInsightDto.name,
      is_public: createInsightDto.is_public,
      user_id: userId,
    });

    createInsightDto.repos.forEach(async (repo) => {
      await this.insightsRepoService.addInsightRepo(newInsight.id, repo);
    });

    return newInsight;
  }

  @Patch("/:id")
  @ApiOperation({
    operationId: "updateInsightForUser",
    summary: "Updates an insight page for the authenticated user",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOkResponse({ type: DbInsight })
  @ApiNotFoundResponse({ description: "Unable to update user insight" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiUnprocessableEntityResponse({ description: "Unable to unable insight repos" })
  @ApiBody({ type: UpdateInsightDto })
  @ApiParam({ name: "id", type: "integer" })
  async updateInsightForUser(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateInsightDto: UpdateInsightDto,
    @UserId() userId: number
  ): Promise<DbInsight> {
    const insight = await this.insightsService.findOneById(id);

    const canUpdate = await this.insightMemberService.canUserManageInsight(userId, insight.id, ["admin", "edit"]);

    if (!canUpdate) {
      throw new UnauthorizedException();
    }

    // update insight
    await this.insightsService.updateInsight(id, {
      name: updateInsightDto.name,
      is_public: updateInsightDto.is_public,
    });

    try {
      // current set of insight repos
      const currentRepos = insight.repos.filter((insightRepo) => !insightRepo.deleted_at);

      // remove deleted repos
      const reposToRemove = currentRepos.filter(
        (repo) => !updateInsightDto.repos.find((repoInfo) => `${repoInfo.id}` === `${repo.repo_id}`)
      );

      const reposToRemoveRequests = reposToRemove.map(async (insightRepo) =>
        this.insightsRepoService.removeInsightRepo(insightRepo.id)
      );

      await Promise.all(reposToRemoveRequests);

      // add new repos
      const currentRepoIds = currentRepos.map((cr) => cr.repo_id);
      const reposToAdd = updateInsightDto.repos.filter(
        (repoInfo) => !currentRepoIds.find((id) => `${id}` === `${repoInfo.id}`)
      );

      const repoToAddRequests = reposToAdd.map(async (repo) =>
        this.insightsRepoService.addInsightRepo(insight.id, repo)
      );

      await Promise.all(repoToAddRequests);
    } catch (e) {
      throw new UnprocessableEntityException();
    }

    return this.insightsService.findOneById(id);
  }
}
