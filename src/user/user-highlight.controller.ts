import { Body, ConflictException, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiOkResponse, ApiNotFoundResponse, ApiBearerAuth, ApiTags, ApiBadRequestResponse, ApiBody, ApiConflictResponse } from "@nestjs/swagger";

import { SupabaseGuard } from "../auth/supabase.guard";
import { UserId } from "../auth/supabase.user.decorator";
import { CreateUserHighlightDto } from "./dtos/create-user-highlight.dto";
import { DbUserHighlightReaction } from "./entities/user-highlight-reaction.entity";
import { DbUserHighlight } from "./entities/user-highlight.entity";
import { UserHighlightsService } from "./user-highlights.service";

@Controller("user/highlights")
@ApiTags("User Highlights service")
export class UserHighlightsController {
  constructor (
    private readonly userHighlightsService: UserHighlightsService,
  ) {}

  @Post("/")
  @ApiOperation({
    operationId: "addHighlightForUser",
    summary: "Adds a new highlight for the authenticated user",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOkResponse({ type: DbUserHighlight })
  @ApiNotFoundResponse({ description: "Unable to add user highlight" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiBody({ type: CreateUserHighlightDto })
  async addInsightForUser (
    @Body() createHighlightDto: CreateUserHighlightDto,
      @UserId() userId: number,
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
  async getUserHighlight (
    @Param("id") id: number,
  ): Promise<DbUserHighlight> {
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
  async updateHighlightForUser (
    @Body() updateHighlightDto: CreateUserHighlightDto,
      @UserId() userId: number,
      @Param("id") highlightId: number,
  ): Promise<DbUserHighlight> {
    await this.userHighlightsService.findOneById(highlightId, userId);

    await this.userHighlightsService.updateUserHighlight(highlightId, updateHighlightDto);

    return this.userHighlightsService.findOneById(highlightId, userId);
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
  async deleteHighlightForUser (
    @UserId() userId: number,
      @Param("id") highlightId: number,
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
  @ApiOkResponse({ type: DbUserHighlightReaction })
  @ApiNotFoundResponse({ description: "Unable to get user highlight reactions" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  async getAllHighlightUserReactions (
    @Param("id") id: number,
      @UserId() userId: number,
  ): Promise<DbUserHighlightReaction[]> {
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
  async addHighlightReactionForUser (
    @Param("id") highlightId: number,
      @Param("emojiId") emojiId: number,
      @UserId() userId: number,
  ): Promise<void> {
    const highlight = await this.userHighlightsService.findOneById(highlightId);

    if (Number(highlight.user_id) === userId) {
      throw new ConflictException("You cannot react to your own highlight");
    }

    await this.userHighlightsService.addUserHighlightReaction(userId, highlightId, emojiId);
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
  async deleteHighlightReactionForUser (
    @UserId() userId: number,
      @Param("id") highlightId: number,
      @Param("emojiId") emojiId: number,
  ): Promise<void> {
    const userHighlightReaction = await this.userHighlightsService.findOneUserHighlightReaction(highlightId, userId, emojiId);

    await this.userHighlightsService.deleteUserHighlightReaction(userHighlightReaction.id);
  }
}
