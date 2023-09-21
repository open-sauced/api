import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository, SelectQueryBuilder } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { PageDto } from "../common/dtos/page.dto";
import { PageMetaDto } from "../common/dtos/page-meta.dto";
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

@Injectable()
export class UserListStatsService {
  constructor(
    @InjectRepository(DbUserListContributor, "ApiConnection")
    private userListContributorRepository: Repository<DbUserListContributor>
  ) {}

  baseQueryBuilder(): SelectQueryBuilder<DbUserListContributor> {
    const builder = this.userListContributorRepository.createQueryBuilder("user_list_contributors");

    return builder;
  }

  async findContributorStatsByListId(
    pageOptionsDto: UserListMostActiveContributorsDto,
    listId: string
  ): Promise<PageDto<DbUserListContributorStat>> {
    const range = pageOptionsDto.range!;
    const now = new Date().toISOString();

    const queryBuilder = this.baseQueryBuilder();

    queryBuilder.innerJoin("users", "users", "user_list_contributors.user_id=users.id");

    switch (pageOptionsDto.contributorType) {
      case UserListContributorStatsTypeEnum.all:
        break;

      case UserListContributorStatsTypeEnum.active:
        this.applyActiveContributorsFilter(queryBuilder, now, range);
        break;

      case UserListContributorStatsTypeEnum.new:
        this.applyNewContributorsFilter(queryBuilder, now, range);
        break;

      case UserListContributorStatsTypeEnum.alumni: {
        this.applyAlumniContributorsFilter(queryBuilder, now, range);
        break;
      }

      default:
        break;
    }

    queryBuilder
      .select("users.login", "login")
      .andWhere("user_list_contributors.list_id = :listId", { listId })
      .addSelect(
        `(
          SELECT SUM("pull_requests"."commits")
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
        "prsCreated"
      );

    switch (pageOptionsDto.orderBy) {
      case UserListContributorStatsOrderEnum.commits:
        queryBuilder.orderBy(`"${UserListContributorStatsOrderEnum.commits}"`, pageOptionsDto.orderDirection);
        break;

      case UserListContributorStatsOrderEnum.prsCreated:
        queryBuilder.orderBy(`"${UserListContributorStatsOrderEnum.prsCreated}"`, pageOptionsDto.orderDirection);
        break;

      default:
        break;
    }

    const itemCount = await queryBuilder.getCount();
    const entities: DbUserListContributorStat[] = await queryBuilder.getRawMany();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
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

  getDateFrames(range = 30): Date[] {
    const currentDate = new Date();
    const frameDuration = range / 7;
    const dates: Date[] = [];

    // eslint-disable-next-line no-loops/no-loops
    for (let i = 0; i < 7; i++) {
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
            AND "pull_requests"."updated_at" > '${startDate}'::DATE - INTERVAL '${range} days'
            AND "pull_requests"."updated_at" <= '${startDate}'::DATE
        )::INTEGER`,
        "all_commits"
      )
      .addSelect(
        `(
          SELECT COALESCE(COUNT("pull_requests"."id"), 0)
          FROM "pull_requests"
          WHERE "pull_requests"."author_login" = "users"."login"
            AND "pull_requests"."updated_at" > '${startDate}'::DATE - INTERVAL '${range} days'
            AND "pull_requests"."updated_at" <= '${startDate}'::DATE
        )::INTEGER`,
        "all_prsCreated"
      );

    const queryBuilder = this.userListContributorRepository.manager
      .createQueryBuilder()
      .select(`SUM("subQ"."all_commits")`, "commits")
      .addSelect(`SUM("subQ"."all_prsCreated")`, "prsCreated")
      .from(`( ${subQueryBuilder.getQuery()} )`, "subQ")
      .setParameters(subQueryBuilder.getParameters());

    const entity: DbContributionStatTimeframe | undefined = await queryBuilder.getRawOne();

    if (!entity) {
      throw new NotFoundException();
    }

    entity.timeStart = startDate;
    entity.timeEnd = `${new Date(new Date(startDate).getTime() + range * 86400000).toISOString()}`;

    return entity;
  }

  async findContributionsByProject(listId: string): Promise<DbContributionsProjects[]> {
    // todo (jpmcb) - in the future we'll likely want to make this range dynamic.
    const range = 30;

    const queryBuilder = this.userListContributorRepository.manager
      .createQueryBuilder()
      .select("split_part(repos.full_name, '/', 1)", "orgId")
      .addSelect("split_part(repos.full_name, '/', 2)", "projectId")
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
      .groupBy("repos.full_name");

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
        WHERE "pull_requests"."updated_at" BETWEEN '${startDate}'::DATE - INTERVAL '${range} days'
          AND '${startDate}'::DATE
      )`,
        "current_month_prs",
        `"users"."login" = "current_month_prs"."author_login"`
      )
      .leftJoin(
        `(
        SELECT DISTINCT "author_login"
        FROM "pull_requests"
        WHERE "pull_requests"."updated_at" BETWEEN '${startDate}'::DATE - INTERVAL '${range + range} days'
          AND '${startDate}'::DATE - INTERVAL '${range} days'
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
              AND '${startDate}'::DATE
          )`,
        "current_month_prs",
        `"users"."login" = "current_month_prs"."author_login"`
      )
      .leftJoin(
        `(
            SELECT DISTINCT "author_login"
            FROM "pull_requests"
            WHERE "pull_requests"."updated_at" BETWEEN NOW() - INTERVAL '${range + range} days'
              AND '${startDate}'::DATE - INTERVAL "${range} days"
          )`,
        "previous_month_prs",
        `"users"."login" = "previous_month_prs"."author_login"`
      )
      .where(`"previous_month_prs"."author_login" IS NOT NULL`)
      .andWhere(`"current_month_prs"."author_login" IS NULL`);
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
            WHERE "pull_requests"."updated_at" BETWEEN '${startDate}'::DATE - INTERVAL '${range} days'
              AND '${startDate}'::DATE
          )`,
        "current_month_prs",
        `"users"."login" = "current_month_prs"."author_login"`
      )
      .leftJoin(
        `(
            SELECT DISTINCT "author_login"
            FROM "pull_requests"
            WHERE "pull_requests"."updated_at" BETWEEN '${startDate}'::DATE - INTERVAL '${range + range} days'
              AND '${startDate}'::DATE - INTERVAL '${range} days'
          )`,
        "previous_month_prs",
        `"users"."login" = "previous_month_prs"."author_login"`
      )
      .where(`"previous_month_prs"."author_login" IS NULL`)
      .andWhere(`"current_month_prs"."author_login" IS NOT NULL`);
  }
}
