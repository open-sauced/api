import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Repository, SelectQueryBuilder } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { PageMetaDto } from "../common/dtos/page-meta.dto";
import { PageDto } from "../common/dtos/page.dto";
import { PageOptionsDto } from "../common/dtos/page-options.dto";
import { RepoService } from "../repo/repo.service";
import { DbRepo } from "../repo/entities/repo.entity";
import { RepoSearchOptionsDto } from "../repo/dtos/repo-search-options.dto";
import { DbWorkspaceRepo } from "./entities/workspace-repos.entity";
import { DbWorkspace } from "./entities/workspace.entity";
import { WorkspaceService } from "./workspace.service";
import { canUserEditWorkspace, canUserViewWorkspace } from "./common/memberAccess";
import { UpdateWorkspaceReposDto } from "./dtos/update-workspace-repos.dto";
import { DeleteWorkspaceReposDto } from "./dtos/delete-workspace-repos.dto";

@Injectable()
export class WorkspaceReposService {
  constructor(
    @InjectRepository(DbWorkspaceRepo, "ApiConnection")
    private workspaceRepoRepository: Repository<DbWorkspaceRepo>,
    private workspaceService: WorkspaceService,
    private repoService: RepoService
  ) {}

  baseQueryBuilder(): SelectQueryBuilder<DbWorkspaceRepo> {
    const builder = this.workspaceRepoRepository.createQueryBuilder("workspace_repos");

    return builder;
  }

  async findAllReposByWorkspaceIdForUserId(
    pageOptionsDto: PageOptionsDto,
    id: string,
    userId: number | undefined
  ): Promise<PageDto<DbWorkspaceRepo>> {
    const workspace = await this.workspaceService.findOneById(id);

    /*
     * viewers, editors, and owners can see what repos belongs to a workspace
     */

    const canView = canUserViewWorkspace(workspace, userId);

    if (!canView) {
      throw new NotFoundException();
    }

    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .withDeleted()
      .leftJoinAndSelect(
        "workspace_repos.repo",
        "workspace_repos_repo",
        "workspace_repos.repo_id = workspace_repos_repo.id"
      )
      .where("workspace_repos.deleted_at IS NULL")
      .andWhere("workspace_repos.workspace_id = :id", { id })
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.limit);

    const itemCount = await queryBuilder.getCount();
    const entities = await queryBuilder.getMany();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async findAllReposByFilterInWorkspace(
    pageOptionsDto: RepoSearchOptionsDto,
    id: string,
    userId: number | undefined
  ): Promise<PageDto<DbRepo>> {
    const workspace = await this.workspaceService.findOneById(id);

    /*
     * viewers, editors, and owners can see what repos belongs to a workspace
     */

    const canView = canUserViewWorkspace(workspace, userId);

    if (!canView) {
      throw new NotFoundException();
    }

    return this.repoService.findAllWithFiltersInWorkspace(pageOptionsDto, id);
  }

  async addOneWorkspaceRepo(id: string, owner: string, repo: string, userId: number): Promise<DbWorkspace> {
    const workspace = await this.workspaceService.findOneById(id);

    /*
     * owners and editors can update the workspace repos
     */

    const canUpdate = canUserEditWorkspace(workspace, userId);

    if (!canUpdate) {
      throw new UnauthorizedException();
    }

    await this.executeAddWorkspaceRepo(workspace, owner, repo);

    return this.workspaceService.findOneById(id);
  }

  async addWorkspaceRepos(dto: UpdateWorkspaceReposDto, id: string, userId: number): Promise<DbWorkspace> {
    const workspace = await this.workspaceService.findOneById(id);

    /*
     * owners and editors can update the workspace repos
     */

    const canUpdate = canUserEditWorkspace(workspace, userId);

    if (!canUpdate) {
      throw new UnauthorizedException();
    }

    const promises = dto.repos.map(async (dtoRepo) => {
      const parts = dtoRepo.full_name.split("/");

      if (parts.length !== 2) {
        throw new NotFoundException("invalid repo input: must be of form 'owner/name'");
      }

      await this.executeAddWorkspaceRepo(workspace, parts[0], parts[1]);
    });

    await Promise.all(promises);
    return this.workspaceService.findOneById(id);
  }

  private async executeAddWorkspaceRepo(workspace: DbWorkspace, ownerName: string, repoName: string) {
    const repo = await this.repoService.tryFindRepoOrMakeStub(undefined, ownerName, repoName);

    const existingWorkspaceRepo = await this.workspaceRepoRepository.findOne({
      where: {
        workspace_id: workspace.id,
        repo_id: repo.id,
      },
      withDeleted: true,
    });

    if (existingWorkspaceRepo) {
      await this.workspaceRepoRepository.restore(existingWorkspaceRepo.id);
    } else {
      const newWorkspaceRepo = new DbWorkspaceRepo();

      newWorkspaceRepo.workspace = workspace;
      newWorkspaceRepo.repo = repo;

      await this.workspaceRepoRepository.save(newWorkspaceRepo);
    }
  }

  async deleteOneWorkspaceRepo(id: string, owner: string, repo: string, userId: number) {
    const workspace = await this.workspaceService.findOneById(id);

    /*
     * owners and editors can delete the workspace repos
     */

    const canDelete = canUserEditWorkspace(workspace, userId);

    if (!canDelete) {
      throw new UnauthorizedException();
    }

    const existingRepo = await this.repoService.findOneByOwnerAndRepo(owner, repo);
    const existingWorkspaceRepo = await this.workspaceRepoRepository.findOne({
      where: {
        workspace_id: id,
        repo_id: existingRepo.id,
      },
    });

    if (!existingWorkspaceRepo) {
      throw new NotFoundException();
    }

    await this.workspaceRepoRepository.softDelete(existingWorkspaceRepo.id);

    return this.workspaceService.findOneById(id);
  }

  async deleteWorkspaceRepos(dto: DeleteWorkspaceReposDto, id: string, userId: number) {
    const workspace = await this.workspaceService.findOneById(id);

    /*
     * owners and editors can delete the workspace repos
     */

    const canDelete = canUserEditWorkspace(workspace, userId);

    if (!canDelete) {
      throw new UnauthorizedException();
    }

    const promises = dto.repos.map(async (dtoRepo) => {
      const parts = dtoRepo.full_name.split("/");

      if (parts.length !== 2) {
        throw new NotFoundException("invalid repo input: must be of form 'owner/name'");
      }

      const repo = await this.repoService.findOneByOwnerAndRepo(parts[0], parts[1]);
      const existingWorkspaceRepo = await this.workspaceRepoRepository.findOne({
        where: {
          workspace_id: id,
          repo_id: repo.id,
        },
      });

      if (!existingWorkspaceRepo) {
        throw new NotFoundException();
      }

      return this.workspaceRepoRepository.softDelete(existingWorkspaceRepo.id);
    });

    try {
      await Promise.all(promises);
    } catch (error) {
      dto.repos.forEach(async (dtoRepo) => {
        // restore the members who may have been soft deleted
        const parts = dtoRepo.full_name.split("/");

        // if there is malformed input, this will have already been caught in the promises catch
        if (parts.length === 2) {
          const repo = await this.repoService.findOneByOwnerAndRepo(parts[0], parts[1]);

          const existingRepo = await this.workspaceRepoRepository.findOne({
            where: {
              workspace_id: id,
              repo_id: repo.id,
            },
            withDeleted: true,
          });

          if (existingRepo) {
            await this.workspaceRepoRepository.restore(existingRepo.id);
          }
        }
      });

      // throws the original error
      throw error;
    }

    return this.workspaceService.findOneById(id);
  }
}
