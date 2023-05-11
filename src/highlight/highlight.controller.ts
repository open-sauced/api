import { Controller, Get, Param, ParseIntPipe, Query } from "@nestjs/common";
import { ApiOperation, ApiOkResponse, ApiTags, ApiBadRequestResponse, ApiNotFoundResponse } from "@nestjs/swagger";

import { ApiPaginatedResponse } from "../common/decorators/api-paginated-response.decorator";
import { PageOptionsDto } from "../common/dtos/page-options.dto";
import { HighlightOptionsDto } from "./dtos/highlight-options.dto";
import { PageDto } from "../common/dtos/page.dto";

import { DbUserHighlight } from "../user/entities/user-highlight.entity";
import { DbUserHighlightRepo } from "./entities/user-highlight-repo.entity";
import { UserHighlightsService } from "../user/user-highlights.service";
import { DbUserHighlightReaction } from "../user/entities/user-highlight-reaction.entity";

@Controller("highlights")
@ApiTags("Highlights service")
export class HighlightController {
  constructor (
    private readonly userHighlightsService: UserHighlightsService,
  ) {}

  @Get("/list")
  @ApiOperation({
    operationId: "findAllHighlights",
    summary: "Finds all highlights and paginates them",
  })
  @ApiPaginatedResponse(DbUserHighlight)
  @ApiOkResponse({ type: DbUserHighlight })
  async findAllHighlights (
    @Query() pageOptionsDto: HighlightOptionsDto,
  ): Promise<PageDto<DbUserHighlight>> {
    return this.userHighlightsService.findAll(pageOptionsDto);
  }

  @Get("/repos/list")
  @ApiOperation({
    operationId: "findAllHighlightRepos",
    summary: "Finds all highlight repos and paginates them",
  })
  @ApiPaginatedResponse(DbUserHighlightRepo)
  @ApiOkResponse({ type: DbUserHighlightRepo })
  async findAllHighlightRepos (
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<DbUserHighlightRepo>> {
    return this.userHighlightsService.findAllHighlightRepos(pageOptionsDto);
  }

  @Get("/:id/reactions")
  @ApiOperation({
    operationId: "getAllHighlightReactions",
    summary: "Retrieves total reactions for a highlight",
  })
  @ApiOkResponse({ type: DbUserHighlightReaction })
  @ApiNotFoundResponse({ description: "Unable to get user highlight reactions" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  async getAllHighlightReactions (
    @Param("id", ParseIntPipe) id: number,
  ): Promise<DbUserHighlightReaction[]> {
    return this.userHighlightsService.findAllHighlightReactions(id);
  }
}
