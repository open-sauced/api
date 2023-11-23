import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository, SelectQueryBuilder } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { PageDto } from "../common/dtos/page.dto";
import { DbUserListContributor } from "./entities/user-list-contributor.entity";
import { DbUserListContributorStat } from "./entities/user-list-contributor-stats.entity";
import {
  UserListContributorStatsOrderEnum,
  UserListContributorStatsTypeEnum,
  UserListMostActiveContributorsDto,
} from "./dtos/most-active-contributors.dto";
import { ContributionsTimeframeDto } from "./dtos/contributions-timeframe.dto";
import { DbContributionStatTimeframe } from "./entities/contributions-timeframe.entity";
import { DbContributionsProjects } from "./entities/contributions-projects.entity";
import { DbContributorCategoryTimeframe } from "./entities/contributors-timeframe.entity";
import { ContributionPageMetaDto as ContributionsPageMetaDto } from "./dtos/contributions-pagemeta.dto";
import { ContributionsPageDto } from "./dtos/contributions-page.dto";
import { ContributionsByProjectDto } from "./dtos/contributions-by-project.dto";
import { TopProjectsDto } from "./dtos/top-projects.dto";
import { UserListMostUsedLanguagesDto } from "./dtos/most-used-languages.dto";
import { DbUserListLanguageStat } from "./entities/user-list-languages-stat";
import { MostUsedLanguagesPageDto } from "./dtos/most-used-languages-page.dto";

interface AllContributionsCount {
  all_contributions: number;
}

@Injectable()
export class UserListStatsService {
  constructor(
    @InjectRepository(DbUserListContributor, "ApiConnection")
    private userListContributorRepository: Repository<DbUserListContributor>
  ) { }

  baseQueryBuilder(): SelectQueryBuilder<DbUserListContributor> {
    const builder = this.userListContributorRepository.createQueryBuilder("user_list_contributors");

    return builder;
  }

  async findListContributorStatsByProject(
    options: TopProjectsDto,
    listId: string
  ): Promise<DbUserListContributorStat[]> {
    const range = options.range!;
    const repoId = options.repo_id;

    const queryBuilder = this.baseQueryBuilder();

    queryBuilder.innerJoin("users", "users", "user_list_contributors.user_id=users.id");

    queryBuilder
      .select("users.login", "login")
      .andWhere("user_list_contributors.list_id = :listId", { listId })
      .addSelect(
        `(
          SELECT COALESCE(SUM("pull_requests"."commits"), 0)
          FROM "pull_requests"
          WHERE "pull_requests"."author_login" = "users"."login"
            AND "pull_requests"."repo_id" = ${repoId}
            AND now() - INTERVAL '${range} days' <= "pull_requests"."updated_at"
        )::INTEGER`,
        "commits"
      )
      .addSelect(
        `(
          SELECT COALESCE(COUNT("pull_requests"."id"), 0)
          FROM "pull_requests"
          WHERE "pull_requests"."author_login" = "users"."login"
            AND "pull_requests"."repo_id" = ${repoId}
            AND now() - INTERVAL '${range} days' <= "pull_requests"."updated_at"
        )::INTEGER`,
        "prs_created"
      );

    // limit to only the top 20 contributors for stats by projects
    queryBuilder.limit(20);

    const entities: DbUserListContributorStat[] = await queryBuilder.getRawMany();

    return entities;
  }

  async findAllListContributorStats(
    pageOptionsDto: UserListMostActiveContributorsDto,
    listId: string
  ): Promise<PageDto<DbUserListContributorStat>> {
    const range = pageOptionsDto.range!;
    const now = new Date().toISOString();

    const cteBuilder = this.baseQueryBuilder();

    cteBuilder.innerJoin("users", "users", "user_list_contributors.user_id=users.id");

    switch (pageOptionsDto.contributorType) {
      case UserListContributorStatsTypeEnum.all:
        break;

      case UserListContributorStatsTypeEnum.active:
        this.applyActiveContributorsFilter(cteBuilder, now, range);
        break;

      case UserListContributorStatsTypeEnum.new:
        this.applyNewContributorsFilter(cteBuilder, now, range);
        break;

      case UserListContributorStatsTypeEnum.alumni: {
        this.applyAlumniContributorsFilter(cteBuilder, now, range);
        break;
      }

      default:
        break;
    }

    cteBuilder
      .select("users.login", "login")
      .andWhere("user_list_contributors.list_id = :listId", { listId })
      .addSelect(
        `(
          SELECT COALESCE(SUM("pull_requests"."commits"), 0)
          FROM "pull_requests"
          WHERE "pull_requests"."author_login" = "users"."login"
            AND now() - INTERVAL '${range} days' <= "pull_requests"."updated_at"
        )::INTEGER`,
        "commits"
      )
      .addSelect(
        `(
          SELECT COALESCE(COUNT("pull_requests"."id"), 0)
          FROM "pull_requests"
          WHERE "pull_requests"."author_login" = "users"."login"
            AND now() - INTERVAL '${range} days' <= "pull_requests"."updated_at"
        )::INTEGER`,
        "prs_created"
      );

    const entityQb = this.userListContributorRepository.manager
      .createQueryBuilder()
      .addCommonTableExpression(cteBuilder, "CTE")
      .setParameters(cteBuilder.getParameters())
      .select("login")
      .addSelect("commits")
      .addSelect("prs_created")
      .addSelect(`("commits" + "prs_created") AS "total_contributions"`)
      .from("CTE", "CTE");

    switch (pageOptionsDto.orderBy) {
      case UserListContributorStatsOrderEnum.commits:
        entityQb.orderBy(`"${UserListContributorStatsOrderEnum.commits}"`, pageOptionsDto.orderDirection);
        break;

      case UserListContributorStatsOrderEnum.prs_created:
        entityQb.orderBy(`"${UserListContributorStatsOrderEnum.prs_created}"`, pageOptionsDto.orderDirection);
        break;

      case UserListContributorStatsOrderEnum.total_contributions:
        entityQb.orderBy(`"${UserListContributorStatsOrderEnum.total_contributions}"`, pageOptionsDto.orderDirection);
        break;

      default:
        break;
    }

    const allCountQb = this.userListContributorRepository.manager
      .createQueryBuilder()
      .addCommonTableExpression(cteBuilder, "CTE")
      .setParameters(cteBuilder.getParameters())
      .select(`SUM("commits" + "prs_created") OVER () AS "all_contributions"`)
      .from("CTE", "CTE");

    const itemCount = await cteBuilder.getCount();
    const allContributionsResult: AllContributionsCount | undefined = await allCountQb.getRawOne();

    if (!allContributionsResult) {
      return new ContributionsPageDto(
        new Array<DbUserListContributorStat>(),
        new ContributionsPageMetaDto({ itemCount, pageOptionsDto }, 0)
      );
    }

    const allContributionsCount = allContributionsResult.all_contributions;

    cteBuilder.offset(pageOptionsDto.skip).limit(pageOptionsDto.limit);

    const entities: DbUserListContributorStat[] = await entityQb.getRawMany();

    const pageMetaDto = new ContributionsPageMetaDto({ itemCount, pageOptionsDto }, allContributionsCount);

    return new ContributionsPageDto(entities, pageMetaDto);
  }

  async findAllListLanguageStats(
    pageOptionsDto: UserListMostUsedLanguagesDto,
    listId: string
  ): Promise<PageDto<DbUserListLanguageStat>> {
    /*
     * const range = pageOptionsDto.range!;
     * const now = new Date().toISOString();
     */

    const cteBuilder = this.baseQueryBuilder();

    /*
     * switch (pageOptionsDto.contributorType) {
     *   case UserListContributorStatsTypeEnum.all:
     *     break;
     */

    /*
     *   case UserListContributorStatsTypeEnum.active:
     *     this.applyActiveContributorsFilter(cteBuilder, now, range);
     *     break;
     */

    /*
     *   case UserListContributorStatsTypeEnum.new:
     *     this.applyNewContributorsFilter(cteBuilder, now, range);
     *     break;
     */

    /*
     *   case UserListContributorStatsTypeEnum.alumni: {
     *     this.applyAlumniContributorsFilter(cteBuilder, now, range);
     *     break;
     *   }
     */

    /*
     *   default:
     *     break;
     * }
     */

    cteBuilder
      .select("language.key", "name")
      .addSelect("SUM(COALESCE(language.value))", "value")
      .innerJoin("users", "users", "user_list_contributors.user_id=users.id")
      .innerJoin("user_list_contributors", "ulc")
      .where("ulc.list_id = :listId", { listId })
      .groupBy("language.key")
      .orderBy("value", "DESC");

    const itemCount = await cteBuilder.getCount();

    // cteBuilder.offset(pageOptionsDto.skip).limit(pageOptionsDto.limit);

    const entities: DbUserListLanguageStat[] = await cteBuilder.getRawMany();

    const pageMetaDto = new ContributionsPageMetaDto({ itemCount, pageOptionsDto }, itemCount);

    return new MostUsedLanguagesPageDto(entities, pageMetaDto);
  }

  async findContributorCategoriesByTimeframe(
    options: ContributionsTimeframeDto,
    listId: string
  ): Promise<DbContributorCategoryTimeframe[]> {
    const denominator = 82;
    const range = options.range!;
    const dates = this.getDateFrames(range, denominator);

    const framePromises = dates.map(async (frameStartDate) =>
      this.findContributorCategoriesInTimeframeHelper(frameStartDate.toISOString(), range / denominator, listId)
    );

    return Promise.all(framePromises);
  }

  async findContributionsInTimeframe(
    options: ContributionsTimeframeDto,
    listId: string
  ): Promise<DbContributionStatTimeframe[]> {
    const range = options.range!;
    const contributorType = options.contributorType!;
    const dates = this.getDateFrames(range);

    const framePromises = dates.map(async (frameStartDate) =>
      this.findContributionsInTimeframeHelper(frameStartDate.toISOString(), range / 7, contributorType, listId)
    );

    return Promise.all(framePromises);
  }

  getDateFrames(range = 30, denominator = 7): Date[] {
    const currentDate = new Date();
    const frameDuration = range / denominator;
    const dates: Date[] = [];

    // eslint-disable-next-line no-loops/no-loops
    for (let i = 0; i < denominator; i++) {
      const frameDate = new Date(currentDate.getTime() - (range - i * frameDuration) * 86400000);

      dates.push(frameDate);
    }

    return dates;
  }

  async findContributionsInTimeframeHelper(
    startDate: string,
    range: number,
    contributorType: string,
    listId: string
  ): Promise<DbContributionStatTimeframe> {
    const subQueryBuilder = this.baseQueryBuilder();

    subQueryBuilder.innerJoin(
      "users",
      "users",
      `user_list_contributors.user_id=users.id AND user_list_contributors.list_id='${listId}'`
    );

    switch (contributorType) {
      case UserListContributorStatsTypeEnum.all:
        break;

      case UserListContributorStatsTypeEnum.active:
        this.applyActiveContributorsFilter(subQueryBuilder, startDate, range);
        break;

      case UserListContributorStatsTypeEnum.new:
        this.applyNewContributorsFilter(subQueryBuilder, startDate, range);
        break;

      case UserListContributorStatsTypeEnum.alumni: {
        this.applyAlumniContributorsFilter(subQueryBuilder, startDate, range);
        break;
      }

      default:
        break;
    }

    subQueryBuilder
      .addSelect(
        `(
          SELECT COALESCE(SUM("pull_requests"."commits"), 0)
          FROM "pull_requests"
          WHERE "pull_requests"."author_login" = "users"."login"
            AND "pull_requests"."updated_at" > '${startDate}'::TIMESTAMP - INTERVAL '${range} days'
            AND "pull_requests"."updated_at" <= '${startDate}'::TIMESTAMP
        )::INTEGER`,
        "all_commits"
      )
      .addSelect(
        `(
          SELECT COALESCE(COUNT("pull_requests"."id"), 0)
          FROM "pull_requests"
          WHERE "pull_requests"."author_login" = "users"."login"
            AND "pull_requests"."updated_at" > '${startDate}'::TIMESTAMP - INTERVAL '${range} days'
            AND "pull_requests"."updated_at" <= '${startDate}'::TIMESTAMP
        )::INTEGER`,
        "all_prs_created"
      );

    const queryBuilder = this.userListContributorRepository.manager
      .createQueryBuilder()
      .select(`COALESCE(SUM("subQ"."all_commits"), 0)`, "commits")
      .addSelect(`COALESCE(SUM("subQ"."all_prs_created"), 0)`, "prs_created")
      .from(`( ${subQueryBuilder.getQuery()} )`, "subQ")
      .setParameters(subQueryBuilder.getParameters());

    const entity: DbContributionStatTimeframe | undefined = await queryBuilder.getRawOne();

    if (!entity) {
      throw new NotFoundException();
    }

    entity.time_start = startDate;
    entity.time_end = `${new Date(new Date(startDate).getTime() + range * 86400000).toISOString()}`;

    return entity;
  }

  async findContributorCategoriesInTimeframeHelper(
    startDate: string,
    range: number,
    listId: string
  ): Promise<DbContributorCategoryTimeframe> {
    const activeCountQueryBuilder = this.baseQueryBuilder();

    activeCountQueryBuilder.innerJoin(
      "users",
      "users",
      `user_list_contributors.user_id=users.id AND user_list_contributors.list_id='${listId}'`
    );

    this.applyActiveContributorsFilter(activeCountQueryBuilder, startDate, range);

    const activeCount = await activeCountQueryBuilder.getCount();

    const newCountQueryBuilder = this.baseQueryBuilder();

    newCountQueryBuilder.innerJoin(
      "users",
      "users",
      `user_list_contributors.user_id=users.id AND user_list_contributors.list_id='${listId}'`
    );

    this.applyNewContributorsFilter(newCountQueryBuilder, startDate, range);

    const newCount = await newCountQueryBuilder.getCount();

    const alumniCountQueryBuilder = this.baseQueryBuilder();

    alumniCountQueryBuilder.innerJoin(
      "users",
      "users",
      `user_list_contributors.user_id=users.id AND user_list_contributors.list_id='${listId}'`
    );

    this.applyAlumniContributorsFilter(alumniCountQueryBuilder, startDate, range);

    const alumniCount = await alumniCountQueryBuilder.getCount();

    return {
      time_start: startDate,
      time_end: `${new Date(new Date(startDate).getTime() + range * 86400000).toISOString()}`,
      active: activeCount,
      new: newCount,
      alumni: alumniCount,
      all: activeCount + newCount + alumniCount,
    };
  }

  async findContributionsByProject(
    listId: string,
    options: ContributionsByProjectDto
  ): Promise<DbContributionsProjects[]> {
    const range = options.range!;

    const queryBuilder = this.userListContributorRepository.manager
      .createQueryBuilder()
      .select("split_part(repos.full_name, '/', 1)", "org_id")
      .addSelect("split_part(repos.full_name, '/', 2)", "project_id")
      .addSelect("repos.id", "repo_id")
      .addSelect("COUNT(pr.id)", "contributions")

      // grab pull requests first
      .from("pull_requests", "pr")

      // and join them with repos
      .innerJoin("repos", "repos", 'pr."repo_id" = "repos"."id"')

      // join with filtered users from the user list
      .innerJoin(
        (subQuery) =>
          subQuery
            .select("users.login", "user_login")
            .from("user_list_contributors", "user_list_contributors")
            .innerJoin("users", "users", '"user_list_contributors"."user_id" = "users"."id"')
            .where(`"user_list_contributors"."list_id" = '${listId}'`),
        "filtered_users",
        'pr."author_login" = "filtered_users"."user_login"'
      )

      .where(`pr."updated_at" BETWEEN NOW() - INTERVAL '${range} days' AND NOW()`)
      .groupBy("repos.full_name, repos.id");

    const entities: DbContributionsProjects[] = await queryBuilder.getRawMany();

    return entities;
  }

  private applyActiveContributorsFilter(
    queryBuilder: SelectQueryBuilder<DbUserListContributor>,
    startDate: string,
    range = 30
  ) {
    queryBuilder
      .leftJoin(
        `(
        SELECT DISTINCT "author_login"
        FROM "pull_requests"
        WHERE "pull_requests"."updated_at" BETWEEN '${startDate}'::TIMESTAMP - INTERVAL '${range} days'
          AND '${startDate}'::TIMESTAMP
      )`,
        "current_month_prs",
        `"users"."login" = "current_month_prs"."author_login"`
      )
      .leftJoin(
        `(
        SELECT DISTINCT "author_login"
        FROM "pull_requests"
        WHERE "pull_requests"."updated_at" BETWEEN '${startDate}'::TIMESTAMP - INTERVAL '${range + range} days'
          AND '${startDate}'::TIMESTAMP - INTERVAL '${range} days'
      )`,
        "previous_month_prs",
        `"users"."login" = "previous_month_prs"."author_login"`
      )
      .where(`"previous_month_prs"."author_login" IS NOT NULL`)
      .andWhere(`"current_month_prs"."author_login" IS NOT NULL`);
  }

  private applyNewContributorsFilter(
    queryBuilder: SelectQueryBuilder<DbUserListContributor>,
    startDate: string,
    range = 30
  ) {
    queryBuilder
      .leftJoin(
        `(
            SELECT DISTINCT "author_login"
            FROM "pull_requests"
            WHERE "pull_requests"."updated_at" BETWEEN NOW() - INTERVAL '${range} days'
              AND '${startDate}'::TIMESTAMP
          )`,
        "current_month_prs",
        `"users"."login" = "current_month_prs"."author_login"`
      )
      .leftJoin(
        `(
            SELECT DISTINCT "author_login"
            FROM "pull_requests"
            WHERE "pull_requests"."updated_at" BETWEEN NOW() - INTERVAL '${range + range} days'
              AND '${startDate}'::TIMESTAMP - INTERVAL '${range} days'
          )`,
        "previous_month_prs",
        `"users"."login" = "previous_month_prs"."author_login"`
      )
      .where(`"previous_month_prs"."author_login" IS NULL`)
      .andWhere(`"current_month_prs"."author_login" IS NOT NULL`);
  }

  private applyAlumniContributorsFilter(
    queryBuilder: SelectQueryBuilder<DbUserListContributor>,
    startDate: string,
    range = 30
  ) {
    queryBuilder
      .leftJoin(
        `(
            SELECT DISTINCT "author_login"
            FROM "pull_requests"
            WHERE "pull_requests"."updated_at" BETWEEN '${startDate}'::TIMESTAMP - INTERVAL '${range} days'
              AND '${startDate}'::TIMESTAMP
          )`,
        "current_month_prs",
        `"users"."login" = "current_month_prs"."author_login"`
      )
      .leftJoin(
        `(
            SELECT DISTINCT "author_login"
            FROM "pull_requests"
            WHERE "pull_requests"."updated_at" BETWEEN '${startDate}'::TIMESTAMP - INTERVAL '${range + range} days'
              AND '${startDate}'::TIMESTAMP - INTERVAL '${range} days'
          )`,
        "previous_month_prs",
        `"users"."login" = "previous_month_prs"."author_login"`
      )
      .where(`"previous_month_prs"."author_login" IS NOT NULL`)
      .andWhere(`"current_month_prs"."author_login" IS NULL`);
  }
}
