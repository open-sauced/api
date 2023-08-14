import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

import { PageOptionsDto } from "../common/dtos/page-options.dto";
import { PageDto } from "../common/dtos/page.dto";
import { ApiPaginatedResponse } from "../common/decorators/api-paginated-response.decorator";
import { PullRequestService } from "../pull-requests/pull-request.service";
import { DbPullRequest } from "../pull-requests/entities/pull-request.entity";
import { RepoService } from "../repo/repo.service";
import { DbRepo } from "../repo/entities/repo.entity";
import { DbUserHighlight } from "./entities/user-highlight.entity";
import { UserHighlightsService } from "./user-highlights.service";
import { DbUser } from "./user.entity";
import { UserService } from "./services/user.service";
import { DbTopUser } from "./entities/top-users.entity";
import { TopUsersDto } from "./dtos/top-users.dto";

@Controller("users")
@ApiTags("User service")
export class UserController {
  constructor(
    private userService: UserService,
    private pullRequestService: PullRequestService,
    private userHighlightsService: UserHighlightsService,
    private repoService: RepoService
  ) {}

  @Get("/:username")
  @ApiOperation({
    operationId: "findOneUserByUserame",
    summary: "Finds a user by :username",
  })
  @ApiOkResponse({ type: DbUser })
  @ApiNotFoundResponse({ description: "User not found" })
  async findOneUserById(@Param("username") username: string): Promise<DbUser> {
    return this.userService.findOneByUsername(username);
  }

  @Get("/:username/prs")
  @ApiOperation({
    operationId: "findContributorPullRequests",
    summary: "Finds pull requests by :username",
  })
  @ApiPaginatedResponse(DbPullRequest)
  @ApiOkResponse({ type: DbPullRequest })
  @ApiNotFoundResponse({ description: "User not found" })
  async findContributorPullRequests(
    @Param("username") username: string,
    @Query() pageOptionsDto: PageOptionsDto
  ): Promise<PageDto<DbPullRequest>> {
    return this.pullRequestService.findAllByContributor(username, pageOptionsDto);
  }

  @Get("/:username/highlights")
  @ApiOperation({
    operationId: "findAllHighlightsByUsername",
    summary: "Listing all Highlights for a user and paginate them",
  })
  @ApiPaginatedResponse(DbUserHighlight)
  @ApiOkResponse({ type: DbUserHighlight })
  @ApiNotFoundResponse({ description: "Highlights not found" })
  async findAllHighlightsByUsername(
    @Param("username") username: string,
    @Query() pageOptionsDto: PageOptionsDto
  ): Promise<PageDto<DbUserHighlight>> {
    const user = await this.userService.findOneByUsername(username);

    return this.userHighlightsService.findAllByUserId(pageOptionsDto, user.id);
  }

  @Get("/:username/top-repos")
  @ApiOperation({
    operationId: "findAllTopReposByUsername",
    summary: "Listing all Top Repos for a user and paginate them",
  })
  @ApiPaginatedResponse(DbRepo)
  @ApiOkResponse({ type: DbRepo })
  @ApiNotFoundResponse({ description: "Top repos not found" })
  async findAllTopReposByUsername(
    @Param("username") username: string,
    @Query() pageOptionsDto: PageOptionsDto
  ): Promise<PageDto<DbRepo>> {
    const user = await this.userService.findOneByUsername(username);

    return this.repoService.findAll(pageOptionsDto, user.id, ["TopRepos"]);
  }

  @Get("/top")
  @ApiOperation({
    operationId: "getTop10Highlights",
    summary: "List top users",
  })
  @ApiOkResponse({ type: DbTopUser })
  async getTopUsers(@Query() pageOptionsDto: TopUsersDto): Promise<PageDto<DbTopUser>> {
    return this.userService.findTopUsers(pageOptionsDto);
  }
}
