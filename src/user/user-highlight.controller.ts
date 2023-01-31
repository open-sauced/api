import { Body, Controller, Delete, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiOkResponse, ApiNotFoundResponse, ApiBearerAuth, ApiTags, ApiBadRequestResponse, ApiBody } from "@nestjs/swagger";

import { SupabaseGuard } from "../auth/supabase.guard";
import { UserId } from "../auth/supabase.user.decorator";
import { CreateUserHighlightDto } from "./dtos/create-user-highlight.dto";
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
}
