import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiBearerAuth, ApiTags, ApiOkResponse } from "@nestjs/swagger";

import { SupabaseGuard } from "../auth/supabase.guard";
import { UserId } from "../auth/supabase.user.decorator";

import { RepoService } from "../repo/repo.service";
import { UserService } from "./services/user.service";

@Controller("user/recommendations")
@ApiTags("User Recommendations service")
export class UserRecommendationController {
  constructor(private readonly repoService: RepoService, private readonly userService: UserService) {}

  @Get("/repos")
  @ApiOperation({
    operationId: "findUserRepoRecommendations",
    summary: "Listing recommended repos for the authenticated user",
  })
  @ApiBearerAuth()
  @ApiOkResponse()
  @UseGuards(SupabaseGuard)
  async findUserRepoRecommendations(@UserId() userId: number) {
    const user = await this.userService.findOneById(userId);
    const interests = user.interests?.split(",").filter(Boolean) ?? [];

    return this.repoService.findRecommendations(interests);
  }
}
