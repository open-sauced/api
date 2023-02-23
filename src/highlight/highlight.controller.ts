import { Controller, Get, Query } from "@nestjs/common";
import { ApiOperation, ApiOkResponse, ApiTags } from "@nestjs/swagger";

import { ApiPaginatedResponse } from "../common/decorators/api-paginated-response.decorator";
import { PageOptionsDto } from "../common/dtos/page-options.dto";
import { HighlightOptionsDto } from "./dtos/highlight-options.dto";
import { PageDto } from "../common/dtos/page.dto";

import { DbUserHighlight } from "../user/entities/user-highlight.entity";
import { UserHighlightsService } from "../user/user-highlights.service";

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
  @ApiPaginatedResponse(DbUserHighlight)
  @ApiOkResponse({ type: DbUserHighlight })
  async findAllHighlightRepos (
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<DbUserHighlight>> {
    return this.userHighlightsService.findAllHighlightRepos(pageOptionsDto);
  }
}
