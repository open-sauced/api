import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import {
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
  ApiTags,
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
} from "@nestjs/swagger";
import { SupabaseAuthUser } from "nestjs-supabase-auth";

import { SupabaseGuard } from "../auth/supabase.guard";
import { User, UserId } from "../auth/supabase.user.decorator";
import { ApiPaginatedResponse } from "../common/decorators/api-paginated-response.decorator";
import { PageDto } from "../common/dtos/page.dto";

import { PageOptionsDto } from "../common/dtos/page-options.dto";
import { UserService } from "./services/user.service";
import { UserConnectionService } from "./user-connection.service";
import { CreateUserConnectionDto } from "./dtos/create-user-connection.dto";
import { DbUserConnection } from "./entities/user-connection.entity";
import { UpdateUserConnectionDto } from "./dtos/update-user-connection.dto";

@Controller("user/connections")
@ApiTags("User Connections service")
export class UserConnectionController {
  constructor(
    private readonly userConnectionService: UserConnectionService,
    private readonly userService: UserService
  ) {}

  @Get("/")
  @ApiOperation({
    operationId: "findAllUserConnections",
    summary: "Listing all connections for the authenticated user",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiPaginatedResponse(DbUserConnection)
  @ApiOkResponse({ type: DbUserConnection })
  async findAllUserConnections(
    @Query() pageOptionsDto: PageOptionsDto,
    @UserId() userId: number
  ): Promise<PageDto<DbUserConnection>> {
    return this.userConnectionService.findAllUserConnections(pageOptionsDto, userId);
  }

  @Post("/")
  @ApiOperation({
    operationId: "addUserConnection",
    summary: "Adds a new connection request for the user",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOkResponse({ type: DbUserConnection })
  @ApiNotFoundResponse({ description: "Unable to add user connection" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiConflictResponse({ description: "The requested user is not accepting connection requests" })
  @ApiBody({ type: CreateUserConnectionDto })
  async addUserConnection(
    @Body() createUserConnectionDto: CreateUserConnectionDto,
    @User() user: SupabaseAuthUser
  ): Promise<DbUserConnection> {
    const recipient = await this.userService.findOneByUsername(createUserConnectionDto.username);
    const requester = await this.userService.findOneById(user.user_metadata.sub as number);

    if (requester.role < 50) {
      throw new UnauthorizedException("You're not authorized to perform this action");
    }

    if (!recipient.receive_connection) {
      throw new ConflictException();
    }

    const newUserConnection = await this.userConnectionService.addUserConnection({
      user_id: recipient.id,
      request_user_id: requester.id,
      message: createUserConnectionDto.message,
      status: "pending",
    });

    return newUserConnection;
  }

  @Patch(":id")
  @ApiOperation({
    operationId: "updateUserConnection",
    summary: "Updates a user connection",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOkResponse({ type: DbUserConnection })
  @ApiNotFoundResponse({ description: "Unable to find user connection" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiBody({ type: UpdateUserConnectionDto })
  async updateUserConnection(
    @Param("id") id: string,
    @UserId() userId: number,
    @Body() updateUserConnectionDto: UpdateUserConnectionDto
  ): Promise<DbUserConnection> {
    const connection = await this.userConnectionService.findOneById(id);

    if (connection.user_id !== userId) {
      throw new UnauthorizedException();
    }

    const updatedUserConnection: Partial<DbUserConnection> = { status: updateUserConnectionDto.status };

    await this.userConnectionService.updateUserConnection(id, updatedUserConnection);

    return this.userConnectionService.findOneById(id);
  }

  @Delete(":id")
  @ApiOperation({
    operationId: "removeUserConnectionById",
    summary: "Removes the user connection request",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiNotFoundResponse({ description: "Unable to remove user connection" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  async removeUserConnectionById(@Param("id") id: string, @UserId() userId: number): Promise<void> {
    const userConnection = await this.userConnectionService.findOneById(id);

    if (userConnection.user_id !== userId) {
      throw new UnauthorizedException();
    }

    await this.userConnectionService.removeUserConnection(id);
  }
}
