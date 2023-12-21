import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Repository, SelectQueryBuilder } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { PageOptionsDto } from "../common/dtos/page-options.dto";
import { PageDto } from "../common/dtos/page.dto";
import { PagerService } from "../common/services/pager.service";
import { DbWorkspaceMember, WorkspaceMemberRoleEnum } from "./entities/workspace-member.entity";
import { DbWorkspace } from "./entities/workspace.entity";
import { CreateWorkspaceDto } from "./dtos/create-workspace.dto";
import { UpdateWorkspaceDto } from "./dtos/update-workspace.dto";

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectRepository(DbWorkspaceMember, "ApiConnection")
    private workspaceMemberRepository: Repository<DbWorkspaceMember>,
    @InjectRepository(DbWorkspace, "ApiConnection")
    private workspaceRepository: Repository<DbWorkspace>,
    private pagerService: PagerService
  ) {}

  baseQueryBuilder(): SelectQueryBuilder<DbWorkspace> {
    const builder = this.workspaceRepository.createQueryBuilder("workspaces");

    return builder;
  }

  canUserManageWorkspace(workspace: DbWorkspace, userId: number, accessRoles: string[]): boolean {
    const membership = workspace.members.find((member) => member.user_id === userId);
    const canManage = membership && accessRoles.includes(membership.role);

    if (!canManage) {
      return false;
    }

    return true;
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

  async findAllByUserId(pageOptionsDto: PageOptionsDto, userId: number): Promise<PageDto<DbWorkspace>> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder.leftJoinAndSelect("workspaces.members", "workspace_members", "workspace_members.user_id = :userId", {
      userId,
    });

    return this.pagerService.applyPagination<DbWorkspace>({
      pageOptionsDto,
      queryBuilder,
    });
  }

  async createWorkspace(dto: CreateWorkspaceDto, userId: number): Promise<DbWorkspace> {
    const newWorkspace = this.workspaceRepository.create({
      name: dto.name,
      description: dto.description,
    });
    const savedWorkspace = await this.workspaceRepository.save(newWorkspace);

    /* set the calling creator as the owner (so there's always at least 1 owner by default)*/
    const callerIsOwner = this.workspaceMemberRepository.create({
      user_id: userId,
      workspace_id: savedWorkspace.id,
      role: WorkspaceMemberRoleEnum.Owner,
    });

    await this.workspaceMemberRepository.save(callerIsOwner);

    const promises = dto.members.map(async (member) => {
      const newMember = this.workspaceMemberRepository.create({
        user_id: member.id,
        workspace_id: savedWorkspace.id,
        role: member.role,
      });

      return this.workspaceMemberRepository.save(newMember);
    });

    await Promise.all(promises);

    return savedWorkspace;
  }

  async updateWorkspace(id: string, dto: UpdateWorkspaceDto, userId: number): Promise<DbWorkspace> {
    const workspace = await this.findOneById(id);

    /*
     * editors and owners can update the workspace details
     * membership modification is left to owners on different endpoints
     */

    const canUpdate = this.canUserManageWorkspace(workspace, userId, [
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

  async deleteWorkspace(workspaceId: string) {
    return this.workspaceRepository.softDelete(workspaceId);
  }
}
