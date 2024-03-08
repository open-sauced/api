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
import { canUserEditWorkspace, canUserViewWorkspace } from "./common/memberAccess";
import { DbWorkspaceUserLists } from "./entities/workspace-user-list.entity";
import { MoveWorkspaceUserListDto } from "./dtos/move-workspace-list.dto";

@Injectable()
export class WorkspaceUserListsService {
  constructor(
    @InjectRepository(DbWorkspaceUserLists, "ApiConnection")
    private workspaceUserListRepository: Repository<DbWorkspaceUserLists>,
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
    userId: number | undefined
  ): Promise<PageDto<DbUserList>> {
    const workspace = await this.workspaceService.findOneById(id);

    /*
     * viewers, editors, and owners can see userLists that belong to a workspace
     */

    const canView = canUserViewWorkspace(workspace, userId);

    if (!canView) {
      throw new NotFoundException();
    }

    const queryBuilder = this.workspaceUserListRepository
      .createQueryBuilder("workspace_user_lists")
      .leftJoinAndSelect("workspace_user_lists.user_list", "workspace_user_lists_user_list")
      .where("workspace_user_lists.workspace_id = :id", { id })
      .orderBy("workspace_user_lists_user_list.updated_at", "DESC");

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

    const canEdit = canUserEditWorkspace(workspace, userId);

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

  async moveWorkspaceUserList(
    dto: MoveWorkspaceUserListDto,
    homeWorkspaceId: string,
    newWorkspaceId: string,
    userId: number
  ): Promise<DbWorkspaceUserLists> {
    /*
     * owners and editors can move workspace user list they are members of.
     * note: the given user must be an owner / editor of BOTH workspaces to move it.
     */

    const homeWorkspace = await this.workspaceService.findOneById(homeWorkspaceId);
    const canEditHomeWorkspace = canUserEditWorkspace(homeWorkspace, userId);

    if (!canEditHomeWorkspace) {
      throw new UnauthorizedException();
    }

    const workspaceUserList = await this.workspaceUserListRepository.findOne({
      where: {
        user_list_id: dto.id,
      },
    });

    if (!workspaceUserList) {
      throw new NotFoundException(`workspace user list with user list id ${dto.id} not found`);
    }

    const newWorkspace = await this.workspaceService.findOneById(newWorkspaceId);
    const canEditNewWorkspace = canUserEditWorkspace(newWorkspace, userId);

    if (!canEditNewWorkspace) {
      throw new UnauthorizedException();
    }

    await this.workspaceUserListRepository.update(workspaceUserList.id, {
      workspace: newWorkspace,
    });

    const queryBuilder = this.baseQueryBuilder();

    queryBuilder.where("workspace_user_lists.user_list_id = :id", { id: dto.id });

    const item: DbWorkspaceUserLists | null = await queryBuilder.getOne();

    if (!item) {
      throw new NotFoundException("newly moved workspace user list was not found");
    }

    return item;
  }

  async deleteWorkspaceUserList(id: string, userListId: string, userId: number) {
    const workspace = await this.workspaceService.findOneById(id);

    /*
     * owners and editors can delete the workspace contributors
     */

    const canDelete = canUserEditWorkspace(workspace, userId);

    if (!canDelete) {
      throw new UnauthorizedException();
    }

    await this.userListService.deleteUserList(userListId);
  }
}
