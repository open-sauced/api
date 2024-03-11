import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Repository, SelectQueryBuilder } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { DbUserHighlight } from "../user/entities/user-highlight.entity";
import { DbUserHighlightRepo } from "../highlight/entities/user-highlight-repo.entity";
import { CreateUserListDto } from "../user-lists/dtos/create-user-list.dto";
import { PageMetaDto } from "../common/dtos/page-meta.dto";
import { PageDto } from "../common/dtos/page.dto";
import { PageOptionsDto } from "../common/dtos/page-options.dto";
import { DbUserList } from "../user-lists/entities/user-list.entity";
import { UserListService } from "../user-lists/user-list.service";
import { UpdateUserListDto } from "../user-lists/dtos/update-user-list.dto";
import { FilterListContributorsDto } from "../user-lists/dtos/filter-contributors.dto";
import { DbUserListContributor } from "../user-lists/entities/user-list-contributor.entity";
import { CollaboratorsDto } from "../user-lists/dtos/collaborators.dto";
import { HighlightOptionsDto } from "../highlight/dtos/highlight-options.dto";
import { MoveWorkspaceUserListDto } from "./dtos/move-workspace-list.dto";
import { DbWorkspaceUserLists } from "./entities/workspace-user-list.entity";
import { canUserEditWorkspace, canUserViewWorkspace } from "./common/memberAccess";
import { WorkspaceService } from "./workspace.service";

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

    const queryBuilder = this.baseQueryBuilder()
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

  private async findOneUserListByWorkspaceIdForUserIdUnguarded(id: string, userListId: string): Promise<DbUserList> {
    const userList: DbUserList | undefined = await this.baseQueryBuilder()
      .leftJoinAndSelect("workspace_user_lists.user_list", "workspace_user_lists_user_list")
      .leftJoinAndSelect(
        `workspace_user_lists_user_list.workspaces`,
        `workspace_user_lists_workspace`,
        `workspace_user_lists_user_list.id = workspace_user_lists.user_list_id`
      )
      .where("workspace_user_lists.workspace_id = :id", { id })
      .andWhere("workspace_user_lists.user_list_id = :userListId", { userListId })
      .getOne()
      .then((result) => (result ? result.user_list : undefined));

    if (!userList) {
      throw new NotFoundException();
    }

    return userList;
  }

  async findOneUserListByWorkspaceeIdForUserId(
    id: string,
    userListId: string,
    userId: number | undefined
  ): Promise<DbUserList> {
    const workspace = await this.workspaceService.findOneById(id);

    /*
     * viewers, editors, and owners can see userLists that belong to a workspace
     */

    const canView = canUserViewWorkspace(workspace, userId);

    if (!canView) {
      throw new NotFoundException();
    }

    return this.findOneUserListByWorkspaceIdForUserIdUnguarded(id, userListId);
  }

  async findWorkspaceUserListContributors(
    pageOptionsDto: FilterListContributorsDto,
    id: string,
    userListId: string,
    userId: number | undefined
  ): Promise<PageDto<DbUserListContributor>> {
    const workspace = await this.workspaceService.findOneById(id);

    /*
     * viewers, editors, and owners can see userLists contributors within a workspace
     */

    const canView = canUserViewWorkspace(workspace, userId);

    if (!canView) {
      throw new NotFoundException();
    }

    const userList = await this.findOneUserListByWorkspaceIdForUserIdUnguarded(id, userListId);

    return this.userListService.findContributorsByListId(pageOptionsDto, userList.id);
  }

  async findWorkspaceUserListContributorHightlights(
    pageOptionsDto: HighlightOptionsDto,
    id: string,
    userListId: string,
    userId: number | undefined
  ): Promise<PageDto<DbUserHighlight>> {
    const workspace = await this.workspaceService.findOneById(id);

    /*
     * viewers, editors, and owners can see userLists contributors highlights within a workspace
     */

    const canView = canUserViewWorkspace(workspace, userId);

    if (!canView) {
      throw new NotFoundException();
    }

    const userList = await this.findOneUserListByWorkspaceIdForUserIdUnguarded(id, userListId);

    return this.userListService.findListContributorsHighlights(pageOptionsDto, userList.id);
  }

  async findWorkspaceUserListContributorHightlightedRepos(
    pageOptionsDto: PageOptionsDto,
    id: string,
    userListId: string,
    userId: number | undefined
  ): Promise<PageDto<DbUserHighlightRepo>> {
    const workspace = await this.workspaceService.findOneById(id);

    /*
     * viewers, editors, and owners can see userLists contributors highlighted repos within a workspace
     */

    const canView = canUserViewWorkspace(workspace, userId);

    if (!canView) {
      throw new NotFoundException();
    }

    const userList = await this.findOneUserListByWorkspaceIdForUserIdUnguarded(id, userListId);

    return this.userListService.findListContributorsHighlightedRepos(pageOptionsDto, userList.id);
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

  async addWorkspaceUserListContributors(
    dto: CollaboratorsDto,
    id: string,
    userListId: string,
    userId: number
  ): Promise<DbUserListContributor[]> {
    const workspace = await this.workspaceService.findOneById(id);

    /*
     * owners and editors can add workspace userList pages
     */

    const canEdit = canUserEditWorkspace(workspace, userId);

    if (!canEdit) {
      throw new UnauthorizedException();
    }

    const userList = await this.findOneUserListByWorkspaceIdForUserIdUnguarded(id, userListId);

    const contributors = dto.contributors.map(async (contributor) =>
      this.userListService.addUserListContributor(userList.id, contributor.id, contributor.login)
    );

    return Promise.all(contributors);
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

  async updateWorkspaceUserList(
    dto: UpdateUserListDto,
    id: string,
    userListId: string,
    userId: number
  ): Promise<DbUserList> {
    const workspace = await this.workspaceService.findOneById(id);

    /*
     * owners and editors can modify a workspace userList page
     */

    const canEdit = canUserEditWorkspace(workspace, userId);

    if (!canEdit) {
      throw new UnauthorizedException();
    }

    const userList = await this.findOneUserListByWorkspaceIdForUserIdUnguarded(id, userListId);

    await this.userListService.updateUserList(userList.id, {
      name: dto.name,
    });

    return this.findOneUserListByWorkspaceIdForUserIdUnguarded(id, userListId);
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

    const userList = await this.findOneUserListByWorkspaceIdForUserIdUnguarded(id, userListId);

    await this.userListService.deleteUserList(userList.id);
  }

  async deleteWorkspaceUserListContributor(
    id: string,
    userListId: string,
    userListContributorId: string,
    userId: number
  ) {
    const workspace = await this.workspaceService.findOneById(id);

    /*
     * owners and editors can delete workspace userList contributors
     */

    const canEdit = canUserEditWorkspace(workspace, userId);

    if (!canEdit) {
      throw new UnauthorizedException();
    }

    const userList = await this.findOneUserListByWorkspaceIdForUserIdUnguarded(id, userListId);

    await this.userListService.deleteUserListContributor(userList.id, userListContributorId);
  }
}
