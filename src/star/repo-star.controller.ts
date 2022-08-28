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
import { StarService } from "./star.service";
import { Repo } from "../repo/entities/repo.entity";
import { SupabaseGuard } from "../auth/supabase.guard";
import { UserId } from "../auth/supabase.user.decorator";
import { RepoToUserStars } from "../repo/entities/repo.to.user.stars.entity";

@Controller("repos")
@ApiTags("Repository service guarded", "Star service")
export class RepoStarController {
  constructor(
    private readonly repoService: RepoService,
    private readonly starService: StarService,
  ) {}

  @Put("/:id/star")
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOperation({
    operationId: "starOneById",
    summary: "Finds a repo by :id and adds a star",
  })
  @ApiOkResponse({
    description: "Returns the repo star",
    type: RepoToUserStars
  })
  @ApiNotFoundResponse({
    description: "Repo or star not found",
  })
  @ApiConflictResponse({
    description: "You have already starred this repo",
  })
  async starOneById(
    @Param("id") id: number,
      @UserId() userId: number,
  ): Promise<RepoToUserStars> {
    const item = await this.repoService.findOneById(id);

    return this.starService.starByRepoId(item.id, userId);
  }

  @Put("/:owner/:repo/star")
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOperation({
    operationId: "starOneByOwnerAndRepo",
    summary: "Finds a repo by :owner and :repo and adds a star",
  })
  @ApiOkResponse({
    description: "Returns the repo star",
    type: Repo
  })
  @ApiNotFoundResponse({
    description: "Repo or star not found",
  })
  @ApiConflictResponse({
    description: "You have already starred this repo",
  })
  async starOneByOwnerAndRepo(
    @Param("owner") owner: string,
      @Param("repo") repo: string,
      @UserId() userId: number,
  ): Promise<RepoToUserStars> {
    const item = await this.repoService.findOneByOwnerAndRepo(owner, repo);

    return this.starService.starByRepoId(item.id, userId);
  }

  @Delete("/:id/star")
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOperation({
    operationId: "downStarOneById",
    summary: "Finds a repo by :id and removes existing star",
  })
  @ApiOkResponse({
    description: "Returns the repo star",
    type: RepoToUserStars
  })
  @ApiNotFoundResponse({
    description: "Repo or star not found",
  })
  @ApiConflictResponse({
    description: "You have already removed your star",
  })
  async downStarOneById(
    @Param("id") id: number,
      @UserId() userId: number,
  ): Promise<RepoToUserStars> {
    const item = await this.repoService.findOneById(id);

    return this.starService.downStarByRepoId(item.id, userId);
  }

  @Delete("/:owner/:repo/star")
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOperation({
    operationId: "downStarOneByOwnerAndRepo",
    summary: "Finds a repo by :owner and :repo and removes existing star",
  })
  @ApiOkResponse({
    description: "Returns the repo star",
    type: Repo
  })
  @ApiNotFoundResponse({
    description: "Repo or star not found",
  })
  @ApiConflictResponse({
    description: "You have already removed your star",
  })
  async downStarOneByOwnerAndRepo(
    @Param("owner") owner: string,
      @Param("repo") repo: string,
      @UserId() userId: number,
  ): Promise<RepoToUserStars> {
    const item = await this.repoService.findOneByOwnerAndRepo(owner, repo);

    return this.starService.downStarByRepoId(item.id, userId);
  }
}
