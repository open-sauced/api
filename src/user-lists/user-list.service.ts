import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Repository, SelectQueryBuilder } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { PageOptionsDto } from "../common/dtos/page-options.dto";
import { PageDto } from "../common/dtos/page.dto";
import { PagerService } from "../common/services/pager.service";
import { DbUser } from "../user/user.entity";
import { PageMetaDto } from "../common/dtos/page-meta.dto";
import { CreateUserListDto } from "./dtos/create-user-list.dto";
import { DbUserList } from "./entities/user-list.entity";
import { DbUserListContributor } from "./entities/user-list-contributor.entity";
import { FilterListContributorsDto } from "./dtos/filter-contributors.dto";

@Injectable()
export class UserListService {
  constructor(
    @InjectRepository(DbUserList, "ApiConnection")
    private userListRepository: Repository<DbUserList>,
    @InjectRepository(DbUserListContributor, "ApiConnection")
    private userListContributorRepository: Repository<DbUserListContributor>,
    @InjectRepository(DbUser, "ApiConnection")
    private userRepository: Repository<DbUser>,
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

  async findPublicOneById(id: string, userId?: number): Promise<DbUserList> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .innerJoin("users", "users", "user_lists.user_id=users.id")
      .addSelect("users.login", "user_lists_login")
      .where("user_lists.id = :id", { id });

    const item: DbUserList | null = await queryBuilder.getOne();

    if (!item) {
      throw new NotFoundException();
    }

    if (!item.is_public && userId !== item.user_id) {
      throw new UnauthorizedException("You're not authorized to view this list");
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

  async deleteUserListContributor(id: string, userListContributorId: string) {
    const contributor = await this.userListContributorRepository.findOne({
      where: {
        id: userListContributorId,
        list_id: id,
      },
    });

    if (contributor) {
      return this.userListContributorRepository.softDelete(userListContributorId);
    }

    throw new NotFoundException("User list contributor not found for given list ID");
  }

  async updateUserList(listId: string, highlight: Partial<DbUserList>) {
    return this.userListRepository.update(listId, highlight);
  }

  async deleteUserList(listId: string) {
    return this.userListRepository.softDelete(listId);
  }

  async findContributorsByFilter(pageOptionsDto: FilterListContributorsDto): Promise<PageDto<DbUser>> {
    const queryBuilder = this.userRepository.createQueryBuilder("user");

    if (pageOptionsDto.location) {
      queryBuilder.andWhere("user.location = :location", { location: pageOptionsDto.location });
    }

    if (pageOptionsDto.timezone) {
      queryBuilder.andWhere("user.timezone = :timezone", { timezone: pageOptionsDto.timezone });
    }

    if (pageOptionsDto.pr_velocity) {
      queryBuilder.andWhere(
        `
        (
          SELECT COALESCE(AVG(("pull_requests"."merged_at"::DATE - "pull_requests"."created_at"::DATE)), 0)
          FROM "pull_requests"
          WHERE LOWER("pull_requests"."author_login") = LOWER(user.login)
          AND now() - INTERVAL '30 days' <= "pull_requests"."updated_at"
        ) <= :pr_velocity
        AND
        (
          SELECT COALESCE(AVG(("pull_requests"."merged_at"::DATE - "pull_requests"."created_at"::DATE)), 0)
          FROM "pull_requests"
          WHERE LOWER("pull_requests"."author_login") = LOWER(user.login)
          AND now() - INTERVAL '30 days' <= "pull_requests"."updated_at"
        ) != 0
      `,
        { pr_velocity: pageOptionsDto.pr_velocity }
      );
    }

    queryBuilder.offset(pageOptionsDto.skip).limit(pageOptionsDto.limit);

    const [itemCount, entities] = await Promise.all([queryBuilder.getCount(), queryBuilder.getMany()]);
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async findContributorsByListId(
    pageOptionsDto: PageOptionsDto,
    listId: string
  ): Promise<PageDto<DbUserListContributor>> {
    const queryBuilder = this.userListContributorRepository.createQueryBuilder("user_list_contributors");

    queryBuilder
      .innerJoin("users", "users", "user_list_contributors.user_id=users.id")
      .addSelect("users.login", "user_list_contributors_login")
      .where("user_list_contributors.list_id = :listId", { listId });

    return this.pagerService.applyPagination<DbUserListContributor>({
      pageOptionsDto,
      queryBuilder,
    });
  }
}
