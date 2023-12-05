import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, ValidationPipe } from "@nestjs/common";
import {
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
  ApiTags,
  ApiBadRequestResponse,
  ApiBody,
  ApiParam,
} from "@nestjs/swagger";

import { DbUserHighlightRepo } from "../highlight/entities/user-highlight-repo.entity";
import { DbUserHighlight } from "../user/entities/user-highlight.entity";
import { DbUser } from "../user/user.entity";
import { PageOptionsDto } from "../common/dtos/page-options.dto";
import { ApiPaginatedResponse } from "../common/decorators/api-paginated-response.decorator";
import { PageDto } from "../common/dtos/page.dto";
import { UserId } from "../auth/supabase.user.decorator";
import { SupabaseGuard } from "../auth/supabase.guard";

import { HighlightOptionsDto } from "../highlight/dtos/highlight-options.dto";
import { CreateUserListDto } from "./dtos/create-user-list.dto";
import { DbUserList } from "./entities/user-list.entity";
import { UserListService } from "./user-list.service";
import { DbUserListContributor } from "./entities/user-list-contributor.entity";
import { CollaboratorsDto } from "./dtos/collaborators.dto";
import { FilterListContributorsDto } from "./dtos/filter-contributors.dto";
import { DbTimezone } from "./entities/timezones.entity";

@Controller("lists")
@ApiTags("User Lists service")
export class UserListController {
  constructor(private readonly userListService: UserListService) {}

  @Get("/")
  @ApiOperation({
    operationId: "getListsForUser",
    summary: "Gets lists for the authenticated user",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOkResponse({ type: DbUserList })
  @ApiNotFoundResponse({ description: "Unable to get user lists" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  async getListsForUser(
    @UserId() userId: number,
    @Query() pageOptionsDto: PageOptionsDto
  ): Promise<PageDto<DbUserList>> {
    return this.userListService.findAllByUserId(pageOptionsDto, userId);
  }

  @Post("/")
  @ApiOperation({
    operationId: "addListForUser",
    summary: "Adds a new list for the authenticated user",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOkResponse({ type: DbUserList })
  @ApiNotFoundResponse({ description: "Unable to add user list" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiBody({ type: CreateUserListDto })
  async addListForUser(@Body() createUserListDto: CreateUserListDto, @UserId() userId: number): Promise<DbUserList> {
    const newList = await this.userListService.addUserList(userId, createUserListDto);

    const listContributors = createUserListDto.contributors.map(async (contributor) =>
      this.userListService.addUserListContributor(newList.id, contributor.id, contributor.login)
    );

    await Promise.allSettled(listContributors);

    return newList;
  }

  @Get("/:id")
  @ApiOperation({
    operationId: "getUserList",
    summary: "Retrieves an individual user list",
  })
  @ApiOkResponse({ type: DbUserList })
  @ApiNotFoundResponse({ description: "Unable to get user list" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiParam({ name: "id", type: "string" })
  async getUserList(@Param("id") id: string): Promise<DbUserList> {
    return this.userListService.findPublicOneById(id);
  }

  @Patch("/:id")
  @ApiOperation({
    operationId: "updateListForUser",
    summary: "Updates the list for the authenticated user",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOkResponse({ type: DbUserList })
  @ApiNotFoundResponse({ description: "Unable to update user list" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiBody({ type: CreateUserListDto })
  @ApiParam({ name: "id", type: "string" })
  async updateListForUser(
    @Body() updateListDto: CreateUserListDto,
    @UserId() userId: number,
    @Param("id") listId: string
  ): Promise<DbUserList> {
    const list = await this.userListService.findOneById(listId, userId);

    await this.userListService.updateUserList(list.id, {
      name: updateListDto.name,
      is_public: updateListDto.is_public,
    });

    return this.userListService.findOneById(list.id, userId);
  }

  @Delete("/:id")
  @ApiOperation({
    operationId: "deleteListForUser",
    summary: "Deletes the list for the authenticated user",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiNotFoundResponse({ description: "Unable to delete user list" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiParam({ name: "id", type: "string" })
  async deleteListForUser(@UserId() userId: number, @Param("id") listId: string): Promise<void> {
    const list = await this.userListService.findOneById(listId, userId);

    await this.userListService.deleteUserList(list.id);
  }

  @Get("/contributors")
  @ApiOperation({
    operationId: "getContributors",
    summary: "Retrieves paginated contributors",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiPaginatedResponse(DbUser)
  @ApiOkResponse({ type: DbUser })
  @ApiNotFoundResponse({ description: "Unable to get contributors" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  async getContributors(
    @Query(new ValidationPipe({ transform: true, forbidUnknownValues: true })) pageOptionsDto: FilterListContributorsDto
  ): Promise<PageDto<DbUser>> {
    return this.userListService.findContributorsByFilter(pageOptionsDto);
  }

  @Get("/:id/contributors")
  @ApiOperation({
    operationId: "getUserListContributors",
    summary: "Retrieves contributors for an individual user list",
  })
  @ApiPaginatedResponse(DbUserListContributor)
  @ApiOkResponse({ type: DbUserListContributor })
  @ApiNotFoundResponse({ description: "Unable to get user list contributors" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiParam({ name: "id", type: "string" })
  async getUserListContributors(
    @Query() pageOptionsDto: FilterListContributorsDto,
    @Param("id") id: string
  ): Promise<PageDto<DbUserListContributor>> {
    return this.userListService.findContributorsByListId(pageOptionsDto, id);
  }

  @Post("/:id/contributors")
  @ApiOperation({
    operationId: "postUserListContributors",
    summary: "Add new contributors to an individual user list",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiNotFoundResponse({ description: "Unable to add to user list contributors" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiParam({ name: "id", type: "string" })
  async postUserListContributors(
    @Body() updateCollaboratorsDto: CollaboratorsDto,
    @Param("id") id: string
  ): Promise<DbUserListContributor[]> {
    const contributors = updateCollaboratorsDto.contributors.map(async (contributorId) =>
      this.userListService.addUserListContributor(id, contributorId)
    );

    return Promise.all(contributors);
  }

  @Delete("/:id/contributors/:userListContributorId")
  @ApiOperation({
    operationId: "deleteUserListContributor",
    summary: "Delete contributor from an individual user list",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiNotFoundResponse({ description: "Unable to delete user from user list contributors" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiParam({ name: "id", type: "string" })
  @ApiParam({ name: "userListContributorId", type: "integer" })
  async deleteUserListContributors(
    @Param("id") id: string,
    @Param("userListContributorId") userListContributorId: string
  ): Promise<void> {
    await this.userListService.deleteUserListContributor(id, userListContributorId);
  }

  @Get("/:id/contributors/highlights")
  @ApiOperation({
    operationId: "getUserListContributorHighlights",
    summary: "Retrieves highlights for contributors for an individual user list",
  })
  @ApiPaginatedResponse(DbUserHighlight)
  @ApiOkResponse({ type: DbUserHighlight })
  @ApiNotFoundResponse({ description: "Unable to get user list contributor highlights" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiParam({ name: "id", type: "string" })
  async getUserListContributorHighlights(
    @Query() pageOptionsDto: HighlightOptionsDto,
    @Param("id") id: string
  ): Promise<PageDto<DbUserHighlight>> {
    return this.userListService.findListContributorsHighlights(pageOptionsDto, id);
  }

  @Get("/:id/contributors/highlighted-repos")
  @ApiOperation({
    operationId: "getUserListContributorHighlightedRepos",
    summary: "Retrieves highlighted repos for contributors for an individual user list",
  })
  @ApiPaginatedResponse(DbUserHighlightRepo)
  @ApiOkResponse({ type: DbUserHighlightRepo })
  @ApiNotFoundResponse({ description: "Unable to get user list contributor highlights" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiParam({ name: "id", type: "string" })
  async getUserListContributorHighlightedRepos(
    @Query() pageOptionsDto: PageOptionsDto,
    @Param("id") id: string
  ): Promise<PageDto<DbUserHighlightRepo>> {
    return this.userListService.findListContributorsHighlightedRepos(pageOptionsDto, id);
  }

  @Get("/timezones")
  @ApiOperation({
    operationId: "getTimezones",
    summary: "Retrieves all users timezones",
  })
  @ApiOkResponse({ type: DbTimezone })
  @ApiNotFoundResponse({ description: "Unable to get timezones" })
  async getTimezones(): Promise<DbTimezone[]> {
    return this.userListService.getAllTimezones();
  }
}
