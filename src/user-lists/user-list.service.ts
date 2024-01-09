import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Repository, SelectQueryBuilder } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { DbUserHighlightRepo } from "../highlight/entities/user-highlight-repo.entity";
import { DbPullRequest } from "../pull-requests/entities/pull-request.entity";
import { PageOptionsDto } from "../common/dtos/page-options.dto";
import { PageDto } from "../common/dtos/page.dto";
import { PagerService } from "../common/services/pager.service";
import { DbUser } from "../user/user.entity";
import { PageMetaDto } from "../common/dtos/page-meta.dto";
import { HighlightOptionsDto } from "../highlight/dtos/highlight-options.dto";
import { DbUserHighlight } from "../user/entities/user-highlight.entity";
import { GetPrevDateISOString } from "../common/util/datetimes";
import { CreateUserListDto } from "./dtos/create-user-list.dto";
import { DbUserList } from "./entities/user-list.entity";
import { DbUserListContributor } from "./entities/user-list-contributor.entity";
import { FilterListContributorsDto } from "./dtos/filter-contributors.dto";
import { DbTimezone } from "./entities/timezones.entity";

@Injectable()
export class UserListService {
  constructor(
    @InjectRepository(DbUserList, "ApiConnection")
    private userListRepository: Repository<DbUserList>,
    @InjectRepository(DbUserListContributor, "ApiConnection")
    private userListContributorRepository: Repository<DbUserListContributor>,
    @InjectRepository(DbUserHighlight, "ApiConnection")
    private userHighlightRepository: Repository<DbUserHighlight>,
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

  baseUserQueryBuilder(): SelectQueryBuilder<DbUser> {
    const builder = this.userRepository.createQueryBuilder("users");

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

    if (!item.is_public && userId && userId !== item.user_id) {
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

  async findAllFeatured(pageOptionsDto: PageOptionsDto): Promise<PageDto<DbUserList>> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder.where("is_featured=true").andWhere("is_public=true").orderBy("user_lists.updated_at", "DESC");

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

  async addUserListContributor(listId: string, userId: number, username?: string) {
    const existingContributor = await this.userListContributorRepository.findOne({
      where: {
        list_id: listId,
        user_id: userId,
      },
    });

    if (existingContributor) {
      return existingContributor;
    }

    const newUserListContributor = this.userListContributorRepository.create({
      list_id: listId,
      user_id: userId,
      username,
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

    queryBuilder.leftJoin(
      (qb) =>
        qb
          .select("author_login")
          .addSelect(
            "COALESCE(AVG((pull_requests.merged_at::DATE - pull_requests.created_at::DATE)), 0)",
            "avg_merge_time"
          )
          .from(DbPullRequest, "pull_requests")
          .where("now() - INTERVAL '30 days' <= pull_requests.updated_at")
          .groupBy("pull_requests.author_login"),
      "pr_stats",
      "LOWER(pr_stats.author_login) = LOWER(user.login)"
    );

    if (pageOptionsDto.contributor) {
      queryBuilder.andWhere("LOWER(user.login) LIKE :contributor", {
        contributor: `%${pageOptionsDto.contributor.toLowerCase()}%`,
      });
    }

    if (pageOptionsDto.location) {
      queryBuilder.andWhere("user.location in (:...location)", { location: pageOptionsDto.location });
    }

    if (pageOptionsDto.timezone) {
      queryBuilder.andWhere("user.timezone in (:...timezone)", { timezone: pageOptionsDto.timezone });
    }

    if (pageOptionsDto.pr_velocity) {
      queryBuilder.andWhere("pr_stats.avg_merge_time <= :pr_velocity", { pr_velocity: pageOptionsDto.pr_velocity });
      queryBuilder.andWhere("pr_stats.avg_merge_time != 0");
    }

    // skip "users" who are actually orgs
    queryBuilder.andWhere("type != 'Organization'");

    queryBuilder.offset(pageOptionsDto.skip).limit(pageOptionsDto.limit);

    const [itemCount, entities] = await Promise.all([queryBuilder.getCount(), queryBuilder.getMany()]);
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async findContributorsByListId(
    pageOptionsDto: FilterListContributorsDto,
    listId: string
  ): Promise<PageDto<DbUserListContributor>> {
    const queryBuilder = this.userListContributorRepository.createQueryBuilder("user_list_contributors");

    queryBuilder
      .leftJoin("users", "users", "user_list_contributors.user_id=users.id")
      .addSelect("users.login", "user_list_contributors_login")
      .where("user_list_contributors.list_id = :listId", { listId });

    if (pageOptionsDto.contributor) {
      queryBuilder.andWhere("LOWER(users.login) LIKE :contributor", {
        contributor: `%${pageOptionsDto.contributor.toLowerCase()}%`,
      });
    }

    return this.pagerService.applyPagination<DbUserListContributor>({
      pageOptionsDto,
      queryBuilder,
    });
  }

  async findListContributorsHighlights(
    pageOptionsDto: HighlightOptionsDto,
    listId: string
  ): Promise<PageDto<DbUserHighlight>> {
    const startDate = GetPrevDateISOString(pageOptionsDto.prev_days_start_date);
    const range = pageOptionsDto.range ?? 30;
    const orderBy = pageOptionsDto.orderDirection ?? "DESC";
    const queryBuilder = this.userHighlightRepository.createQueryBuilder("user_highlights");

    // return all highlights that belongs to a contributor of the list id
    queryBuilder
      .innerJoin(
        "user_list_contributors",
        "user_list_contributors",
        "user_list_contributors.user_id = user_highlights.user_id"
      )
      .innerJoin("users", "users", "user_highlights.user_id=users.id")
      .addSelect("users.name", "user_highlights_name")
      .addSelect("users.login", "user_highlights_login")
      .where("user_list_contributors.list_id = :listId", { listId })
      .andWhere(`'${startDate}'::TIMESTAMP - INTERVAL '${range} days' <= "user_highlights"."updated_at"`);

    if (pageOptionsDto.repo) {
      queryBuilder.andWhere(
        `EXISTS (
        SELECT 1
        FROM unnest(user_highlights.tagged_repos) AS repos
        WHERE repos LIKE '%${pageOptionsDto.repo}%'
      )`
      );
    }

    if (pageOptionsDto.contributor) {
      queryBuilder.andWhere("LOWER(users.login) LIKE :contributor", {
        contributor: `%${pageOptionsDto.contributor.toLowerCase()}%`,
      });
    }

    queryBuilder.orderBy("user_highlights.updated_at", orderBy);
    queryBuilder.offset(pageOptionsDto.skip).limit(pageOptionsDto.limit);

    const [itemCount, entities] = await Promise.all([queryBuilder.getCount(), queryBuilder.getMany()]);

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async findListContributorsHighlightedRepos(
    pageOptionsDto: PageOptionsDto,
    listId: string
  ): Promise<PageDto<DbUserHighlightRepo>> {
    const startDate = GetPrevDateISOString(pageOptionsDto.prev_days_start_date);
    const range = pageOptionsDto.range ?? 30;
    const orderBy = pageOptionsDto.orderDirection ?? "DESC";
    const queryBuilder = this.userHighlightRepository.createQueryBuilder("user_highlights");

    queryBuilder.select("DISTINCT UNNEST(user_highlights.tagged_repos) AS full_name");

    queryBuilder
      .innerJoin(
        "user_list_contributors",
        "user_list_contributors",
        "user_list_contributors.user_id = user_highlights.user_id"
      )
      .where("user_list_contributors.list_id = :listId", { listId })
      .andWhere(`'${startDate}'::TIMESTAMP - INTERVAL '${range} days' <= "user_highlights"."updated_at"`);
    queryBuilder.orderBy("full_name", orderBy);
    queryBuilder.offset(pageOptionsDto.skip).limit(pageOptionsDto.limit);

    const subQuery = this.userHighlightRepository.manager
      .createQueryBuilder()
      .from(`(${queryBuilder.getQuery()})`, "subquery_for_count")
      .setParameters(queryBuilder.getParameters())
      .select("count(full_name)");

    const countQueryResult = await subQuery.getRawOne<{ count: number }>();
    const itemCount = parseInt(`${countQueryResult?.count ?? "0"}`, 10);

    const entities = await queryBuilder.getRawMany();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async getAllTimezones(): Promise<DbTimezone[]> {
    const queryBuilder = this.baseUserQueryBuilder();

    queryBuilder
      .select("DISTINCT users.timezone as timezone")
      .where("users.timezone IS NOT NULL")
      .andWhere("users.timezone != ''");

    const timezones: DbTimezone[] = await queryBuilder.getRawMany();

    return timezones;
  }
}
