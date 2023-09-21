import { Injectable } from "@nestjs/common";
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

    const queryBuilder = this.baseQueryBuilder();

    queryBuilder.innerJoin("users", "users", "user_list_contributors.user_id=users.id");

    switch (pageOptionsDto.contributorType) {
      case UserListContributorStatsTypeEnum.all:
        break;

      case UserListContributorStatsTypeEnum.active:
        queryBuilder
          .leftJoin(
            `(
            SELECT DISTINCT "author_login"
            FROM "pull_requests"
            WHERE "pull_requests"."updated_at" BETWEEN NOW() - INTERVAL '${range} days'
              AND NOW()
          )`,
            "current_month_prs",
            `"users"."login" = "current_month_prs"."author_login"`
          )
          .leftJoin(
            `(
            SELECT DISTINCT "author_login"
            FROM "pull_requests"
            WHERE "pull_requests"."updated_at" BETWEEN NOW() - INTERVAL '${range + range} days'
              AND NOW() - INTERVAL '${range} days'
          )`,
            "previous_month_prs",
            `"users"."login" = "previous_month_prs"."author_login"`
          )
          .where(`"previous_month_prs"."author_login" IS NOT NULL`)
          .andWhere(`"current_month_prs"."author_login" IS NOT NULL`);
        break;

      case UserListContributorStatsTypeEnum.new:
        queryBuilder
          .leftJoin(
            `(
            SELECT DISTINCT "author_login"
            FROM "pull_requests"
            WHERE "pull_requests"."updated_at" BETWEEN NOW() - INTERVAL '${range} days'
              AND NOW()
          )`,
            "current_month_prs",
            `"users"."login" = "current_month_prs"."author_login"`
          )
          .leftJoin(
            `(
            SELECT DISTINCT "author_login"
            FROM "pull_requests"
            WHERE "pull_requests"."updated_at" BETWEEN NOW() - INTERVAL '${range + range} days'
              AND NOW() - INTERVAL '${range} days'
          )`,
            "previous_month_prs",
            `"users"."login" = "previous_month_prs"."author_login"`
          )
          .where(`"previous_month_prs"."author_login" IS NOT NULL`)
          .andWhere(`"current_month_prs"."author_login" IS NULL`);
        break;

      case UserListContributorStatsTypeEnum.alumni: {
        queryBuilder
          .leftJoin(
            `(
            SELECT DISTINCT "author_login"
            FROM "pull_requests"
            WHERE "pull_requests"."updated_at" BETWEEN NOW() - INTERVAL '${range} days'
              AND NOW()
          )`,
            "current_month_prs",
            `"users"."login" = "current_month_prs"."author_login"`
          )
          .leftJoin(
            `(
            SELECT DISTINCT "author_login"
            FROM "pull_requests"
            WHERE "pull_requests"."updated_at" BETWEEN NOW() - INTERVAL '${range + range} days'
              AND NOW() - INTERVAL '${range} days'
          )`,
            "previous_month_prs",
            `"users"."login" = "previous_month_prs"."author_login"`
          )
          .where(`"previous_month_prs"."author_login" IS NULL`)
          .andWhere(`"current_month_prs"."author_login" IS NOT NULL`);
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
}
