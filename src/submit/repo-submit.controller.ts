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
import { SubmitService } from "./submit.service";
import { SupabaseGuard } from "../auth/supabase.guard";
import { UserId } from "../auth/supabase.user.decorator";
import { DbRepoToUserSubmissions } from "../repo/entities/repo.to.user.submissions.entity";

@Controller("repos")
@ApiTags("Repository service guarded", "Submit service")
export class RepoSubmitController {
  constructor(
    private readonly repoService: RepoService,
    private readonly submitService: SubmitService,
  ) {}

  @Put("/:id/submit")
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOperation({
    operationId: "submitOneById",
    summary: "Finds a repo by :id and adds a submission",
  })
  @ApiOkResponse({
    description: "Returns the repo submission",
    type: DbRepoToUserSubmissions
  })
  @ApiNotFoundResponse({
    description: "Repo or submission not found",
  })
  @ApiConflictResponse({
    description: "You have already submitted this repo",
  })
  async submitOneById(
    @Param("id") id: number,
      @UserId() userId: number,
  ): Promise<DbRepoToUserSubmissions> {
    const item = await this.repoService.findOneById(id);

    return this.submitService.submitByRepoId(item.id, userId);
  }

  @Put("/:owner/:repo/submit")
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOperation({
    operationId: "submitOneByOwnerAndRepo",
    summary: "Finds a repo by :owner and :repo and adds a submission",
  })
  @ApiOkResponse({
    description: "Returns the repo submission",
    type: DbRepoToUserSubmissions
  })
  @ApiNotFoundResponse({
    description: "Repo or submission not found",
  })
  @ApiConflictResponse({
    description: "You have already submitted this repo",
  })
  async submitOneByOwnerAndRepo(
    @Param("owner") owner: string,
      @Param("repo") repo: string,
      @UserId() userId: number,
  ): Promise<DbRepoToUserSubmissions> {
    const item = await this.repoService.findOneByOwnerAndRepo(owner, repo);

    return this.submitService.submitByRepoId(item.id, userId);
  }

  @Delete("/:id/submit")
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOperation({
    operationId: "downSubmitOneById",
    summary: "Finds a repo by :id and removes existing submission",
  })
  @ApiOkResponse({
    description: "Returns the repo submission",
    type: DbRepoToUserSubmissions
  })
  @ApiNotFoundResponse({
    description: "Repo or submission not found",
  })
  @ApiConflictResponse({
    description: "You have already removed your submission",
  })
  async downSubmitOneById(
    @Param("id") id: number,
      @UserId() userId: number,
  ): Promise<DbRepoToUserSubmissions> {
    const item = await this.repoService.findOneById(id);

    return this.submitService.downSubmitByRepoId(item.id, userId);
  }

  @Delete("/:owner/:repo/submit")
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOperation({
    operationId: "downSubmitOneByOwnerAndRepo",
    summary: "Finds a repo by :owner and :repo and removes existing submission",
  })
  @ApiOkResponse({
    description: "Returns the repo submission",
    type: DbRepoToUserSubmissions
  })
  @ApiNotFoundResponse({
    description: "Repo or submission not found",
  })
  @ApiConflictResponse({
    description: "You have already removed your submission",
  })
  async downSubmitOneByOwnerAndRepo(
    @Param("owner") owner: string,
      @Param("repo") repo: string,
      @UserId() userId: number,
  ): Promise<DbRepoToUserSubmissions> {
    const item = await this.repoService.findOneByOwnerAndRepo(owner, repo);

    return this.submitService.downSubmitByRepoId(item.id, userId);
  }
}
