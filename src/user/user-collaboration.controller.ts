import {
  Body,
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
import { ApiOperation, ApiOkResponse, ApiNotFoundResponse, ApiBearerAuth, ApiTags, ApiBadRequestResponse, ApiBody } from "@nestjs/swagger";

import { SupabaseGuard } from "../auth/supabase.guard";
import { UserId } from "../auth/supabase.user.decorator";
import { ApiPaginatedResponse } from "../common/decorators/api-paginated-response.decorator";
import { PageDto } from "../common/dtos/page.dto";

import { UserService } from "../user/user.service";
import { UserCollaborationService } from "./user-collaboration.service";
import { CreateUserCollaborationDto } from "./dtos/create-user-collaboration.dto";
import { DbUserCollaboration } from "./entities/user-collaboration.entity";
import { PageOptionsDto } from "../common/dtos/page-options.dto";
import { UpdateUserCollaborationDto } from "./dtos/update-user-collaboration.dto";

@Controller("user/collaborations")
@ApiTags("User Collaborations service")
export class UserCollaborationController {
  constructor (
    private readonly userCollaborationService: UserCollaborationService,
    private readonly userService: UserService,
  ) {}

  @Get("/")
  @ApiOperation({
    operationId: "findAllUserCollaborations",
    summary: "Listing all collaborations for the authenticated user",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiPaginatedResponse(DbUserCollaboration)
  @ApiOkResponse({ type: DbUserCollaboration })
  async findAllUserCollaborations (
    @Query() pageOptionsDto: PageOptionsDto,
      @UserId() userId: number,
  ): Promise<PageDto<DbUserCollaboration>> {
    return this.userCollaborationService.findAllUserCollaborations(pageOptionsDto, userId);
  }

  @Post("/")
  @ApiOperation({
    operationId: "addUserCollaboration",
    summary: "Adds a new collaboration request for the user",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOkResponse({ type: DbUserCollaboration })
  @ApiNotFoundResponse({ description: "Unable to add user collaboration" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiBody({ type: CreateUserCollaborationDto })
  async addUserCollaboration (
    @Body() createUserCollaborationDto: CreateUserCollaborationDto,
      @UserId() userId: number,
  ): Promise<DbUserCollaboration> {
    const user = await this.userService.findOneByUsername(createUserCollaborationDto.username);

    const newUserCollaboration = await this.userCollaborationService.addUserCollaboration({
      user_id: user.id,
      request_user_id: userId,
      message: createUserCollaborationDto.message,
      status: "pending",
    });

    return newUserCollaboration;
  }

  @Patch(":id")
  @ApiOperation({
    operationId: "updateUserCollaboration",
    summary: "Updates a user collaboration",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOkResponse({ type: DbUserCollaboration })
  @ApiNotFoundResponse({ description: "Unable to find user collaboration" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiBody({ type: UpdateUserCollaborationDto })
  async updateUserCollaboration (
    @Param("id") id: string,
      @UserId() userId: number,
      @Body() updateUserCollaborationDto: UpdateUserCollaborationDto,
  ): Promise<DbUserCollaboration> {
    const collaboration = await this.userCollaborationService.findOneById(id);

    if (collaboration.user_id !== userId) {
      throw (new UnauthorizedException);
    }

    const updatedUserCollaboration: Partial<DbUserCollaboration> = { status: updateUserCollaborationDto.status };

    await this.userCollaborationService.updateUserCollaboration(id, updatedUserCollaboration);

    return this.userCollaborationService.findOneById(id);
  }

  @Delete(":id")
  @ApiOperation({
    operationId: "removeUserCollaborationById",
    summary: "Removes the user collaboration request",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiNotFoundResponse({ description: "Unable to remove user collaboration" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  async removeUserCollaborationById (
    @Param("id") id: string,
      @UserId() userId: number,
  ): Promise<void> {
    const userCollaboration = await this.userCollaborationService.findOneById(id);

    if (userCollaboration.user_id !== userId) {
      throw new (UnauthorizedException);
    }

    await this.userCollaborationService.removeUserCollaboration(id);
  }
}
