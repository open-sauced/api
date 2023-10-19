import { Controller, Delete, Get, Param, Put, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";

import { SupabaseGuard } from "../auth/supabase.guard";
import { UserId } from "../auth/supabase.user.decorator";
import { DbUserToUserFollows } from "./entities/user-follows.entity";
import { UserFollowService } from "./user-follow.service";
import { UserService } from "./services/user.service";

@Controller("users")
@ApiTags("User service")
export class UserFollowsController {
  constructor(private readonly userService: UserService, private readonly userFollowService: UserFollowService) {}

  @Get("/:username/follow")
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOperation({
    operationId: "getFollowStatusByUsername",
    summary: "Checks if the authenticated user follows the provided username",
  })
  @ApiNotFoundResponse({ description: "User follow not found" })
  async getFollowStatusByUsername(
    @Param("username") username: string,
    @UserId() userId: number
  ): Promise<DbUserToUserFollows> {
    const user = await this.userService.findOneByUsername(username);

    return this.userFollowService.findUserFollowerById(userId, user.id);
  }

  @Put("/:username/follow")
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOperation({
    operationId: "followUserById",
    summary: "Follows a user by username",
  })
  @ApiNotFoundResponse({ description: "User not found" })
  @ApiConflictResponse({ description: "You have already followed this user" })
  async followUserByUsername(
    @Param("username") username: string,
    @UserId() userId: number
  ): Promise<DbUserToUserFollows> {
    const user = await this.userService.findOneByUsername(username);

    return this.userFollowService.addUserFollowerByUserId(userId, user.id);
  }

  @Delete("/:username/follow")
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOperation({
    operationId: "unfollowUserByUsername",
    summary: "Unfollows a user by username",
  })
  @ApiOkResponse({
    description: "Returns the user follow",
    type: DbUserToUserFollows,
  })
  @ApiNotFoundResponse({ description: "User not found" })
  @ApiConflictResponse({ description: "You are now following this user" })
  async unfollowUserByUserId(
    @Param("username") username: string,
    @UserId() userId: number
  ): Promise<DbUserToUserFollows> {
    const user = await this.userService.findOneByUsername(username);

    return this.userFollowService.removeUserFollowerById(userId, user.id);
  }
}
