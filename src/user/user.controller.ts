import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

import { PageOptionsDto } from "../common/dtos/page-options.dto";
import { PageDto } from "../common/dtos/page.dto";
import { ApiPaginatedResponse } from "../common/decorators/api-paginated-response.decorator";
import { DbUserHighlight } from "./entities/user-highlight.entity";
import { UserHighlightsService } from "./user-highlights.service";
import { DbUser } from "./user.entity";
import { UserService } from "./user.service";

@Controller("users")
@ApiTags("User service")
export class UserController {
  constructor (
    private userService: UserService,
    private userHighlightsService: UserHighlightsService,
  ) {}

  @Get("/:username")
  @ApiOperation({
    operationId: "findOneUserByUserame",
    summary: "Finds a user by :username",
  })
  @ApiOkResponse({ type: DbUser })
  @ApiNotFoundResponse({ description: "User not found" })
  async findOneUserById (
    @Param("username") username: string,
  ): Promise<DbUser> {
    return this.userService.findOneByUsername(username);
  }

  @Get("/:username/highlights")
  @ApiOperation({
    operationId: "findAllHighlightsByUsername",
    summary: "Listing all Highlights for a user and paginate them",
  })
  @ApiPaginatedResponse(DbUserHighlight)
  @ApiOkResponse({ type: DbUserHighlight })
  @ApiNotFoundResponse({ description: "Highlights not found" })
  async findAllHighlightsByUsername (
    @Param("username") username: string,
      @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<DbUserHighlight>> {
    const user = await this.userService.findOneByUsername(username);

    return this.userHighlightsService.findAllByUserId(pageOptionsDto, user.id);
  }
}
