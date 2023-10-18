import { Controller, Get, Param } from "@nestjs/common";
import { ApiNotFoundResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { UserService } from "./services/user.service";
import { DbUser } from "./user.entity";
import { UserFollowingService } from "./user-following.service";
import { DbUserToUserFollows } from "./entities/user-follows.entity";

@Controller("users")
@ApiTags("User service")
export class UserFollowingController {
  constructor(private readonly userService: UserService, private readonly userFollowingService: UserFollowingService) {}

  @Get("/:username/following")
  @ApiOperation({
    operationId: "getFollowingListByUsername",
    summary: "Get list of following users by the provided username",
  })
  @ApiNotFoundResponse({ description: "User not found" })
  async getFollowingListByUsername(@Param("username") username: string): Promise<DbUserToUserFollows[]> {
    const user: DbUser = await this.userService.findOneByUsername(username);

    return this.userFollowingService.findAllFollowingList(user.id);
  }
}
