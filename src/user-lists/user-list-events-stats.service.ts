import { Injectable } from "@nestjs/common";
import { Repository, SelectQueryBuilder } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { PageDto } from "../common/dtos/page.dto";
import { DbPullRequestGitHubEvents } from "../timescale/entities/pull_request_github_event.entity";
import { DbContributorStat } from "../timescale/entities/contributor_devstat.entity";
import { ContributionsPageDto } from "../timescale/dtos/contrib-page.dto";
import { ContributionPageMetaDto } from "../timescale/dtos/contrib-page-meta.dto";
import { ContributorDevstatsService } from "../timescale/contrib-stats.service";
import { ContributorStatsTypeEnum, MostActiveContributorsDto } from "../timescale/dtos/most-active-contrib.dto";
import { DbUserListContributor } from "./entities/user-list-contributor.entity";
import { ContributionsTimeframeDto } from "./dtos/contributions-timeframe.dto";
import { DbContributionStatTimeframe } from "./entities/contributions-timeframe.entity";
import { ContributionsByProjectDto } from "./dtos/contributions-by-project.dto";
import { DbContributionsProjects } from "./entities/contributions-projects.entity";
import { TopProjectsDto } from "./dtos/top-projects.dto";
import { DbContributorCategoryTimeframe } from "./entities/contributors-timeframe.entity";

@Injectable()
export class UserListEventsStatsService {
  constructor(
    @InjectRepository(DbPullRequestGitHubEvents, "TimescaleConnection")
    private pullRequestGithubEventsRepository: Repository<DbPullRequestGitHubEvents>,
    @InjectRepository(DbUserListContributor, "ApiConnection")
    private userListContributorRepository: Repository<DbUserListContributor>,
    private contributorDevstatsService: ContributorDevstatsService
  ) {}

  baseQueryBuilder(): SelectQueryBuilder<DbPullRequestGitHubEvents> {
    const builder = this.pullRequestGithubEventsRepository.createQueryBuilder();

    return builder;
  }

  private userListUsersQueryBuilder(): SelectQueryBuilder<DbUserListContributor> {
    const builder = this.userListContributorRepository.createQueryBuilder("user_list_contributors");

    return builder;
  }

  private eventsUnionCteBuilder(range: number): string {
    const cteBuilder = `
      SELECT event_type, event_time, repo_name, actor_login
      FROM push_github_events
      WHERE LOWER(actor_login) IN (:...users)
      AND push_ref IN('refs/heads/main', 'refs/heads/master')
      AND now() - INTERVAL '${range} days' <= event_time

      UNION ALL

      SELECT event_type, event_time, repo_name, actor_login
      FROM pull_request_github_events
      WHERE LOWER(actor_login) IN (:...users)
      AND pr_action='opened'
      AND now() - INTERVAL '${range} days' <= event_time

      UNION ALL

      SELECT event_type, event_time, repo_name, actor_login
      FROM pull_request_review_github_events
      WHERE LOWER(actor_login) IN (:...users)
      AND pr_review_action='created'
      AND now() - INTERVAL '${range} days' <= event_time

      UNION ALL

      SELECT event_type, event_time, repo_name, actor_login
      FROM issues_github_events
      WHERE LOWER(actor_login) IN (:...users)
      AND issue_action='opened'
      AND now() - INTERVAL '${range} days' <= event_time

      UNION ALL

      SELECT event_type, event_time, repo_name, actor_login
      FROM commit_comment_github_events
      WHERE LOWER(actor_login) IN (:...users)
      AND now() - INTERVAL '${range} days' <= event_time

      UNION ALL

      SELECT event_type, event_time, repo_name, actor_login
      FROM issue_comment_github_events
      WHERE LOWER(actor_login) IN (:...users)
      AND now() - INTERVAL '${range} days' <= event_time

      UNION ALL

      SELECT event_type, event_time, repo_name, actor_login
      FROM pull_request_review_comment_github_events
      WHERE LOWER(actor_login) IN (:...users)
      AND now() - INTERVAL '${range} days' <= event_time`;

    return cteBuilder;
  }

  async findContributorsByType(
    listId: string,
    range: number,
    type: ContributorStatsTypeEnum = ContributorStatsTypeEnum.all
  ): Promise<string[]> {
    const now = new Date().toISOString();

    const userListUsersBuilder = this.userListUsersQueryBuilder();

    userListUsersBuilder
      .leftJoin("users", "users", "user_list_contributors.user_id=users.id")
      .where("user_list_contributors.list_id = :listId", { listId });

    const allUsers = await userListUsersBuilder.getMany();

    if (allUsers.length === 0) {
      return [];
    }

    const users = allUsers
      .map((user) => (user.username ? user.username.toLowerCase() : ""))
      .filter((user) => user !== "");

    if (users.length === 0) {
      return [];
    }

    const userListQueryBuilder =
      this.pullRequestGithubEventsRepository.manager.createQueryBuilder() as SelectQueryBuilder<DbPullRequestGitHubEvents>;

    userListQueryBuilder.select("DISTINCT users.login", "login");

    userListQueryBuilder.from(
      (qb) =>
        qb
          .select("LOWER(actor_login)", "login")
          .distinct()
          .from(DbPullRequestGitHubEvents, "pull_request_github_events")
          .where("LOWER(actor_login) IN (:...users)", { users }),
      "users"
    );

    switch (type) {
      case ContributorStatsTypeEnum.all:
        break;

      case ContributorStatsTypeEnum.active:
        this.applyActiveContributorsFilter(userListQueryBuilder, now, range);
        break;

      case ContributorStatsTypeEnum.new:
        this.applyNewContributorsFilter(userListQueryBuilder, now, range);
        break;

      case ContributorStatsTypeEnum.alumni: {
        this.applyAlumniContributorsFilter(userListQueryBuilder, now, range);
        break;
      }

      default:
        break;
    }

    userListQueryBuilder.setParameters({ users });

    const entityQb = this.pullRequestGithubEventsRepository.manager
      .createQueryBuilder()
      .addCommonTableExpression(userListQueryBuilder, "CTE")
      .setParameters(userListQueryBuilder.getParameters())
      .select("login")
      .from("CTE", "CTE");

    const entities = await entityQb.getRawMany<{ login: string }>();

    return entities.map((result) => result.login);
  }

  async findAllListContributorStats(
    pageOptionsDto: MostActiveContributorsDto,
    listId: string
  ): Promise<PageDto<DbContributorStat>> {
    const userListUsersBuilder = this.userListUsersQueryBuilder();

    userListUsersBuilder
      .leftJoin("users", "users", "user_list_contributors.user_id=users.id")
      .where("user_list_contributors.list_id = :listId", { listId });

    const allUsers = await userListUsersBuilder.getMany();

    if (allUsers.length === 0) {
      return new ContributionsPageDto(
        new Array<DbContributorStat>(),
        new ContributionPageMetaDto({ itemCount: 0, pageOptionsDto }, 0)
      );
    }

    const users = allUsers
      .map((user) => (user.username ? user.username.toLowerCase() : ""))
      .filter((user) => user !== "");

    if (users.length === 0) {
      return new ContributionsPageDto(
        new Array<DbContributorStat>(),
        new ContributionPageMetaDto({ itemCount: 0, pageOptionsDto }, 0)
      );
    }

    return this.contributorDevstatsService.findAllContributorStats(pageOptionsDto, users);
  }

  async findContributionsInTimeFrame(
    options: ContributionsTimeframeDto,
    listId: string
  ): Promise<DbContributionStatTimeframe[]> {
    const range = options.range!;
    const contribType = options.contributorType;

    const allUsers = await this.findContributorsByType(listId, range, contribType);

    if (allUsers.length === 0) {
      return [];
    }

    const cteQuery = this.eventsUnionCteBuilder(range);

    const entityQb = this.pullRequestGithubEventsRepository.manager
      .createQueryBuilder()
      .addCommonTableExpression(cteQuery, "CTE")
      .setParameters({ users: allUsers })
      .select(`time_bucket('1 day', event_time)`, "bucket")
      .addSelect("COUNT(case when event_type = 'PushEvent' then 1 end)", "commits")
      .addSelect("COUNT(case when event_type = 'PullRequestEvent' then 1 end)", "prs_created")
      .addSelect("COUNT(case when event_type = 'PullRequestReviewEvent' then 1 end)", "prs_reviewed")
      .addSelect("COUNT(case when event_type = 'IssuesEvent' then 1 end)", "issues_created")
      .addSelect("COUNT(case when event_type = 'CommitCommentEvent' then 1 end)", "commit_comments")
      .addSelect("COUNT(case when event_type = 'IssueCommentEvent' then 1 end)", "issue_comments")
      .addSelect("COUNT(case when event_type = 'PullRequestReviewCommentEvent' then 1 end)", "pr_review_comments")
      .addSelect(
        `COUNT(case
          when event_type = 'CommitCommentEvent'
          or event_type = 'IssueCommentEvent'
          or event_type = 'PullRequestReviewCommentEvent'
          then 1 end
        )`,
        "comments"
      )
      .addSelect("COUNT(*)", "total_contributions")
      .from("CTE", "CTE")
      .groupBy("bucket")
      .orderBy("bucket", "DESC");

    const entities: DbContributionStatTimeframe[] = await entityQb.getRawMany();

    return entities;
  }

  async findContributionsByProject(
    options: ContributionsByProjectDto,
    listId: string
  ): Promise<DbContributionsProjects[]> {
    const range = options.range!;

    const allUsers = await this.findContributorsByType(listId, range);

    if (allUsers.length === 0) {
      return [];
    }

    const cteQuery = this.eventsUnionCteBuilder(range);

    const entityQb = this.pullRequestGithubEventsRepository.manager
      .createQueryBuilder()
      .addCommonTableExpression(cteQuery, "CTE")
      .setParameters({ users: allUsers })
      .select("repo_name", "repo_name")
      .addSelect("COUNT(case when event_type = 'PushEvent' then 1 end)", "commits")
      .addSelect("COUNT(case when event_type = 'PullRequestEvent' then 1 end)", "prs_created")
      .addSelect("COUNT(case when event_type = 'PullRequestReviewEvent' then 1 end)", "prs_reviewed")
      .addSelect("COUNT(case when event_type = 'IssuesEvent' then 1 end)", "issues_created")
      .addSelect("COUNT(case when event_type = 'CommitCommentEvent' then 1 end)", "commit_comments")
      .addSelect("COUNT(case when event_type = 'IssueCommentEvent' then 1 end)", "issue_comments")
      .addSelect("COUNT(case when event_type = 'PullRequestReviewCommentEvent' then 1 end)", "pr_review_comments")
      .addSelect(
        `COUNT(case
          when event_type = 'CommitCommentEvent'
          or event_type = 'IssueCommentEvent'
          or event_type = 'PullRequestReviewCommentEvent'
          then 1 end
        )`,
        "comments"
      )
      .addSelect("COUNT(*)", "total_contributions")
      .from("CTE", "CTE")
      .groupBy("repo_name");

    const entities: DbContributionsProjects[] = await entityQb.getRawMany();

    return entities;
  }

  async findTopContributorsByProject(options: TopProjectsDto, listId: string): Promise<DbContributorStat[]> {
    const range = options.range!;
    const { repo_name } = options;

    const allUsers = await this.findContributorsByType(listId, range);

    if (allUsers.length === 0) {
      return [];
    }

    const cteQuery = this.eventsUnionCteBuilder(range);

    const entityQb = this.pullRequestGithubEventsRepository.manager
      .createQueryBuilder()
      .addCommonTableExpression(cteQuery, "CTE")
      .setParameters({ users: allUsers })
      .select("actor_login", "login")
      .addSelect("COUNT(case when event_type = 'PushEvent' then 1 end)", "commits")
      .addSelect("COUNT(case when event_type = 'PullRequestEvent' then 1 end)", "prs_created")
      .addSelect("COUNT(case when event_type = 'PullRequestReviewEvent' then 1 end)", "prs_reviewed")
      .addSelect("COUNT(case when event_type = 'IssuesEvent' then 1 end)", "issues_created")
      .addSelect("COUNT(case when event_type = 'CommitCommentEvent' then 1 end)", "commit_comments")
      .addSelect("COUNT(case when event_type = 'IssueCommentEvent' then 1 end)", "issue_comments")
      .addSelect("COUNT(case when event_type = 'PullRequestReviewCommentEvent' then 1 end)", "pr_review_comments")
      .addSelect(
        `COUNT(case
          when event_type = 'CommitCommentEvent'
          or event_type = 'IssueCommentEvent'
          or event_type = 'PullRequestReviewCommentEvent'
          then 1 end
        )`,
        "comments"
      )
      .addSelect("COUNT(*)", "total_contributions")
      .where(`LOWER(repo_name) = '${repo_name}'`)
      .from("CTE", "CTE")
      .groupBy("login")
      .limit(25);

    const entities: DbContributionsProjects[] = await entityQb.getRawMany();

    return entities;
  }

  async findContributorCategoriesByTimeframe(
    options: ContributionsTimeframeDto,
    listId: string
  ): Promise<DbContributorCategoryTimeframe[]> {
    const range = options.range!;

    const allUsers = await this.findContributorsByType(listId, range, ContributorStatsTypeEnum.all);

    if (allUsers.length === 0) {
      return [];
    }

    const activeUsers = await this.findContributorsByType(listId, range, ContributorStatsTypeEnum.active);
    const newUsers = await this.findContributorsByType(listId, range, ContributorStatsTypeEnum.new);
    const alumniUsers = await this.findContributorsByType(listId, range, ContributorStatsTypeEnum.alumni);

    /*
     * it's possible that one of the filtered lists will have no returned users:
     * to guard against doing a blank WHERE IN() statment (which is not valid),
     * we add an empty username which selects for no users.
     */

    activeUsers.push("");
    newUsers.push("");
    alumniUsers.push("");

    /*
     * in order to get a sub-table that "time_bucket" can accumulate data from,
     * this large union query denotes a "contributor_category" for each of the user types
     * across many different event tables.
     */

    const cteQuery = `
      SELECT event_time, 'all_users' as contributor_category
      FROM push_github_events
      WHERE LOWER(actor_login) IN (:...all_users)
      AND push_ref IN('refs/heads/main', 'refs/heads/master')
      AND now() - INTERVAL '${range} days' <= event_time

      UNION ALL

      SELECT event_time, 'active_users' as contributor_category
      FROM push_github_events
      WHERE LOWER(actor_login) IN (:...active_users)
      AND push_ref IN('refs/heads/main', 'refs/heads/master')
      AND now() - INTERVAL '${range} days' <= event_time

      UNION ALL

      SELECT event_time, 'new_users' as contributor_category
      FROM push_github_events
      WHERE LOWER(actor_login) IN (:...new_users)
      AND push_ref IN('refs/heads/main', 'refs/heads/master')
      AND now() - INTERVAL '${range} days' <= event_time

      UNION ALL

      SELECT event_time, 'alumni_users' as contributor_category
      FROM push_github_events
      WHERE LOWER(actor_login) IN (:...alumni_users)
      AND push_ref IN('refs/heads/main', 'refs/heads/master')
      AND now() - INTERVAL '${range} days' <= event_time

      UNION ALL

      SELECT event_time, 'all_users' as contributor_category
      FROM pull_request_github_events
      WHERE LOWER(actor_login) IN (:...all_users)
      AND pr_action='opened'
      AND now() - INTERVAL '${range} days' <= event_time

      UNION ALL

      SELECT event_time, 'active_users' as contributor_category
      FROM pull_request_github_events
      WHERE LOWER(actor_login) IN (:...active_users)
      AND pr_action='opened'
      AND now() - INTERVAL '${range} days' <= event_time

      UNION ALL

      SELECT event_time, 'new_users' as contributor_category
      FROM pull_request_github_events
      WHERE LOWER(actor_login) IN (:...new_users)
      AND pr_action='opened'
      AND now() - INTERVAL '${range} days' <= event_time

      UNION ALL

      SELECT event_time, 'alumni_users' as contributor_category
      FROM pull_request_github_events
      WHERE LOWER(actor_login) IN (:...alumni_users)
      AND pr_action='opened'
      AND now() - INTERVAL '${range} days' <= event_time

      UNION ALL

      SELECT event_time, 'all_users' as contributor_category
      FROM pull_request_review_github_events
      WHERE LOWER(actor_login) IN (:...all_users)
      AND pr_review_action='created'
      AND now() - INTERVAL '${range} days' <= event_time

      UNION ALL

      SELECT event_time, 'active_users' as contributor_category
      FROM pull_request_review_github_events
      WHERE LOWER(actor_login) IN (:...active_users)
      AND pr_review_action='created'
      AND now() - INTERVAL '${range} days' <= event_time

      UNION ALL

      SELECT event_time, 'new_users' as contributor_category
      FROM pull_request_review_github_events
      WHERE LOWER(actor_login) IN (:...new_users)
      AND pr_review_action='created'
      AND now() - INTERVAL '${range} days' <= event_time

      UNION ALL

      SELECT event_time, 'alumni_users' as contributor_category
      FROM pull_request_review_github_events
      WHERE LOWER(actor_login) IN (:...alumni_users)
      AND pr_review_action='created'
      AND now() - INTERVAL '${range} days' <= event_time

      UNION ALL

      SELECT event_time, 'all_users' as contributor_category
      FROM issues_github_events
      WHERE LOWER(actor_login) IN (:...all_users)
      AND issue_action='opened'
      AND now() - INTERVAL '${range} days' <= event_time

      UNION ALL

      SELECT event_time, 'active_users' as contributor_category
      FROM issues_github_events
      WHERE LOWER(actor_login) IN (:...active_users)
      AND issue_action='opened'
      AND now() - INTERVAL '${range} days' <= event_time

      UNION ALL

      SELECT event_time, 'new_users' as contributor_category
      FROM issues_github_events
      WHERE LOWER(actor_login) IN (:...new_users)
      AND issue_action='opened'
      AND now() - INTERVAL '${range} days' <= event_time

      UNION ALL

      SELECT event_time, 'alumni_users' as contributor_category
      FROM issues_github_events
      WHERE LOWER(actor_login) IN (:...alumni_users)
      AND issue_action='opened'
      AND now() - INTERVAL '${range} days' <= event_time

      UNION ALL

      SELECT event_time, 'all_users' as contributor_category
      FROM commit_comment_github_events
      WHERE LOWER(actor_login) IN (:...all_users)
      AND now() - INTERVAL '${range} days' <= event_time

      UNION ALL

      SELECT event_time, 'active_users' as contributor_category
      FROM commit_comment_github_events
      WHERE LOWER(actor_login) IN (:...active_users)
      AND now() - INTERVAL '${range} days' <= event_time

      UNION ALL

      SELECT event_time, 'new_users' as contributor_category
      FROM commit_comment_github_events
      WHERE LOWER(actor_login) IN (:...new_users)
      AND now() - INTERVAL '${range} days' <= event_time

      UNION ALL

      SELECT event_time, 'alumni_users' as contributor_category
      FROM commit_comment_github_events
      WHERE LOWER(actor_login) IN (:...alumni_users)
      AND now() - INTERVAL '${range} days' <= event_time

      UNION ALL

      SELECT event_time, 'all_users' as contributor_category
      FROM issue_comment_github_events
      WHERE LOWER(actor_login) IN (:...all_users)
      AND now() - INTERVAL '${range} days' <= event_time

      UNION ALL

      SELECT event_time, 'active_users' as contributor_category
      FROM issue_comment_github_events
      WHERE LOWER(actor_login) IN (:...active_users)
      AND now() - INTERVAL '${range} days' <= event_time

      UNION ALL

      SELECT event_time, 'new_users' as contributor_category
      FROM issue_comment_github_events
      WHERE LOWER(actor_login) IN (:...new_users)
      AND now() - INTERVAL '${range} days' <= event_time

      UNION ALL

      SELECT event_time, 'alumni_users' as contributor_category
      FROM issue_comment_github_events
      WHERE LOWER(actor_login) IN (:...alumni_users)
      AND now() - INTERVAL '${range} days' <= event_time

      UNION ALL

      SELECT event_time, 'all_users' as contributor_category
      FROM pull_request_review_comment_github_events
      WHERE LOWER(actor_login) IN (:...all_users)
      AND now() - INTERVAL '${range} days' <= event_time

      UNION ALL

      SELECT event_time, 'active_users' as contributor_category
      FROM pull_request_review_comment_github_events
      WHERE LOWER(actor_login) IN (:...active_users)
      AND now() - INTERVAL '${range} days' <= event_time

      UNION ALL

      SELECT event_time, 'new_users' as contributor_category
      FROM pull_request_review_comment_github_events
      WHERE LOWER(actor_login) IN (:...new_users)
      AND now() - INTERVAL '${range} days' <= event_time

      UNION ALL

      SELECT event_time, 'alumni_users' as contributor_category
      FROM pull_request_review_comment_github_events
      WHERE LOWER(actor_login) IN (:...alumni_users)
      AND now() - INTERVAL '${range} days' <= event_time`;

    const entityQb = this.pullRequestGithubEventsRepository.manager
      .createQueryBuilder()
      .addCommonTableExpression(cteQuery, "CTE")
      .setParameters({ all_users: allUsers })
      .setParameters({ active_users: activeUsers })
      .setParameters({ new_users: newUsers })
      .setParameters({ alumni_users: alumniUsers })
      .select(`time_bucket('1 day', event_time)`, "bucket")
      .addSelect("COUNT(case when contributor_category = 'all_users' then 1 end)", "all")
      .addSelect("COUNT(case when contributor_category = 'active_users' then 1 end)", "active")
      .addSelect("COUNT(case when contributor_category = 'new_users' then 1 end)", "new")
      .addSelect("COUNT(case when contributor_category = 'alumni_users' then 1 end)", "alumni")
      .from("CTE", "CTE")
      .groupBy("bucket")
      .orderBy("bucket", "DESC");

    const entities: DbContributorCategoryTimeframe[] = await entityQb.getRawMany();

    return entities;
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
            WHERE "pull_request_github_events"."event_time" BETWEEN '${startDate}':: TIMESTAMP - INTERVAL '${range} days'
              AND '${startDate}':: TIMESTAMP
              AND LOWER(actor_login) IN (:...users)
        )`,
        "current_month_prs",
        `"users"."login" = "current_month_prs"."actor_login"`
      )
      .leftJoin(
        `(
          SELECT DISTINCT LOWER("actor_login") actor_login
            FROM "pull_request_github_events"
            WHERE "pull_request_github_events"."event_time" BETWEEN '${startDate}':: TIMESTAMP - INTERVAL '${
          range + range
        } days'
              AND '${startDate}':: TIMESTAMP - INTERVAL '${range} days'
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
              AND '${startDate}':: TIMESTAMP
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
              AND '${startDate}':: TIMESTAMP - INTERVAL '${range} days'
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
            WHERE "pull_request_github_events"."event_time" BETWEEN '${startDate}':: TIMESTAMP - INTERVAL '${range} days'
              AND '${startDate}':: TIMESTAMP
              AND LOWER(actor_login) IN (:...users)
        )`,
        "current_month_prs",
        `"users"."login" = "current_month_prs"."actor_login"`
      )
      .leftJoin(
        `(
          SELECT DISTINCT LOWER("actor_login") actor_login
            FROM "pull_request_github_events"
            WHERE "pull_request_github_events"."event_time" BETWEEN '${startDate}':: TIMESTAMP - INTERVAL '${
          range + range
        } days'
              AND '${startDate}':: TIMESTAMP - INTERVAL '${range} days'
              AND LOWER(actor_login) IN (:...users)
        )`,
        "previous_month_prs",
        `"users"."login" = "previous_month_prs"."actor_login"`
      )
      .where(`"previous_month_prs"."actor_login" IS NOT NULL`)
      .andWhere(`"current_month_prs"."actor_login" IS NULL`);
  }
}
