import { Controller, Get, Param } from "@nestjs/common";
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

import { DbUser } from "./user.entity";
import { UserService } from "./user.service";

@Controller("users")
@ApiTags("User service")
export class UserController {
  constructor (private userService: UserService) {}

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
}
