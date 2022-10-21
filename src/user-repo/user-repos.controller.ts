import { Body, Controller, NotFoundException, Post, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiNotFoundResponse, ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { SupabaseGuard } from "../auth/supabase.guard";
import { UserId } from "../auth/supabase.user.decorator";

import { UserReposService } from "./user-repos.service";

@Controller("user")
@ApiTags("UserRepos service")
export class UserReposController {
  constructor (
    private readonly userReposService: UserReposService,
  ) {}

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
