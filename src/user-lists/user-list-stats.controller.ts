import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import {
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
  ApiTags,
  ApiBadRequestResponse,
  ApiParam,
} from "@nestjs/swagger";

import { PageDto } from "../common/dtos/page.dto";
import { SupabaseGuard } from "../auth/supabase.guard";

import { DbUserList } from "./entities/user-list.entity";
import { UserListMostActiveContributorsDto } from "./dtos/most-active-contributors.dto";
import { DbUserListContributorStat } from "./entities/user-list-contributor-stats.entity";
import { UserListStatsService } from "./user-list-stat.service";

@Controller("lists")
@ApiTags("User Lists service")
export class UserListStatsController {
  constructor(private readonly userListStatsService: UserListStatsService) {}

  @Get(":id/stats/most-active-contributors")
  @ApiOperation({
    operationId: "getMostActiveContributors",
    summary: "Gets most active contributors for a given list",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOkResponse({ type: DbUserList })
  @ApiNotFoundResponse({ description: "Unable to get user lists" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiParam({ name: "id", type: "string" })
  async getMostActiveContributors(
    @Param("id") id: string,
    @Query() pageOptionsDto: UserListMostActiveContributorsDto
  ): Promise<PageDto<DbUserListContributorStat>> {
    return this.userListStatsService.findContributorStatsByListId(pageOptionsDto, id);
  }
}
