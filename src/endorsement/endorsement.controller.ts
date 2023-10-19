import { Controller, Get, Post, Body, Param, Delete, Query, UseGuards, Headers } from "@nestjs/common";
import { ApiBody, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

import { PageOptionsDto } from "../common/dtos/page-options.dto";
import { ApiPaginatedResponse } from "../common/decorators/api-paginated-response.decorator";
import { UserService } from "../user/services/user.service";

import { EndorsementService } from "./endorsement.service";
import { CreateEndorsementDto } from "./dto/create-endorsement.dto";
import { DbEndorsement } from "./entities/endorsement.entity";
import { EndorsementTokenGuard } from "./endorsement-token.guard";

@Controller("endorsements")
@ApiTags("Endorsements service")
export class EndorsementController {
  constructor(private readonly endorsementService: EndorsementService, private readonly userService: UserService) {}

  @Post("/")
  @UseGuards(EndorsementTokenGuard)
  @ApiOperation({
    operationId: "createEndorsement",
    summary: "Creates a new endorsement record",
  })
  @ApiOkResponse({ type: DbEndorsement })
  @ApiBody({ type: CreateEndorsementDto })
  async createEndorsement(
    @Headers("X-OpenSauced-token") _token: string,
    @Body() createEndorsementDto: CreateEndorsementDto
  ) {
    return this.endorsementService.create(createEndorsementDto);
  }

  @Get("/")
  @ApiOperation({
    operationId: "findAllEndorsements",
    summary: "Finds all endorsements and paginates them",
  })
  @ApiPaginatedResponse(DbEndorsement)
  @ApiOkResponse({ type: DbEndorsement })
  async findAllEndorsements(@Query() pageOptionsDto: PageOptionsDto) {
    return this.endorsementService.findAll(pageOptionsDto);
  }

  @Get("/repos/:repoOwnerOrUser")
  @ApiOperation({
    operationId: "findAllByRepoOwnerOrUsername",
    summary: "Finds all endorsements by repo org or username and paginates them",
  })
  @ApiPaginatedResponse(DbEndorsement)
  @ApiOkResponse({ type: DbEndorsement })
  async findAllByRepoOwnerOrUsername(
    @Param("repoOwnerOrUser") repoOwnerOrUser: string,
    @Query() pageOptionsDto: PageOptionsDto
  ) {
    return this.endorsementService.findAllByRepoOwnerOrUser(repoOwnerOrUser, pageOptionsDto);
  }

  @Get("/repos/:owner/:repo")
  @ApiOperation({
    operationId: "findAllEndorsementsByRepo",
    summary: "Finds all endorsements by repo owner or username and paginates them",
  })
  @ApiPaginatedResponse(DbEndorsement)
  @ApiOkResponse({ type: DbEndorsement })
  async findAllEndorsementsByRepo(
    @Param("owner") owner: string,
    @Param("repo") repo: string,
    @Query() pageOptionsDto: PageOptionsDto
  ) {
    return this.endorsementService.findAllEndorsementsByRepo(owner, repo, pageOptionsDto);
  }

  /*
   * @Get("/repos/:owner/:repo/byUser")
   * @ApiOperation({
   *   operationId: "findAllEndorsementsByRepoByUser",
   *   summary: "Finds all endorsements by repo owner grouped by user",
   * })
   * @ApiOkResponse({ type: DbEndorsement })
   * async findAllEndorsementsByRepoByUser (
   * @Param("owner") owner: string,
   *   @Param("repo") repo: string,
   *   @Query() pageOptionsDto: PageOptionsDto,
   * ) {
   *   return this.endorsementService.findAllEndorsementsByRepoByUser(owner, repo, pageOptionsDto);
   * }
   */

  @Get(":id")
  @ApiOperation({
    operationId: "findEndorsementById",
    summary: "Retrieves the endorsement based on ID",
  })
  @ApiOkResponse({ type: DbEndorsement })
  @ApiNotFoundResponse({ description: "Endorsement not found" })
  async findEndorsementById(@Param("id") id: string) {
    return this.endorsementService.findOneById(id);
  }

  @Get("/user/:username/created")
  @ApiOperation({
    operationId: "findAllUserCreatedEndorsementsByUsername",
    summary: "Finds all endorsements received by the user and paginates them",
  })
  @ApiPaginatedResponse(DbEndorsement)
  @ApiOkResponse({ type: DbEndorsement })
  async findAllUserCreatedEndorsementsByUsername(
    @Param("username") username: string,
    @Query() pageOptionsDto: PageOptionsDto
  ) {
    const user = await this.userService.findOneByUsername(username);

    return this.endorsementService.findAllByCreatorUserId(user.id, pageOptionsDto);
  }

  @Get("/user/:username/received")
  @ApiOperation({
    operationId: "findAllUserReceivedEndorsementsByUsername",
    summary: "Finds all endorsements received by the user and paginates them",
  })
  @ApiPaginatedResponse(DbEndorsement)
  @ApiOkResponse({ type: DbEndorsement })
  async findAllUserReceivedEndorsementsByUsername(
    @Param("username") username: string,
    @Query() pageOptionsDto: PageOptionsDto
  ) {
    const user = await this.userService.findOneByUsername(username);

    return this.endorsementService.findAllByRecipientUserId(user.id, pageOptionsDto);
  }

  @Delete(":id")
  @ApiOperation({
    operationId: "deleteEndoresementById",
    summary: "Finds ands deletes the endorsement by ID",
  })
  @ApiNotFoundResponse({ description: "Endorsement not found" })
  async deleteEndoresementById(@Param("id") id: string) {
    return this.endorsementService.remove(id);
  }
}
