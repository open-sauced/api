import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Repository, SelectQueryBuilder } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { PageOptionsDto } from "../common/dtos/page-options.dto";
import { PageDto } from "../common/dtos/page.dto";
import { PagerService } from "../common/services/pager.service";
import { RepoService } from "../repo/repo.service";
import { DbUser } from "../user/user.entity";
import { UserService } from "../user/services/user.service";
import { DbWorkspaceMember, WorkspaceMemberRoleEnum } from "./entities/workspace-member.entity";
import { DbWorkspace } from "./entities/workspace.entity";
import { CreateWorkspaceDto } from "./dtos/create-workspace.dto";
import { UpdateWorkspaceDto } from "./dtos/update-workspace.dto";
import { canUserEditWorkspace, canUserManageWorkspace, canUserViewWorkspace } from "./common/memberAccess";
import { DbWorkspaceRepo } from "./entities/workspace-repos.entity";
import { DbWorkspaceContributor } from "./entities/workspace-contributors.entity";

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectRepository(DbWorkspace, "ApiConnection")
    private workspaceRepository: Repository<DbWorkspace>,
    @InjectRepository(DbWorkspaceRepo, "ApiConnection")
    private workspaceRepoRepository: Repository<DbWorkspaceRepo>,
    @InjectRepository(DbWorkspaceContributor, "ApiConnection")
    private workspaceContributorRepository: Repository<DbWorkspaceContributor>,
    @InjectRepository(DbUser, "ApiConnection")
    private userRepository: Repository<DbUser>,
    private pagerService: PagerService,
    private repoService: RepoService,
    private userService: UserService
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

  async findOneByIdGuarded(id: string, userId: number | undefined): Promise<DbWorkspace> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .leftJoinAndSelect(`workspaces.members`, `workspace_members`, `workspaces.id=workspace_members.workspace_id`)
      .where("workspaces.id = :id", { id });

    const item: DbWorkspace | null = await queryBuilder.getOne();

    if (!item) {
      throw new NotFoundException();
    }

    const canView = canUserViewWorkspace(item, userId);

    if (!canView) {
      throw new NotFoundException();
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

  async findPersonalWorkspaceByUserId(userId: number): Promise<DbWorkspace> {
    const workspaceIdQb = this.userRepository
      .createQueryBuilder()
      .select("personal_workspace_id")
      .where("id = :userId", { userId });

    const workspaceId = await workspaceIdQb.getRawOne<{ personal_workspace_id: string }>();

    if (!workspaceId || !workspaceId.personal_workspace_id) {
      throw new NotFoundException();
    }

    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .leftJoinAndSelect(`workspaces.members`, `workspace_members`, `workspaces.id=workspace_members.workspace_id`)
      .where("workspaces.id = :id", { id: workspaceId.personal_workspace_id });

    const item: DbWorkspace | null = await queryBuilder.getOne();

    if (!item) {
      throw new NotFoundException();
    }

    return item;
  }

  async findAllByUserId(pageOptionsDto: PageOptionsDto, userId: number): Promise<PageDto<DbWorkspace>> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder.innerJoinAndSelect("workspaces.members", "workspace_members").where(
      `
      "workspaces"."id" IN (
        SELECT "workspace_id" FROM "workspace_members" WHERE "user_id" = :userId
      )`,
      { userId }
    );

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

      const contribPromises = dto.contributors.map(async (contributor) => {
        let user;

        if (contributor.id) {
          user = await this.userService.findOneById(contributor.id);
        } else if (contributor.login) {
          user = await this.userService.findOneByUsername(contributor.login);
        } else {
          throw new BadRequestException("either user id or login must be provided");
        }

        const existingContributor = await this.workspaceContributorRepository.findOne({
          where: {
            workspace_id: savedWorkspace.id,
            contributor_id: user.id,
          },
          withDeleted: true,
        });

        if (existingContributor) {
          await entityManager.restore(DbWorkspaceContributor, existingContributor.id);
        } else {
          if (user.type.toLowerCase() === "organization") {
            throw new NotFoundException("not an contributor, is an org");
          }

          const newContributor = new DbWorkspaceContributor();

          newContributor.workspace = savedWorkspace;
          newContributor.contributor = user;

          await entityManager.save(DbWorkspaceContributor, newContributor);
        }
      });

      await Promise.all(contribPromises);

      return savedWorkspace;
    });
  }

  async updateWorkspace(id: string, dto: UpdateWorkspaceDto, userId: number): Promise<DbWorkspace> {
    const workspace = await this.findOneById(id);

    /*
     * editors and owners can update the workspace details
     * membership modification is left to owners on different endpoints
     */

    const canUpdate = canUserEditWorkspace(workspace, userId);

    if (!canUpdate) {
      throw new UnauthorizedException();
    }

    if (!dto.is_public && !workspace.payee_user_id) {
      throw new BadRequestException("workspace has no payee: cannot make private");
    }

    await this.workspaceRepository.update(id, {
      name: dto.name,
      description: dto.description,
    });

    return this.findOneById(id);
  }

  async deleteWorkspace(id: string, userId: number) {
    const workspace = await this.findOneByIdAndUserId(id, userId);

    /*
     * only owners can delete an entire workspace
     */
    const canDelete = canUserManageWorkspace(workspace, userId);

    if (!canDelete) {
      throw new UnauthorizedException();
    }

    const personalWorkspace = await this.findPersonalWorkspaceByUserId(userId);

    if (workspace.id === personalWorkspace.id) {
      throw new BadRequestException("cannot delete personal workspace");
    }

    return this.workspaceRepository.softDelete(id);
  }
}
