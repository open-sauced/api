import { Controller, Delete, Get, Param, ParseIntPipe, Put, Query, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";

import { RepoService } from "../repo/repo.service";
import { SupabaseGuard } from "../auth/supabase.guard";
import { UserId } from "../auth/supabase.user.decorator";
import { DbRepoToUserVotes } from "../repo/entities/repo.to.user.votes.entity";
import { ApiPaginatedResponse } from "../common/decorators/api-paginated-response.decorator";
import { DbRepo } from "../repo/entities/repo.entity";
import { RepoPageOptionsDto } from "../repo/dtos/repo-page-options.dto";
import { PageDto } from "../common/dtos/page.dto";
import { VotedRepoDto } from "./../user-repo/dtos/user-repos.dto";
import { VoteService } from "./vote.service";

@Controller("repos")
@ApiTags("Repository service guarded", "Vote service")
export class RepoVoteController {
  constructor(private readonly repoService: RepoService, private readonly voteService: VoteService) {}

  @Get("/listUserVoted")
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOperation({
    operationId: "findAllUserVoted",
    summary: "Finds all repos voted by authenticated user and paginates them",
  })
  @ApiPaginatedResponse(DbRepo)
  @ApiOkResponse({ type: DbRepo })
  async findAllUserVoted(
    @Query() pageOptionsDto: RepoPageOptionsDto,
    @UserId() userId: number
  ): Promise<PageDto<DbRepo>> {
    return this.repoService.findAll(pageOptionsDto, userId, ["Votes"]);
  }

  @Get("/:repoId/vote")
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOperation({
    operationId: "findOneByRepoId",
    summary: "Finds a repo by :repoId and returns if authenticated user has voted for it",
  })
  @ApiOkResponse({
    type: VotedRepoDto,
    description: "Returns if authenticated user has voted for it",
  })
  @ApiParam({ name: "repoId", type: "integer" })
  async findOneByRepoId(@Param("repoId", ParseIntPipe) repoId: number, @UserId() userId: number) {
    return this.voteService.findOneByRepoId(repoId, userId);
  }

  @Put("/:id/vote")
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOperation({
    operationId: "voteOneById",
    summary: "Finds a repo by :id and adds a vote",
  })
  @ApiOkResponse({
    description: "Returns the repo vote",
    type: DbRepoToUserVotes,
  })
  @ApiNotFoundResponse({ description: "Repo or vote not found" })
  @ApiConflictResponse({ description: "You have already voted for this repo" })
  @ApiParam({ name: "id", type: "integer" })
  async voteOneById(@Param("id", ParseIntPipe) id: number, @UserId() userId: number): Promise<DbRepoToUserVotes> {
    const item = await this.repoService.findOneById(id);

    return this.voteService.voteByRepoId(item.id, userId);
  }

  @Put("/:owner/:repo/vote")
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOperation({
    operationId: "voteOneByOwnerAndRepo",
    summary: "Finds a repo by :owner and :repo and adds a vote",
  })
  @ApiOkResponse({
    description: "Returns the repo vote",
    type: DbRepoToUserVotes,
  })
  @ApiNotFoundResponse({ description: "Repo or vote not found" })
  @ApiConflictResponse({ description: "You have already voted for this repo" })
  async voteOneByOwnerAndRepo(
    @Param("owner") owner: string,
    @Param("repo") repo: string,
    @UserId() userId: number
  ): Promise<DbRepoToUserVotes> {
    const item = await this.repoService.findOneByOwnerAndRepo(owner, repo);

    return this.voteService.voteByRepoId(item.id, userId);
  }

  @Delete("/:id/vote")
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOperation({
    operationId: "downVoteOneById",
    summary: "Finds a repo by :id and removes existing vote",
  })
  @ApiOkResponse({
    description: "Returns the repo vote",
    type: DbRepoToUserVotes,
  })
  @ApiNotFoundResponse({ description: "Repo or vote not found" })
  @ApiConflictResponse({ description: "You have already removed your vote" })
  @ApiParam({ name: "id", type: "integer" })
  async downVoteOneById(@Param("id", ParseIntPipe) id: number, @UserId() userId: number): Promise<DbRepoToUserVotes> {
    const item = await this.repoService.findOneById(id);

    return this.voteService.downVoteByRepoId(item.id, userId);
  }

  @Delete("/:owner/:repo/vote")
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOperation({
    operationId: "downVoteOneByOwnerAndRepo",
    summary: "Finds a repo by :owner and :repo and removes existing vote",
  })
  @ApiOkResponse({
    description: "Returns the repo vote",
    type: DbRepoToUserVotes,
  })
  @ApiNotFoundResponse({ description: "Repo or vote not found" })
  @ApiConflictResponse({ description: "You have already removed your vote" })
  async downVoteOneByOwnerAndRepo(
    @Param("owner") owner: string,
    @Param("repo") repo: string,
    @UserId() userId: number
  ): Promise<DbRepoToUserVotes> {
    const item = await this.repoService.findOneByOwnerAndRepo(owner, repo);

    return this.voteService.downVoteByRepoId(item.id, userId);
  }
}
