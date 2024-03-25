import { Controller, Get, Header, Param, Query } from "@nestjs/common";
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

import { PageOptionsDto } from "../common/dtos/page-options.dto";
import { PageDto } from "../common/dtos/page.dto";
import { ApiPaginatedResponse } from "../common/decorators/api-paginated-response.decorator";
import { RepoService } from "../repo/repo.service";
import { DbRepo } from "../repo/entities/repo.entity";
import { DbPullRequestGitHubEvents } from "../timescale/entities/pull_request_github_event.entity";
import { PullRequestGithubEventsService } from "../timescale/pull_request_github_events.service";
import { DbUserHighlight } from "./entities/user-highlight.entity";
import { UserHighlightsService } from "./user-highlights.service";
import { DbUser } from "./user.entity";
import { UserService } from "./services/user.service";
import { DbTopUser } from "./entities/top-users.entity";
import { TopUsersDto } from "./dtos/top-users.dto";
import { DbFilteredUser } from "./entities/filtered-users.entity";
import { FilteredUsersDto } from "./dtos/filtered-users.dto";
import { DbUserOrganization } from "./entities/user-organization.entity";
import { UserOrganizationService } from "./user-organization.service";

@Controller("users")
@ApiTags("User service")
export class UserController {
  constructor(
    private userService: UserService,
    private pullRequestGitHubEventsService: PullRequestGithubEventsService,
    private userHighlightsService: UserHighlightsService,
    private repoService: RepoService,
    private userOrganizationService: UserOrganizationService
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
    operationId: "findContributorPullRequestGitHubEvents",
    summary: "Finds pull requests by :username",
  })
  @ApiPaginatedResponse(DbPullRequestGitHubEvents)
  @ApiOkResponse({ type: DbPullRequestGitHubEvents })
  @ApiNotFoundResponse({ description: "User not found" })
  @Header("Cache-Control", "public, max-age=600")
  async findContributorPullRequestGitHubEvents(
    @Param("username") username: string,
    @Query() pageOptionsDto: PageOptionsDto
  ): Promise<PageDto<DbPullRequestGitHubEvents>> {
    return this.pullRequestGitHubEventsService.findAllByPrAuthor(username, pageOptionsDto);
  }

  @Get("/:username/highlights")
  @ApiOperation({
    operationId: "findAllHighlightsByUsername",
    summary: "Listing all Highlights for a user and paginate them",
  })
  @ApiPaginatedResponse(DbUserHighlight)
  @ApiOkResponse({ type: DbUserHighlight })
  @ApiNotFoundResponse({ description: "Highlights not found" })
  @Header("Cache-Control", "public, max-age=600")
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
  @Header("Cache-Control", "public, max-age=600")
  async findAllTopReposByUsername(
    @Param("username") username: string,
    @Query() pageOptionsDto: PageOptionsDto
  ): Promise<PageDto<DbRepo>> {
    const user = await this.userService.findOneByUsername(username);

    return this.repoService.findAll(pageOptionsDto, user.id, ["TopRepos"]);
  }

  @Get("/:username/organizations")
  @ApiOperation({
    operationId: "findAllOrgsByUsername",
    summary: "Listing public orgs for a user and paginate them",
  })
  @ApiPaginatedResponse(DbUserOrganization)
  @ApiOkResponse({ type: DbUserOrganization })
  @ApiNotFoundResponse({ description: "Top repos not found" })
  @Header("Cache-Control", "public, max-age=600")
  async findAllOrgsByUsername(
    @Param("username") username: string,
    @Query() pageOptionsDto: PageOptionsDto
  ): Promise<PageDto<DbUserOrganization>> {
    const user = await this.userService.findOneByUsername(username);

    return this.userOrganizationService.findAllByUserId(user.id, pageOptionsDto);
  }

  @Get("/top")
  @ApiOperation({
    operationId: "getTop10Highlights",
    summary: "List top users",
  })
  @ApiOkResponse({ type: DbTopUser })
  @Header("Cache-Control", "public, max-age=600")
  async getTopUsers(@Query() pageOptionsDto: TopUsersDto): Promise<PageDto<DbTopUser>> {
    return this.userService.findTopUsers(pageOptionsDto);
  }

  @Get("/search")
  @ApiOperation({
    operationId: "getUsersByFilter",
    summary: "Search users",
  })
  @ApiOkResponse({ type: DbFilteredUser })
  @ApiBadRequestResponse({ description: "Username is required" })
  async getUsersByFilter(@Query() pageOptionsDto: FilteredUsersDto): Promise<PageDto<DbFilteredUser>> {
    return this.userService.findUsersByFilter(pageOptionsDto);
  }
}
