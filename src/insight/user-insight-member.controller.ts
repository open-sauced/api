import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UnauthorizedException, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiOkResponse, ApiNotFoundResponse, ApiBearerAuth, ApiTags, ApiBadRequestResponse, ApiBody, ApiUnprocessableEntityResponse } from "@nestjs/swagger";

import { SupabaseGuard } from "../auth/supabase.guard";
import { UserId } from "../auth/supabase.user.decorator";
import { ApiPaginatedResponse } from "../common/decorators/api-paginated-response.decorator";
import { PageDto } from "../common/dtos/page.dto";
import { CreateInsightMemberDto } from "./dtos/create-insight-member.dto";

import { InsightPageOptionsDto } from "./dtos/insight-page-options.dto";
import { UpdateInsightMemberDto } from "./dtos/update-insight-member.dto";
import { DbInsightMember } from "./entities/insight-member.entity";
import { DbInsight } from "./entities/insight.entity";
import { InsightMemberService } from "./insight-member.service";
import { InsightsService } from "./insights.service";

@Controller("user/insights")
@ApiTags("Insights service")
export class UserInsightMemberController {
  constructor (
    private readonly insightsService: InsightsService,
    private readonly insightMemberService: InsightMemberService,
  ) {}

  @Get(":id/members")
  @ApiOperation({
    operationId: "findAllInsightMembers",
    summary: "Listing all members for an insight and paginate them",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiPaginatedResponse(DbInsightMember)
  @ApiOkResponse({ type: DbInsightMember })
  @ApiNotFoundResponse({ description: "Insight not found" })
  async findAllInsightsByUserId (
    @Query() pageOptionsDto: InsightPageOptionsDto,
      @Param("id") insightId: number,
      @UserId() userId: number,
  ): Promise<PageDto<DbInsightMember>> {
    const insight = await this.insightsService.findOneById(insightId);
    const canAccess = await this.insightMemberService.canUserManageInsight(userId, insight.id, ["admin", "edit", "view"]);

    if (!canAccess) {
      throw new (UnauthorizedException);
    }

    return this.insightMemberService.findAllInsightMembers(pageOptionsDto, insightId);
  }

  @Post(":id/members")
  @ApiOperation({
    operationId: "addMemberForInsight",
    summary: "Adds a new member for the insight",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOkResponse({ type: DbInsightMember })
  @ApiNotFoundResponse({ description: "Unable to add insight member" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiBody({ type: CreateInsightMemberDto })
  async addInsightMember (
    @Body() createInsightMemberDto: CreateInsightMemberDto,
      @Param("id") insightId: number,
      @UserId() userId: number,
  ): Promise<DbInsightMember> {
    const insight = await this.insightsService.findOneById(insightId);
    const canUpdate = await this.insightMemberService.canUserManageInsight(userId, insight.id, ["admin", "edit"]);

    if (!canUpdate) {
      throw new (UnauthorizedException);
    }

    const newInsightMember = await this.insightMemberService.addInsightMember({
      insight_id: insightId,
      user_id: createInsightMemberDto.user_id,
      access: createInsightMemberDto.access,
    });

    return newInsightMember;
  }

  @Patch(":id/members/:memberId")
  @ApiOperation({
    operationId: "updateInsightMember",
    summary: "Updates an insight member information",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOkResponse({ type: DbInsight })
  @ApiNotFoundResponse({ description: "Unable to find insight member" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiUnprocessableEntityResponse({ description: "Unable to unable insight members" })
  @ApiBody({ type: UpdateInsightMemberDto })
  async updateInsightMember (
    @Param("id") id: number,
      @Param("memberId") memberId: string,
      @UserId() userId: number,
      @Body() updateInsightMemberDto: UpdateInsightMemberDto,
  ): Promise<DbInsightMember> {
    const insight = await this.insightsService.findOneById(id);
    const canUpdate = await this.insightMemberService.canUserManageInsight(userId, insight.id, ["admin", "edit"]);

    if (!canUpdate) {
      throw new (UnauthorizedException);
    }

    const updatedInsightMember: Partial<DbInsightMember> = { access: updateInsightMemberDto.access };

    await this.insightMemberService.updateInsightMember(memberId, updatedInsightMember);

    return this.insightMemberService.findOneById(memberId);
  }

  @Delete(":id/members/:memberId")
  @ApiOperation({
    operationId: "removeInsightMemberById",
    summary: "Removes a member from an insight",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOkResponse({ type: DbInsight })
  @ApiNotFoundResponse({ description: "Unable to remove insight member" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  async removeInsightMemberById (
    @Param("id") id: number,
      @Param("memberId") memberId: string,
      @UserId() userId: number,
  ): Promise<void> {
    const insight = await this.insightsService.findOneById(id);
    const canUpdate = await this.insightMemberService.canUserManageInsight(userId, insight.id, ["admin", "edit"]);

    if (!canUpdate) {
      throw new (UnauthorizedException);
    }

    await this.insightMemberService.removeInsightMember(memberId);
  }
}
