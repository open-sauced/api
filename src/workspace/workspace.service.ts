import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Repository, SelectQueryBuilder } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { PageOptionsDto } from "../common/dtos/page-options.dto";
import { PageDto } from "../common/dtos/page.dto";
import { PagerService } from "../common/services/pager.service";
import { RepoService } from "../repo/repo.service";
import { DbWorkspaceMember, WorkspaceMemberRoleEnum } from "./entities/workspace-member.entity";
import { DbWorkspace } from "./entities/workspace.entity";
import { CreateWorkspaceDto } from "./dtos/create-workspace.dto";
import { UpdateWorkspaceDto } from "./dtos/update-workspace.dto";
import { canUserManageWorkspace } from "./common/memberAccess";
import { DbWorkspaceRepo } from "./entities/workspace-repos.entity";

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectRepository(DbWorkspaceMember, "ApiConnection")
    @InjectRepository(DbWorkspace, "ApiConnection")
    private workspaceRepository: Repository<DbWorkspace>,
    @InjectRepository(DbWorkspaceRepo, "ApiConnection")
    private workspaceRepoRepository: Repository<DbWorkspaceRepo>,
    private pagerService: PagerService,
    private repoService: RepoService
  ) {}

  baseQueryBuilder(): SelectQueryBuilder<DbWorkspace> {
    const builder = this.workspaceRepository.createQueryBuilder("workspaces");

    return builder;
  }

  async findOneById(id: string): Promise<DbWorkspace> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .leftJoinAndSelect(`workspaces.members`, `workspace_members`, `workspaces.id=workspace_members.workspace_id`)
      .where("workspaces.id = :id", { id });

    const item: DbWorkspace | null = await queryBuilder.getOne();

    if (!item) {
      throw new NotFoundException();
    }

    return item;
  }

  async findOneByIdGuarded(id: string, userId: number): Promise<DbWorkspace> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .leftJoinAndSelect(`workspaces.members`, `workspace_members`, `workspaces.id=workspace_members.workspace_id`)
      .where("workspaces.id = :id", { id });

    const item: DbWorkspace | null = await queryBuilder.getOne();

    if (!item) {
      throw new NotFoundException();
    }

    const canView = canUserManageWorkspace(item, userId, [
      WorkspaceMemberRoleEnum.Viewer,
      WorkspaceMemberRoleEnum.Editor,
      WorkspaceMemberRoleEnum.Owner,
    ]);

    if (!canView) {
      throw new UnauthorizedException();
    }

    return item;
  }

  async findOneByIdAndUserId(id: string, userId: number): Promise<DbWorkspace> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .leftJoinAndSelect(
        `workspaces.members`,
        `workspace_members`,
        `workspaces.id=workspace_members.workspace_id AND workspace_members.user_id = :userId`,
        { userId }
      )
      .where("workspaces.id = :id", { id });

    const item: DbWorkspace | null = await queryBuilder.getOne();

    if (!item) {
      throw new NotFoundException();
    }

    return item;
  }

  async findAllByUserId(pageOptionsDto: PageOptionsDto, userId: number): Promise<PageDto<DbWorkspace>> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder.innerJoinAndSelect("workspaces.members", "workspace_members", "workspace_members.user_id = :userId", {
      userId,
    });

    return this.pagerService.applyPagination<DbWorkspace>({
      pageOptionsDto,
      queryBuilder,
    });
  }

  async createWorkspace(dto: CreateWorkspaceDto, userId: number): Promise<DbWorkspace> {
    return this.workspaceRepository.manager.transaction(async (entityManager) => {
      const newWorkspace = entityManager.create(DbWorkspace, {
        name: dto.name,
        description: dto.description,
      });

      const savedWorkspace = await entityManager.save(DbWorkspace, newWorkspace);

      /* set the calling creator as the owner (so there's always at least 1 owner by default)*/
      const callerIsOwner = entityManager.create(DbWorkspaceMember, {
        user_id: userId,
        workspace_id: savedWorkspace.id,
        role: WorkspaceMemberRoleEnum.Owner,
      });

      await entityManager.save(DbWorkspaceMember, callerIsOwner);

      const memberPromises = dto.members.map(async (member) => {
        const newMember = entityManager.create(DbWorkspaceMember, {
          user_id: member.id,
          workspace_id: savedWorkspace.id,
          role: member.role,
        });

        return entityManager.save(DbWorkspaceMember, newMember);
      });

      await Promise.all(memberPromises);

      const repoPromises = dto.repos.map(async (dtoRepo) => {
        const parts = dtoRepo.full_name.split("/");

        if (parts.length !== 2) {
          throw new NotFoundException("invalid repo input: must be of form 'owner/name'");
        }

        const repo = await this.repoService.findOneByOwnerAndRepo(parts[0], parts[1]);
        const existingWorkspaceRepo = await this.workspaceRepoRepository.findOne({
          where: {
            workspace_id: savedWorkspace.id,
            repo_id: repo.id,
          },
          withDeleted: true,
        });

        if (existingWorkspaceRepo) {
          await entityManager.restore(DbWorkspaceRepo, existingWorkspaceRepo.id);
        } else {
          const newWorkspaceRepo = new DbWorkspaceRepo();

          newWorkspaceRepo.workspace = savedWorkspace;
          newWorkspaceRepo.repo = repo;

          await entityManager.save(DbWorkspaceRepo, newWorkspaceRepo);
        }
      });

      await Promise.all(repoPromises);

      return savedWorkspace;
    });
  }

  async updateWorkspace(id: string, dto: UpdateWorkspaceDto, userId: number): Promise<DbWorkspace> {
    const workspace = await this.findOneById(id);

    /*
     * editors and owners can update the workspace details
     * membership modification is left to owners on different endpoints
     */

    const canUpdate = canUserManageWorkspace(workspace, userId, [
      WorkspaceMemberRoleEnum.Editor,
      WorkspaceMemberRoleEnum.Owner,
    ]);

    if (!canUpdate) {
      throw new UnauthorizedException();
    }

    await this.workspaceRepository.update(id, {
      name: dto.name,
      description: dto.description,
    });

    return this.findOneById(id);
  }

  async deleteWorkspace(id: string, userId: number) {
    const workspace = await this.findOneByIdAndUserId(id, userId);
    const canDelete = canUserManageWorkspace(workspace, userId, [WorkspaceMemberRoleEnum.Owner]);

    if (!canDelete) {
      throw new UnauthorizedException();
    }

    return this.workspaceRepository.softDelete(id);
  }
}
