import { Controller, Get, Query } from "@nestjs/common";
import { ApiOperation, ApiOkResponse, ApiNotFoundResponse, ApiTags } from "@nestjs/swagger";

import { ApiPaginatedResponse } from "../common/decorators/api-paginated-response.decorator";
import { PageOptionsDto } from "../common/dtos/page-options.dto";

import { EmojiService } from "./emoji.service";
import { DbEmoji } from "./entities/emoji.entity";

@Controller("emojis")
@ApiTags("Emojis service")
export class EmojiController {
  constructor (
    private emojiService: EmojiService,
  ) {}

  @Get("/")
  @ApiOperation({
    operationId: "findAllInsightsByUserId",
    summary: "Listing all insights for a user and paginate them",
  })
  @ApiPaginatedResponse(DbEmoji)
  @ApiOkResponse({ type: DbEmoji })
  @ApiNotFoundResponse({ description: "Emojis not found" })
  async findAllEmojis (
  @Query() pageOptionsDto: PageOptionsDto,
  ) {
    return this.emojiService.findAll(pageOptionsDto);
  }
}
