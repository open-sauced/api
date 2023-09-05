import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
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

import { UserId } from "../auth/supabase.user.decorator";
import { SupabaseGuard } from "../auth/supabase.guard";

import { CreateUserListDto } from "./dtos/create-user-list.dto";
import { DbUserList } from "./entities/user-list.entity";
import { UserListService } from "./user-list.service";

@Controller("lists")
@ApiTags("User Lists service")
export class UserListController {
  constructor(private readonly userListService: UserListService) {}

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

    const listContributors = createUserListDto.contributors.map(async (contributorId) => {
      return await this.userListService.addUserListContributor(newList.id, contributorId);
    });

    await Promise.allSettled(listContributors);

    return newList;
  }

  @Get("/:id")
  @ApiOperation({
    operationId: "getUserList",
    summary: "Retrieves an individual user list",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOkResponse({ type: DbUserList })
  @ApiNotFoundResponse({ description: "Unable to get user list" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiParam({ name: "id", type: "string" })
  async getUserList(@Param("id") id: string, @UserId() userId: number): Promise<DbUserList> {
    return this.userListService.findOneById(id, userId);
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
  async deleteListForUser(@UserId() userId: number, @Param("id", ParseIntPipe) listId: string): Promise<void> {
    const list = await this.userListService.findOneById(listId, userId);

    await this.userListService.deleteUserList(list.id);
  }
}
