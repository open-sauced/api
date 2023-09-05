import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository, SelectQueryBuilder } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { PageOptionsDto } from "../common/dtos/page-options.dto";
import { PageDto } from "../common/dtos/page.dto";
import { PagerService } from "../common/services/pager.service";
import { CreateUserListDto } from "./dtos/create-user-list.dto";
import { DbUserList } from "./entities/user-list.entity";
import { DbUserListContributor } from "./entities/user-list-contributor.entity";

@Injectable()
export class UserListService {
  constructor(
    @InjectRepository(DbUserList, "ApiConnection")
    private userListRepository: Repository<DbUserList>,
    @InjectRepository(DbUserListContributor, "ApiConnection")
    private userListContributorRepository: Repository<DbUserListContributor>,
    private pagerService: PagerService
  ) {}

  baseQueryBuilder(): SelectQueryBuilder<DbUserList> {
    const builder = this.userListRepository.createQueryBuilder("user_lists");

    return builder;
  }

  baseListContributorQueryBuilder(): SelectQueryBuilder<DbUserListContributor> {
    const builder = this.userListContributorRepository.createQueryBuilder("user_list_contributors");

    return builder;
  }

  async findOneById(id: string, userId?: number): Promise<DbUserList> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .innerJoin("users", "users", "user_lists.user_id=users.id")
      .addSelect("users.login", "user_lists_login")
      .where("user_lists.id = :id", { id });

    if (userId) {
      queryBuilder.andWhere("user_lists.user_id = :userId", { userId });
    }

    const item: DbUserList | null = await queryBuilder.getOne();

    if (!item) {
      throw new NotFoundException();
    }

    return item;
  }

  async findAllByUserId(pageOptionsDto: PageOptionsDto, userId: number): Promise<PageDto<DbUserList>> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder.where("user_lists.user_id = :userId", { userId }).orderBy("user_lists.updated_at", "DESC");

    return this.pagerService.applyPagination<DbUserList>({
      pageOptionsDto,
      queryBuilder,
    });
  }

  async addUserList(userId: number, list: CreateUserListDto) {
    const newUserList = this.userListRepository.create({
      user_id: userId,
      name: list.name,
      is_public: list.is_public,
    });

    return this.userListRepository.save(newUserList);
  }

  async addUserListContributor(listId: string, userId: number) {
    const newUserListContributor = this.userListContributorRepository.create({
      list_id: listId,
      user_id: userId,
    });

    return this.userListContributorRepository.save(newUserListContributor);
  }

  async updateUserList(listId: string, highlight: Partial<DbUserList>) {
    return this.userListRepository.update(listId, highlight);
  }

  async deleteUserList(listId: string) {
    return this.userListRepository.softDelete(listId);
  }
}
