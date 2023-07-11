import { Controller, Delete, Get, Param, ParseIntPipe, Post, Query, UseGuards } from "@nestjs/common";
import {
  ApiOperation,
  ApiOkResponse,
  ApiTags,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";

import { UserId } from "../auth/supabase.user.decorator";
import { SupabaseGuard } from "../auth/supabase.guard";
import { ApiPaginatedResponse } from "../common/decorators/api-paginated-response.decorator";
import { PageOptionsDto } from "../common/dtos/page-options.dto";
import { DbUserHighlightReactionResponse, HighlightOptionsDto } from "./dtos/highlight-options.dto";
import { PageDto } from "../common/dtos/page.dto";

import { DbUserHighlight } from "../user/entities/user-highlight.entity";
import { DbUserHighlightRepo } from "./entities/user-highlight-repo.entity";
import { UserHighlightsService } from "../user/user-highlights.service";
import { UserService } from "../user/user.service";
// import { DbUser } from "../user/user.entity";

import { DbTopUser } from "../user/entities/top-users.entity";

@Controller("highlights")
@ApiTags("Highlights service")
export class HighlightController {
  constructor(
    private readonly userHighlightsService: UserHighlightsService,
    private readonly userService: UserService
  ) {}

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

  @Get("/top-10-users")
  @ApiOperation({
    operationId: "getTop10Highlights",
    summary: "Finds the top 10 users",
  })
  @ApiOkResponse({ type: DbTopUser })
  async getTop10Highlights(): Promise<DbTopUser[]> {
    return this.userService.findTopTenUsers();
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
  async getAllHighlightReactions(@Param("id", ParseIntPipe) id: number): Promise<DbUserHighlightReactionResponse[]> {
    return this.userHighlightsService.findAllHighlightReactions(id);
  }
}
