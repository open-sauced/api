import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

import { ApiPaginatedResponse } from "../common/decorators/api-paginated-response.decorator";
import { PageDto } from "../common/dtos/page.dto";
import { PageOptionsDto } from "../common/dtos/page-options.dto";
import { DbPullRequest } from "../pull-requests/entities/pull-request.entity";
import { PullRequestService } from "../pull-requests/pull-request.service";

import { DbUser } from "./user.entity";
import { UserService } from "./user.service";


@Controller("users")
@ApiTags("User service")
export class UserController {
  constructor (
    private userService: UserService,
    private pullRequestService: PullRequestService,
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

  @Get("/:username/prs")
  @ApiOperation({
    operationId: "findContributorPullRequests",
    summary: "Finds pull requests by :username",
  })
  @ApiPaginatedResponse(DbPullRequest)
  @ApiOkResponse({ type: DbPullRequest })
  @ApiNotFoundResponse({ description: "User not found" })
  async findContributorPullRequests (
    @Param("username") username: string,
      @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<DbPullRequest>> {
    return this.pullRequestService.findAllByContributor(username, pageOptionsDto);
  }
}
