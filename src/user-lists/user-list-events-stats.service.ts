import { Injectable } from "@nestjs/common";
import { Repository, SelectQueryBuilder } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { PageDto } from "../common/dtos/page.dto";
import { DbPullRequestGitHubEvents } from "../timescale/entities/pull_request_github_event";
import { DbUserListContributorStat } from "./entities/user-list-contributor-stats.entity";
import {
  UserListContributorStatsOrderEnum,
  UserListContributorStatsTypeEnum,
  UserListMostActiveContributorsDto,
} from "./dtos/most-active-contributors.dto";
import { ContributionPageMetaDto as ContributionsPageMetaDto } from "./dtos/contributions-pagemeta.dto";
import { ContributionsPageDto } from "./dtos/contributions-page.dto";
import { DbUserListContributor } from "./entities/user-list-contributor.entity";

interface AllContributionsCount {
  all_contributions: number;
}

@Injectable()
export class UserListEventsStatsService {
  constructor(
    @InjectRepository(DbPullRequestGitHubEvents, "TimescaleConnection")
    private pullRequestGithubEventsRepository: Repository<DbPullRequestGitHubEvents>,
    @InjectRepository(DbUserListContributor, "ApiConnection")
    private userListContributorRepository: Repository<DbUserListContributor>
  ) {}

  baseQueryBuilder(): SelectQueryBuilder<DbPullRequestGitHubEvents> {
    const builder = this.pullRequestGithubEventsRepository.createQueryBuilder();

    return builder;
  }

  private userListUsersQueryBuilder(): SelectQueryBuilder<DbUserListContributor> {
    const builder = this.userListContributorRepository.createQueryBuilder("user_list_contributors");

    return builder;
  }

  async findAllListContributorStats(
    pageOptionsDto: UserListMostActiveContributorsDto,
    listId: string
  ): Promise<PageDto<DbUserListContributorStat>> {
    const range = pageOptionsDto.range!;
    const now = new Date().toISOString();

    const userListUsersBuilder = this.userListUsersQueryBuilder();

    userListUsersBuilder
      .leftJoin("users", "users", "user_list_contributors.user_id=users.id")
      .where("user_list_contributors.list_id = :listId", { listId });

    const allUsers = await userListUsersBuilder.getMany();

    if (allUsers.length === 0) {
      return new ContributionsPageDto(
        new Array<DbUserListContributorStat>(),
        new ContributionsPageMetaDto({ itemCount: 0, pageOptionsDto }, 0)
      );
    }

    const users = allUsers.map((user) => (user.login ? user.login.toLowerCase() : user.username));

    const userListQueryBuilder =
      this.pullRequestGithubEventsRepository.manager.createQueryBuilder() as SelectQueryBuilder<DbPullRequestGitHubEvents>;

    userListQueryBuilder.select("DISTINCT users.login", "login");

    userListQueryBuilder
      .addSelect(
        `(SELECT COALESCE(sum(push_num_commits), 0)
          FROM push_github_events 
          WHERE LOWER(actor_login)=users.login
          AND push_ref IN ('refs/heads/main', 'refs/heads/master')
          AND now() - INTERVAL '${range} days' <= event_time)::INTEGER`,
        "commits"
      )
      .addSelect(
        `(SELECT COALESCE(count(event_id), 0)
        FROM pull_request_github_events 
        WHERE LOWER(actor_login)=users.login
        AND pr_action='opened'
        AND now() - INTERVAL '${range} days' <= event_time)::INTEGER`,
        "prs_created"
      )
      .addSelect(
        `(SELECT COALESCE(count(event_id), 0)
        FROM pull_request_review_github_events 
        WHERE LOWER(actor_login)=users.login
        AND pr_review_action='created'
        AND now() - INTERVAL '${range} days' <= event_time)::INTEGER`,
        "prs_reviewed"
      )
      .addSelect(
        `(SELECT COALESCE(count(event_id), 0)
        FROM issues_github_events 
        WHERE LOWER(actor_login)=users.login
        AND issue_action='opened'
        AND now() - INTERVAL '${range} days' <= event_time)::INTEGER`,
        "issues_created"
      )
      .addSelect(
        `(SELECT COALESCE(count(event_id), 0)
        FROM commit_comment_github_events 
        WHERE LOWER(actor_login)=users.login
        AND now() - INTERVAL '${range} days' <= event_time)::INTEGER`,
        "commit_comments"
      )
      .addSelect(
        `(SELECT COALESCE(count(event_id), 0)
        FROM issue_comment_github_events 
        WHERE LOWER(actor_login)=users.login
        AND now() - INTERVAL '${range} days' <= event_time)::INTEGER`,
        "issue_comments"
      )
      .addSelect(
        `(SELECT COALESCE(count(event_id), 0)
        FROM pull_request_review_comment_github_events 
        WHERE LOWER(actor_login)=users.login
        AND now() - INTERVAL '${range} days' <= event_time)::INTEGER`,
        "pr_review_comments"
      );

    userListQueryBuilder.from(
      (qb) =>
        qb
          .select("LOWER(actor_login)", "login")
          .distinct()
          .from(DbPullRequestGitHubEvents, "pull_request_github_events")
          .where("LOWER(actor_login) IN (:...users)", { users }),
      "users"
    );

    userListQueryBuilder.setParameters({ users });

    switch (pageOptionsDto.contributorType) {
      case UserListContributorStatsTypeEnum.all:
        break;

      case UserListContributorStatsTypeEnum.active:
        this.applyActiveContributorsFilter(userListQueryBuilder, now, range);
        break;

      case UserListContributorStatsTypeEnum.new:
        this.applyNewContributorsFilter(userListQueryBuilder, now, range);
        break;

      case UserListContributorStatsTypeEnum.alumni: {
        this.applyAlumniContributorsFilter(userListQueryBuilder, now, range);
        break;
      }

      default:
        break;
    }

    const entityQb = this.pullRequestGithubEventsRepository.manager
      .createQueryBuilder()
      .addCommonTableExpression(userListQueryBuilder, "CTE")
      .setParameters(userListQueryBuilder.getParameters())
      .select("login")
      .addSelect("commits")
      .addSelect("prs_created")
      .addSelect("prs_reviewed")
      .addSelect("issues_created")
      .addSelect("commit_comments")
      .addSelect("issue_comments")
      .addSelect("pr_review_comments")
      .addSelect(`("commit_comments" + "issue_comments" + "pr_review_comments") AS "comments"`)
      .addSelect(
        `("commits" + "prs_created" + "prs_reviewed" + "issues_created" + "commit_comments" + "issue_comments" + "pr_review_comments") AS "total_contributions"`
      )
      .from("CTE", "CTE")
      .offset(pageOptionsDto.skip)
      .limit(pageOptionsDto.limit);

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

    const allCountQb = this.pullRequestGithubEventsRepository.manager
      .createQueryBuilder()
      .addCommonTableExpression(userListQueryBuilder, "CTE")
      .setParameters(userListQueryBuilder.getParameters())
      .select(
        `SUM("commits" + "prs_created" + "prs_reviewed" + "issues_created" + "commit_comments" + "issue_comments" + "pr_review_comments") OVER () AS "all_contributions"`
      )
      .from("CTE", "CTE");

    const entities: DbUserListContributorStat[] = await entityQb.getRawMany();
    const allContributionsResult: AllContributionsCount | undefined = await allCountQb.getRawOne();

    if (!allContributionsResult) {
      return new ContributionsPageDto(
        new Array<DbUserListContributorStat>(),
        new ContributionsPageMetaDto({ itemCount: entities.length, pageOptionsDto }, 0)
      );
    }

    const allContributionsCount = allContributionsResult.all_contributions;

    const pageMetaDto = new ContributionsPageMetaDto(
      { itemCount: entities.length, pageOptionsDto },
      allContributionsCount
    );

    return new ContributionsPageDto(entities, pageMetaDto);
  }

  private applyActiveContributorsFilter(
    queryBuilder: SelectQueryBuilder<DbPullRequestGitHubEvents>,
    startDate: string,
    range = 30
  ) {
    queryBuilder
      .leftJoin(
        `(
        SELECT DISTINCT LOWER("actor_login") actor_login
        FROM "pull_request_github_events"
        WHERE "pull_request_github_events"."event_time" BETWEEN '${startDate}'::TIMESTAMP - INTERVAL '${range} days'
          AND '${startDate}'::TIMESTAMP
          AND LOWER(actor_login) IN (:...users)
      )`,
        "current_month_prs",
        `"users"."login" = "current_month_prs"."actor_login"`
      )
      .leftJoin(
        `(
        SELECT DISTINCT LOWER("actor_login") actor_login
        FROM "pull_request_github_events"
        WHERE "pull_request_github_events"."event_time" BETWEEN '${startDate}'::TIMESTAMP - INTERVAL '${
          range + range
        } days'
          AND '${startDate}'::TIMESTAMP - INTERVAL '${range} days'
          AND LOWER(actor_login) IN (:...users)
      )`,
        "previous_month_prs",
        `"users"."login" = "previous_month_prs"."actor_login"`
      )
      .where(`"previous_month_prs"."actor_login" IS NOT NULL`)
      .andWhere(`"current_month_prs"."actor_login" IS NOT NULL`);
  }

  private applyNewContributorsFilter(
    queryBuilder: SelectQueryBuilder<DbPullRequestGitHubEvents>,
    startDate: string,
    range = 30
  ) {
    queryBuilder
      .leftJoin(
        `(
            SELECT DISTINCT LOWER("actor_login") actor_login
            FROM "pull_request_github_events"
            WHERE "pull_request_github_events"."event_time" BETWEEN NOW() - INTERVAL '${range} days'
              AND '${startDate}'::TIMESTAMP
              AND LOWER(actor_login) IN (:...users)
          )`,
        "current_month_prs",
        `"users"."login" = "current_month_prs"."actor_login"`
      )
      .leftJoin(
        `(
            SELECT DISTINCT LOWER("actor_login") actor_login
            FROM "pull_request_github_events"
            WHERE "pull_request_github_events"."event_time" BETWEEN NOW() - INTERVAL '${range + range} days'
              AND '${startDate}'::TIMESTAMP - INTERVAL '${range} days'
              AND LOWER(actor_login) IN (:...users)
          )`,
        "previous_month_prs",
        `"users"."login" = "previous_month_prs"."actor_login"`
      )
      .where(`"previous_month_prs"."actor_login" IS NULL`)
      .andWhere(`"current_month_prs"."actor_login" IS NOT NULL`);
  }

  private applyAlumniContributorsFilter(
    queryBuilder: SelectQueryBuilder<DbPullRequestGitHubEvents>,
    startDate: string,
    range = 30
  ) {
    queryBuilder
      .leftJoin(
        `(
            SELECT DISTINCT LOWER("actor_login") actor_login
            FROM "pull_request_github_events"
            WHERE "pull_request_github_events"."event_time" BETWEEN '${startDate}'::TIMESTAMP - INTERVAL '${range} days'
              AND '${startDate}'::TIMESTAMP
              AND LOWER(actor_login) IN (:...users)
          )`,
        "current_month_prs",
        `"users"."login" = "current_month_prs"."actor_login"`
      )
      .leftJoin(
        `(
            SELECT DISTINCT LOWER("actor_login") actor_login
            FROM "pull_request_github_events"
            WHERE "pull_request_github_events"."event_time" BETWEEN '${startDate}'::TIMESTAMP - INTERVAL '${
          range + range
        } days'
              AND '${startDate}'::TIMESTAMP - INTERVAL '${range} days'
              AND LOWER(actor_login) IN (:...users)
          )`,
        "previous_month_prs",
        `"users"."login" = "previous_month_prs"."actor_login"`
      )
      .where(`"previous_month_prs"."actor_login" IS NOT NULL`)
      .andWhere(`"current_month_prs"."actor_login" IS NULL`);
  }
}
