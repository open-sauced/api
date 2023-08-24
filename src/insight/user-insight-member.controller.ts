import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UnauthorizedException,
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
import { UserService } from "../user/services/user.service";
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
  constructor(
    private readonly insightsService: InsightsService,
    private readonly insightMemberService: InsightMemberService,
    private userService: UserService
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
  @ApiParam({ name: "id", type: "integer" })
  async findAllInsightsByUserId(
    @Query() pageOptionsDto: InsightPageOptionsDto,
    @Param("id", ParseIntPipe) insightId: number,
    @UserId() userId: number
  ): Promise<PageDto<DbInsightMember>> {
    const insight = await this.insightsService.findOneById(insightId);
    const canAccess = await this.insightMemberService.canUserManageInsight(userId, insight.id, [
      "admin",
      "edit",
      "view",
    ]);

    if (!canAccess) {
      throw new UnauthorizedException();
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
  @ApiParam({ name: "id", type: "integer" })
  async addInsightMember(
    @Body() createInsightMemberDto: CreateInsightMemberDto,
    @Param("id", ParseIntPipe) insightId: number,
    @UserId() userId: number
  ): Promise<DbInsightMember> {
    const insight = await this.insightsService.findOneById(insightId);
    const canUpdate = await this.insightMemberService.canUserManageInsight(userId, insight.id, ["admin", "edit"]);

    if (!canUpdate) {
      throw new UnauthorizedException();
    }

    const isMember = await this.insightMemberService.canUserManageInsight(
      userId,
      insight.id,
      ["admin", "edit", "view"],
      false
    );

    if (isMember) {
      throw new ConflictException("The user is already a team member of this insight");
    }

    const existingUser = await this.userService.findOneByEmail(createInsightMemberDto.email);

    const newInsightMember = await this.insightMemberService.addInsightMember({
      insight_id: insightId,
      user_id: existingUser?.id,
      invitation_email: existingUser?.email ?? createInsightMemberDto.email,
      access: "pending",
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
  @ApiUnprocessableEntityResponse({ description: "Unable to unable insight member" })
  @ApiBody({ type: UpdateInsightMemberDto })
  @ApiParam({ name: "id", type: "integer" })
  async updateInsightMember(
    @Param("id", ParseIntPipe) id: number,
    @Param("memberId") memberId: string,
    @UserId() userId: number,
    @Body() updateInsightMemberDto: UpdateInsightMemberDto
  ): Promise<DbInsightMember> {
    const insight = await this.insightsService.findOneById(id);
    const canUpdate = await this.insightMemberService.canUserManageInsight(userId, insight.id, ["admin", "edit"]);
    const insightMember = await this.insightMemberService.findOneById(memberId);

    if (!canUpdate && insightMember.access !== "pending") {
      throw new UnauthorizedException();
    }

    const updatedInsightMember: Partial<DbInsightMember> = { access: updateInsightMemberDto.access };

    if (insightMember.access === "pending") {
      // the user is accepting the invitation, update the user_id
      updatedInsightMember.user_id = userId;
      updatedInsightMember.access = "view";
    }

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
  @ApiParam({ name: "id", type: "integer" })
  async removeInsightMemberById(
    @Param("id", ParseIntPipe) id: number,
    @Param("memberId") memberId: string,
    @UserId() userId: number
  ): Promise<void> {
    const insight = await this.insightsService.findOneById(id);
    const canUpdate = await this.insightMemberService.canUserManageInsight(userId, insight.id, ["admin", "edit"]);

    if (!canUpdate) {
      throw new UnauthorizedException();
    }

    await this.insightMemberService.removeInsightMember(memberId);
  }
}
