import { Controller, Delete, Get, Param, ParseIntPipe, Post, Query, UseGuards } from "@nestjs/common";
import {
  ApiOperation,
  ApiOkResponse,
  ApiTags,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
  ApiParam,
} from "@nestjs/swagger";

import { UserId } from "../auth/supabase.user.decorator";
import { SupabaseGuard } from "../auth/supabase.guard";
import { ApiPaginatedResponse } from "../common/decorators/api-paginated-response.decorator";
import { PageOptionsDto } from "../common/dtos/page-options.dto";
import { PageDto } from "../common/dtos/page.dto";

import { DbUserHighlight } from "../user/entities/user-highlight.entity";
import { UserHighlightsService } from "../user/user-highlights.service";
import { DbUserHighlightRepo } from "./entities/user-highlight-repo.entity";
import { DbUserHighlightReactionResponse, HighlightOptionsDto } from "./dtos/highlight-options.dto";

@Controller("highlights")
@ApiTags("Highlights service")
export class HighlightController {
  constructor(private readonly userHighlightsService: UserHighlightsService) {}

  @Get("/list")
  @ApiOperation({
    operationId: "findAllHighlights",
    summary: "Finds all highlights and paginates them",
  })
  @ApiPaginatedResponse(DbUserHighlight)
  @ApiOkResponse({ type: DbUserHighlight })
  async findAllHighlights(@Query() pageOptionsDto: HighlightOptionsDto): Promise<PageDto<DbUserHighlight>> {
    return this.userHighlightsService.findAll(pageOptionsDto);
  }

  @Get("/featured")
  @ApiOperation({
    operationId: "findAllFeaturedHighlights",
    summary: "Finds all featured highlights and paginates them",
  })
  @ApiPaginatedResponse(DbUserHighlight)
  @ApiOkResponse({ type: DbUserHighlight })
  async findAllFeaturedHighlights(@Query() pageOptionsDto: HighlightOptionsDto): Promise<PageDto<DbUserHighlight>> {
    return this.userHighlightsService.findAllFeatured(pageOptionsDto);
  }

  @Post("/:id/featured")
  @ApiOperation({
    operationId: "addAFeaturedHighlight",
    summary: "Add a highlight to the featured list",
  })
  @UseGuards(SupabaseGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: DbUserHighlight })
  @ApiNotFoundResponse({ description: "Unable to find highlight" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiParam({ name: "id", type: "integer" })
  async featureHighlight(
    @Param("id", ParseIntPipe) id: number,
    @UserId() userId: number
  ): Promise<DbUserHighlight | null> {
    return this.userHighlightsService.addFeatured(id, userId);
  }

  @Delete("/:id/featured")
  @ApiOperation({
    operationId: "removeAFeaturedHighlight",
    summary: "Remove a highlight from the featured list",
  })
  @UseGuards(SupabaseGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: DbUserHighlight })
  @ApiNotFoundResponse({ description: "Unable to find highlight" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiParam({ name: "id", type: "integer" })
  async unfeatureHighlight(
    @Param("id", ParseIntPipe) id: number,
    @UserId() userId: number
  ): Promise<DbUserHighlight | null> {
    return this.userHighlightsService.removeFeatured(id, userId);
  }

  @Get("/repos/list")
  @ApiOperation({
    operationId: "findAllHighlightRepos",
    summary: "Finds all highlight repos and paginates them",
  })
  @ApiPaginatedResponse(DbUserHighlightRepo)
  @ApiOkResponse({ type: DbUserHighlightRepo })
  async findAllHighlightRepos(@Query() pageOptionsDto: PageOptionsDto): Promise<PageDto<DbUserHighlightRepo>> {
    return this.userHighlightsService.findAllHighlightRepos(pageOptionsDto);
  }

  @Get("/:id/reactions")
  @ApiOperation({
    operationId: "getAllHighlightReactions",
    summary: "Retrieves total reactions for a highlight",
  })
  @ApiOkResponse({ type: DbUserHighlightReactionResponse })
  @ApiNotFoundResponse({ description: "Unable to get user highlight reactions" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiParam({ name: "id", type: "integer" })
  async getAllHighlightReactions(@Param("id", ParseIntPipe) id: number): Promise<DbUserHighlightReactionResponse[]> {
    return this.userHighlightsService.findAllHighlightReactions(id);
  }

  @Get("/top")
  @ApiOperation({
    operationId: "findTopHighlights",
    summary: "Finds top highlights for the day range and paginates them",
  })
  @ApiPaginatedResponse(DbUserHighlight)
  @ApiOkResponse({ type: DbUserHighlight })
  async findTopHighlights(@Query() pageOptionsDto: PageOptionsDto): Promise<PageDto<DbUserHighlight>> {
    return this.userHighlightsService.findTop(pageOptionsDto);
  }
}
