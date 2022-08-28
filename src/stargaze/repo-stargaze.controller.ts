import { Controller, Delete, Param, Put, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags
} from "@nestjs/swagger";
import { RepoService } from "../repo/repo.service";
import { StargazeService } from "./stargaze.service";
import { Repo } from "../repo/entities/repo.entity";
import { SupabaseGuard } from "../auth/supabase.guard";
import { UserId } from "../auth/supabase.user.decorator";
import { RepoToUserStargazers } from "../repo/entities/repo.to.user.stargazers.entity";

@Controller("repos")
@ApiTags("Repository service guarded", "Stargaze service")
export class RepoStargazeController {
  constructor(
    private readonly repoService: RepoService,
    private readonly stargazeService: StargazeService,
  ) {}

  @Put("/:id/stargaze")
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOperation({
    operationId: "stargazeOneById",
    summary: "Finds a repo by :id and follows",
  })
  @ApiOkResponse({
    description: "Returns the repo follow",
    type: RepoToUserStargazers
  })
  @ApiNotFoundResponse({
    description: "Repo or follow not found",
  })
  @ApiConflictResponse({
    description: "You have already followed this repo",
  })
  async stargazeOneById(
    @Param("id") id: number,
      @UserId() userId: number,
  ): Promise<RepoToUserStargazers> {
    const item = await this.repoService.findOneById(id);

    return this.stargazeService.stargazeByRepoId(item.id, userId);
  }

  @Put("/:owner/:repo/stargaze")
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOperation({
    operationId: "stargazeOneByOwnerAndRepo",
    summary: "Finds a repo by :owner and :repo and follows",
  })
  @ApiOkResponse({
    description: "Returns the repo follow",
    type: RepoToUserStargazers
  })
  @ApiNotFoundResponse({
    description: "Repo or follow not found",
  })
  @ApiConflictResponse({
    description: "You have already followed this repo",
  })
  async stargazeOneByOwnerAndRepo(
    @Param("owner") owner: string,
      @Param("repo") repo: string,
      @UserId() userId: number,
  ): Promise<RepoToUserStargazers> {
    const item = await this.repoService.findOneByOwnerAndRepo(owner, repo);

    return this.stargazeService.stargazeByRepoId(item.id, userId);
  }

  @Delete("/:id/stargaze")
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOperation({
    operationId: "downStargazeOneById",
    summary: "Finds a repo by :id and unfollows",
  })
  @ApiOkResponse({
    description: "Returns the repo follow",
    type: RepoToUserStargazers
  })
  @ApiNotFoundResponse({
    description: "Repo or follow not found",
  })
  @ApiConflictResponse({
    description: "You have already unfollowed this repo",
  })
  async downStargazeOneById(
    @Param("id") id: number,
      @UserId() userId: number,
  ): Promise<RepoToUserStargazers> {
    const item = await this.repoService.findOneById(id);

    return this.stargazeService.downStargazeByRepoId(item.id, userId);
  }

  @Delete("/:owner/:repo/stargaze")
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOperation({
    operationId: "downStargazeOneByOwnerAndRepo",
    summary: "Finds a repo by :owner and :repo and unfollows",
  })
  @ApiOkResponse({
    description: "Returns the repo follow",
    type: Repo
  })
  @ApiNotFoundResponse({
    description: "Repo or stargaze not found",
  })
  @ApiConflictResponse({
    description: "You have already unfollowed this repo",
  })
  async downStargazeOneByOwnerAndRepo(
    @Param("owner") owner: string,
      @Param("repo") repo: string,
      @UserId() userId: number,
  ): Promise<RepoToUserStargazers> {
    const item = await this.repoService.findOneByOwnerAndRepo(owner, repo);

    return this.stargazeService.downStargazeByRepoId(item.id, userId);
  }
}
