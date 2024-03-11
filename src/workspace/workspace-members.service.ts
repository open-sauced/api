import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Repository, SelectQueryBuilder } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { PageMetaDto } from "../common/dtos/page-meta.dto";
import { PageDto } from "../common/dtos/page.dto";
import { PageOptionsDto } from "../common/dtos/page-options.dto";
import { UserService } from "../user/services/user.service";
import { DbWorkspaceMember } from "./entities/workspace-member.entity";
import { DbWorkspace } from "./entities/workspace.entity";
import { WorkspaceService } from "./workspace.service";
import { canUserManageWorkspace, canUserViewWorkspace } from "./common/memberAccess";
import { UpdateWorkspaceMemberDto, UpdateWorkspaceMembersDto } from "./dtos/update-workspace-members.dto";
import { DeleteWorkspaceMembersDto } from "./dtos/delete-workspace-member.dto";

@Injectable()
export class WorkspaceMembersService {
  constructor(
    @InjectRepository(DbWorkspaceMember, "ApiConnection")
    private workspaceMemberRepository: Repository<DbWorkspaceMember>,
    private workspaceService: WorkspaceService,
    private userService: UserService
  ) {}

  baseQueryBuilder(): SelectQueryBuilder<DbWorkspaceMember> {
    const builder = this.workspaceMemberRepository.createQueryBuilder("workspace_members");

    return builder;
  }

  async findAllMembersByWorkspaceIdForUserId(
    pageOptionsDto: PageOptionsDto,
    id: string,
    userId: number | undefined
  ): Promise<PageDto<DbWorkspaceMember>> {
    const workspace = await this.workspaceService.findOneById(id);

    /*
     * viewers, editors, and owners can see who belongs to a workspace
     */

    const canView = canUserViewWorkspace(workspace, userId);

    if (!canView) {
      throw new UnauthorizedException();
    }

    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .leftJoinAndSelect("workspace_members.member", "users", "users.id = workspace_members.user_id")
      .where("workspace_members.workspace_id = :id", { id });

    const itemCount = await queryBuilder.getCount();
    const entities = await queryBuilder.getMany();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async updateOneWorkspaceMember(
    dto: UpdateWorkspaceMemberDto,
    id: string,
    memberId: string,
    userId: number
  ): Promise<DbWorkspace> {
    const workspace = await this.workspaceService.findOneById(id);

    /*
     * owners can update the workspace members
     */

    const canUpdate = canUserManageWorkspace(workspace, userId);

    if (!canUpdate) {
      throw new UnauthorizedException();
    }

    const existingMember = await this.workspaceMemberRepository.findOne({
      where: {
        id: memberId,
        workspace_id: id,
      },
      withDeleted: true,
    });

    if (!existingMember) {
      throw new NotFoundException();
    }

    /*
     * throw an error if the user is attempting to update their own role.
     * this (for now) shouldn't be allowed in order to prevent any sort of "orphaning"
     * scenarios from occurring.
     * In the future, this should be expanded to allow this but prevent an "ownerless" workspace.
     */
    if (existingMember.user_id === userId) {
      throw new UnauthorizedException("cannot update own role in workspace");
    }

    existingMember.role = dto.role!;
    await this.workspaceMemberRepository.save(existingMember);

    // restores previously soft deleted rows
    if (existingMember.deleted_at) {
      await this.workspaceMemberRepository.restore(existingMember.id);
    }

    return this.workspaceService.findOneById(id);
  }

  async updateWorkspaceMembers(dto: UpdateWorkspaceMembersDto, id: string, userId: number): Promise<DbWorkspace> {
    const workspace = await this.workspaceService.findOneById(id);

    /*
     * owners can update the workspace members
     */

    const canUpdate = canUserManageWorkspace(workspace, userId);

    if (!canUpdate) {
      throw new UnauthorizedException();
    }

    const promises = dto.members.map(async (member) => {
      const existingMember = await this.workspaceMemberRepository.findOne({
        where: {
          workspace_id: id,
          user_id: member.id,
        },
        withDeleted: true,
      });

      if (existingMember) {
        /*
         * throw an error if the user is attempting to update their own role.
         * this (for now) shouldn't be allowed in order to prevent any sort of "orphaning"
         * scenarios from occurring.
         * In the future, this should be expanded to allow this but prevent an "ownerless" workspace.
         */
        if (existingMember.user_id === userId) {
          throw new UnauthorizedException("cannot update own role in workspace");
        }

        existingMember.role = member.role;
        await this.workspaceMemberRepository.save(existingMember);

        // restores previously soft deleted rows
        if (existingMember.deleted_at) {
          await this.workspaceMemberRepository.restore(existingMember.id);
        }
      } else {
        const user = await this.userService.findOneById(member.id);
        const newMember = new DbWorkspaceMember();

        newMember.workspace = workspace;
        newMember.member = user;
        newMember.role = member.role;

        await this.workspaceMemberRepository.save(newMember);
      }
    });

    await Promise.all(promises);
    return this.workspaceService.findOneById(id);
  }

  async deleteOneWorkspaceMember(id: string, memberId: string, userId: number) {
    const workspace = await this.workspaceService.findOneById(id);

    /*
     * owners can delete the workspace members
     */

    const canDelete = canUserManageWorkspace(workspace, userId);

    if (!canDelete) {
      throw new UnauthorizedException();
    }

    const existingMember = await this.workspaceMemberRepository.findOne({
      where: {
        id: memberId,
        workspace_id: id,
      },
    });

    if (!existingMember) {
      throw new NotFoundException();
    }

    /*
     * throw an error if the user is attempting to delete themselves.
     * this (for now) shouldn't be allowed in order to prevent any sort of "orphaning"
     * scenarios from occurring.
     * In the future, this should be expanded to prevent there from never being an owner.
     */
    if (existingMember.user_id === userId) {
      throw new UnauthorizedException("cannot delete self from workspace");
    }

    await this.workspaceMemberRepository.softDelete(existingMember.id);

    return this.workspaceService.findOneById(id);
  }

  async deleteWorkspaceMembers(dto: DeleteWorkspaceMembersDto, id: string, userId: number) {
    const workspace = await this.workspaceService.findOneById(id);

    /*
     * owners can delete the workspace members
     */

    const canDelete = canUserManageWorkspace(workspace, userId);

    if (!canDelete) {
      throw new UnauthorizedException();
    }

    const promises = dto.members.map(async (member) => {
      const existingMember = await this.workspaceMemberRepository.findOne({
        where: {
          workspace_id: id,
          user_id: member.id,
        },
      });

      if (!existingMember) {
        throw new NotFoundException();
      }

      /*
       * throw an error if the user is attempting to delete themselves.
       * this (for now) shouldn't be allowed in order to prevent any sort of "orphaning"
       * scenarios from occurring.
       * In the future, this should be expanded to prevent there from never being an owner.
       */
      if (existingMember.user_id === userId) {
        throw new UnauthorizedException("cannot delete self from workspace");
      }

      return this.workspaceMemberRepository.softDelete(existingMember.id);
    });

    try {
      await Promise.all(promises);
    } catch (error) {
      dto.members.forEach(async (member) => {
        // restore the members who may have been soft deleted
        const existingMember = await this.workspaceMemberRepository.findOne({
          where: {
            workspace_id: id,
            user_id: member.id,
          },
          withDeleted: true,
        });

        if (existingMember) {
          await this.workspaceMemberRepository.restore(existingMember.id);
        }
      });

      // throws the original error
      throw error;
    }

    return this.workspaceService.findOneById(id);
  }
}
