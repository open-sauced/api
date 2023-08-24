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
  ApiConflictResponse,
  OmitType,
  ApiParam,
} from "@nestjs/swagger";
import { PageDto } from "../common/dtos/page.dto";

import { SupabaseGuard } from "../auth/supabase.guard";
import { UserId } from "../auth/supabase.user.decorator";
import { DbUserHighlightReactionResponse, HighlightOptionsDto } from "../highlight/dtos/highlight-options.dto";
import { DbUserHighlightRepo } from "../highlight/entities/user-highlight-repo.entity";
import { CreateUserHighlightDto } from "./dtos/create-user-highlight.dto";
import { DbUserHighlightReaction } from "./entities/user-highlight-reaction.entity";
import { DbUserHighlight } from "./entities/user-highlight.entity";
import { UserHighlightsService } from "./user-highlights.service";

@Controller("user/highlights")
@ApiTags("User Highlights service")
export class UserHighlightsController {
  constructor(private readonly userHighlightsService: UserHighlightsService) {}

  @Post("/")
  @ApiOperation({
    operationId: "addHighlightForUser",
    summary: "Adds a new highlight for the authenticated user",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOkResponse({ type: OmitType(DbUserHighlight, ["id"]) })
  @ApiNotFoundResponse({ description: "Unable to add user highlight" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiBody({ type: CreateUserHighlightDto })
  async addInsightForUser(
    @Body() createHighlightDto: CreateUserHighlightDto,
    @UserId() userId: number
  ): Promise<DbUserHighlight> {
    return this.userHighlightsService.addUserHighlight(userId, createHighlightDto);
  }

  @Get("/:id")
  @ApiOperation({
    operationId: "getUserHighlight",
    summary: "Retrieves a highlight",
  })
  @ApiOkResponse({ type: DbUserHighlight })
  @ApiNotFoundResponse({ description: "Unable to get user highlight" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiParam({ name: "id", type: "integer" })
  async getUserHighlight(@Param("id", ParseIntPipe) id: number): Promise<DbUserHighlight> {
    return this.userHighlightsService.findOneById(id);
  }

  @Patch("/:id")
  @ApiOperation({
    operationId: "updateHighlightForUser",
    summary: "Updates the highlight for the authenticated user",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOkResponse({ type: DbUserHighlight })
  @ApiNotFoundResponse({ description: "Unable to update user highlight" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiBody({ type: CreateUserHighlightDto })
  @ApiParam({ name: "id", type: "integer" })
  async updateHighlightForUser(
    @Body() updateHighlightDto: CreateUserHighlightDto,
    @UserId() userId: number,
    @Param("id", ParseIntPipe) highlightId: number
  ): Promise<DbUserHighlight> {
    const highlight = await this.userHighlightsService.findOneById(highlightId, userId);

    await this.userHighlightsService.updateUserHighlight(highlight.id, {
      ...updateHighlightDto,
      shipped_at: updateHighlightDto.shipped_at ? new Date(updateHighlightDto.shipped_at) : highlight.created_at,
    });

    return this.userHighlightsService.findOneById(highlight.id, userId);
  }

  @Delete("/:id")
  @ApiOperation({
    operationId: "deleteHighlightForUser",
    summary: "Deletes the highlight for the authenticated user",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiNotFoundResponse({ description: "Unable to delete user highlight" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiParam({ name: "id", type: "integer" })
  async deleteHighlightForUser(
    @UserId() userId: number,
    @Param("id", ParseIntPipe) highlightId: number
  ): Promise<void> {
    const highlight = await this.userHighlightsService.findOneById(highlightId, userId);

    await this.userHighlightsService.deleteUserHighlight(highlight.id);
  }

  @Get("/:id/reactions")
  @ApiOperation({
    operationId: "getAllHighlightUserReactions",
    summary: "Retrieves a highlight reactions for the authenticated user",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOkResponse({ type: DbUserHighlightReactionResponse })
  @ApiNotFoundResponse({ description: "Unable to get user highlight reactions" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiParam({ name: "id", type: "integer" })
  async getAllHighlightUserReactions(
    @Param("id", ParseIntPipe) id: number,
    @UserId() userId: number
  ): Promise<DbUserHighlightReactionResponse[]> {
    return this.userHighlightsService.findAllHighlightReactions(id, userId);
  }

  @Post("/:id/reactions/:emojiId")
  @ApiOperation({
    operationId: "addHighlightReactionForUser",
    summary: "Adds a new highlight reaction for the authenticated user",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOkResponse({ type: DbUserHighlightReaction })
  @ApiNotFoundResponse({ description: "Highlight does not exist" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiConflictResponse({ description: "Unable to add user highlight reaction" })
  @ApiParam({ name: "id", type: "integer" })
  async addHighlightReactionForUser(
    @Param("id", ParseIntPipe) highlightId: number,
    @Param("emojiId") emojiId: string,
    @UserId() userId: number
  ): Promise<void> {
    const highlight = await this.userHighlightsService.findOneById(highlightId);

    if (Number(highlight.user_id) === userId) {
      throw new ConflictException("You cannot react to your own highlight");
    }

    await this.userHighlightsService.addUserHighlightReaction(userId, highlightId, emojiId, highlight.user_id);
  }

  @Delete("/:id/reactions/:emojiId")
  @ApiOperation({
    operationId: "deleteHighlightReactionForUser",
    summary: "Deletes the highlight reaction for the authenticated user",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiNotFoundResponse({ description: "Unable to delete user highlight reaction" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiParam({ name: "id", type: "integer" })
  async deleteHighlightReactionForUser(
    @UserId() userId: number,
    @Param("id", ParseIntPipe) highlightId: number,
    @Param("emojiId") emojiId: string
  ): Promise<void> {
    const userHighlightReaction = await this.userHighlightsService.findOneUserHighlightReaction(
      highlightId,
      userId,
      emojiId
    );

    await this.userHighlightsService.deleteUserHighlightReaction(userHighlightReaction.id);
  }

  @Get("/following")
  @ApiOperation({
    operationId: "getFollowingHighlights",
    summary: "Fetches highlights for users the authenticated user follows",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOkResponse({ type: DbUserHighlight })
  async getFollowingHighlights(
    @Query() pageOptionsDto: HighlightOptionsDto,
    @UserId() userId: number
  ): Promise<PageDto<DbUserHighlight>> {
    return this.userHighlightsService.findAll(pageOptionsDto, userId);
  }

  @Get("/following/repos")
  @ApiOperation({
    operationId: "getFollowingHighlightRepos",
    summary: "Fetches highlight repos for users the authenticated user follows",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOkResponse({ type: DbUserHighlightRepo })
  @ApiBadRequestResponse({ description: "Invalid request" })
  async getFollowingHighlightRepos(
    @Query() pageOptionsDto: HighlightOptionsDto,
    @UserId() userId: number
  ): Promise<PageDto<DbUserHighlightRepo>> {
    return this.userHighlightsService.findAllHighlightRepos(pageOptionsDto, userId);
  }
}
