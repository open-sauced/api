import { Controller, Get, Header, Query, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiBearerAuth, ApiTags, ApiOkResponse } from "@nestjs/swagger";

import { SupabaseGuard } from "../auth/supabase.guard";
import { UserId } from "../auth/supabase.user.decorator";

import { RepoService } from "../repo/repo.service";
import { PageOptionsDto } from "../common/dtos/page-options.dto";
import { ApiPaginatedResponse } from "../common/decorators/api-paginated-response.decorator";
import { DbRepo } from "../repo/entities/repo.entity";
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
  @ApiPaginatedResponse(DbRepo)
  @ApiOkResponse({ type: DbRepo })
  @UseGuards(SupabaseGuard)
  @Header("Cache-Control", "private, max-age=600")
  async findUserRepoRecommendations(@UserId() userId: number) {
    const user = await this.userService.findOneById(userId);
    const interests = user.interests?.split(",").filter(Boolean) ?? [];

    return this.repoService.findRecommendations(interests);
  }

  @Get("/orgs")
  @ApiOperation({
    operationId: "findUserOrgsRepoRecommendations",
    summary: "Listing recommended repos for the authenticated user based on their orgs",
  })
  @ApiBearerAuth()
  @ApiPaginatedResponse(DbRepo)
  @ApiOkResponse({ type: DbRepo })
  @UseGuards(SupabaseGuard)
  @Header("Cache-Control", "private, max-age=600")
  async findUserOrgsRepoRecommendations(@UserId() userId: number, @Query() pageOptionsDto: PageOptionsDto) {
    return this.repoService.findOrgsRecommendations(userId, pageOptionsDto);
  }
}
