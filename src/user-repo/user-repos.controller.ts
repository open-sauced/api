import { Body, Controller, Get, NotFoundException, Post, Query, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiNotFoundResponse, ApiBearerAuth, ApiTags, ApiOkResponse } from "@nestjs/swagger";

import { ApiPaginatedResponse } from "../common/decorators/api-paginated-response.decorator";
import { PageDto } from "../common/dtos/page.dto";
import { UserId } from "../auth/supabase.user.decorator";
import { SupabaseGuard } from "../auth/supabase.guard";

import { UserRepoOptionsDto } from "./dtos/user-repo-options.dto";
import { DbUserRepo } from "./user-repo.entity";

import { UserReposService } from "./user-repos.service";

@Controller("user")
@ApiTags("UserRepos service")
export class UserReposController {
  constructor (
    private readonly userReposService: UserReposService,
  ) {}

  @Get("/repos")
  @ApiOperation({
    operationId: "findAllReposByUserId",
    summary: "Listing all repos for the authenticated user and paginate them",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiPaginatedResponse(DbUserRepo)
  @ApiOkResponse({ type: DbUserRepo })
  @ApiNotFoundResponse({ description: "User repos not found" })
  async findAllReposByUserId (
    @Query() pageOptionsDto: UserRepoOptionsDto,
      @UserId() userId: string,
  ): Promise<PageDto<DbUserRepo>> {
    return this.userReposService.findAllByUserId(pageOptionsDto, userId);
  }

  @Post("/repos")
  @ApiOperation({
    operationId: "addReposForUser",
    summary: "Add insights repos for the authenticated user",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiNotFoundResponse({ description: "Unable to add to user repos" })
  addReposForUser (
    @UserId() userId: number,
      @Body() body: string,
  ): void {
    const data = JSON.parse(body) as { ids: number[] } | null;

    if (!data) {
      throw (new NotFoundException);
    }

    if (Array.isArray(data.ids)) {
      const repoIds = data.ids;

      repoIds.forEach(async repoId => {
        await this.userReposService.addUserRepo(userId, repoId);
      });
    }
  }
}
