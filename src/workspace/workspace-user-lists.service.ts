import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Repository, SelectQueryBuilder } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { CreateUserListDto } from "../user-lists/dtos/create-user-list.dto";
import { PageMetaDto } from "../common/dtos/page-meta.dto";
import { PageDto } from "../common/dtos/page.dto";
import { PageOptionsDto } from "../common/dtos/page-options.dto";
import { DbUserList } from "../user-lists/entities/user-list.entity";
import { UserListService } from "../user-lists/user-list.service";
import { WorkspaceService } from "./workspace.service";
import { canUserManageWorkspace } from "./common/memberAccess";
import { WorkspaceMemberRoleEnum } from "./entities/workspace-member.entity";
import { DbWorkspaceUserLists } from "./entities/workspace-user-list.entity";

@Injectable()
export class WorkspaceUserListsService {
  constructor(
    @InjectRepository(DbWorkspaceUserLists, "ApiConnection")
    private workspaceUserListRepository: Repository<DbWorkspaceUserLists>,
    @InjectRepository(DbUserList, "ApiConnection")
    private userListRepository: Repository<DbUserList>,
    private workspaceService: WorkspaceService,
    private userListService: UserListService
  ) {}

  baseQueryBuilder(): SelectQueryBuilder<DbWorkspaceUserLists> {
    const builder = this.workspaceUserListRepository.createQueryBuilder("workspace_user_lists");

    return builder;
  }

  async findAllUserListsByWorkspaceIdForUserId(
    pageOptionsDto: PageOptionsDto,
    id: string,
    userId: number
  ): Promise<PageDto<DbUserList>> {
    const workspace = await this.workspaceService.findOneById(id);

    /*
     * viewers, editors, and owners can see userLists that belong to a workspace
     */

    const canView = canUserManageWorkspace(workspace, userId, [
      WorkspaceMemberRoleEnum.Viewer,
      WorkspaceMemberRoleEnum.Editor,
      WorkspaceMemberRoleEnum.Owner,
    ]);

    if (!canView) {
      throw new UnauthorizedException();
    }

    const queryBuilder = this.workspaceUserListRepository
      .createQueryBuilder("workspace_user_lists")
      .leftJoinAndSelect("workspace_user_lists.user_list", "workspace_user_lists_user_list")
      .where("workspace_user_lists.workspace_id = :id", { id });

    const itemCount = await queryBuilder.getCount();
    const entities: DbUserList[] = await queryBuilder
      .getMany()
      .then((results) => results.map((result) => result.user_list));

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async addWorkspaceUserList(dto: CreateUserListDto, id: string, userId: number): Promise<DbWorkspaceUserLists> {
    const workspace = await this.workspaceService.findOneById(id);

    /*
     * owners and editors can add workspace userList pages
     */

    const canEdit = canUserManageWorkspace(workspace, userId, [
      WorkspaceMemberRoleEnum.Owner,
      WorkspaceMemberRoleEnum.Editor,
    ]);

    if (!canEdit) {
      throw new UnauthorizedException();
    }

    const newUserList = await this.userListService.addUserList(userId, dto, id);

    const listContributors = dto.contributors.map(async (contributor) =>
      this.userListService.addUserListContributor(newUserList.id, contributor.id, contributor.login)
    );

    await Promise.allSettled(listContributors);

    const queryBuilder = this.baseQueryBuilder();

    queryBuilder.where("workspace_user_lists.user_list_id = :id", { id: newUserList.id });

    const item: DbWorkspaceUserLists | null = await queryBuilder.getOne();

    if (!item) {
      throw new NotFoundException("newly created workspace was not found");
    }

    return item;
  }

  async deleteWorkspaceUserList(id: string, userListId: string, userId: number) {
    const workspace = await this.workspaceService.findOneById(id);

    /*
     * owners and editors can delete the workspace contributors
     */

    const canDelete = canUserManageWorkspace(workspace, userId, [
      WorkspaceMemberRoleEnum.Owner,
      WorkspaceMemberRoleEnum.Editor,
    ]);

    if (!canDelete) {
      throw new UnauthorizedException();
    }

    await this.userListService.deleteUserList(userListId);
  }
}
