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
    type: UserListContributorStatsTypeEnum = UserListContributorStatsTypeEnum.all
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
    pageOptionsDto: UserListMostActiveContributorsDto,
    listId: string
  ): Promise<PageDto<DbUserListContributorStat>> {
    const range = pageOptionsDto.range!;

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

    const users = allUsers
      .map((user) => (user.username ? user.username.toLowerCase() : ""))
      .filter((user) => user !== "");

    if (users.length === 0) {
      return new ContributionsPageDto(
        new Array<DbUserListContributorStat>(),
        new ContributionsPageMetaDto({ itemCount: 0, pageOptionsDto }, 0)
      );
    }

    const usersCte = this.pullRequestGithubEventsRepository.manager
      .createQueryBuilder()
      .select("DISTINCT LOWER(actor_login) as login")
      .from("pull_request_github_events", "pull_request_github_events")
      .where(`LOWER(actor_login) IN (:...users)`, { users })
      .groupBy(`login`);

    const commitsCte = this.pullRequestGithubEventsRepository.manager
      .createQueryBuilder()
      .select("LOWER(actor_login)", "actor_login")
      .addSelect("COALESCE(sum(push_num_commits), 0) AS commits")
      .from("push_github_events", "push_github_events")
      .where(`LOWER(actor_login) IN (:...users)`, { users })
      .andWhere("push_ref IN ('refs/heads/main', 'refs/heads/master')")
      .andWhere(`now() - INTERVAL '${range} days' <= event_time`)
      .groupBy("LOWER(actor_login)");

    const prsCreatedCte = this.pullRequestGithubEventsRepository.manager
      .createQueryBuilder()
      .select("LOWER(actor_login)", "actor_login")
      .addSelect("COALESCE(COUNT(*), 0) AS prs_created")
      .from("pull_request_github_events", "pull_request_github_events")
      .where(`LOWER(actor_login) IN (:...users)`, { users })
      .andWhere("pr_action = 'opened'")
      .andWhere(`now() - INTERVAL '${range} days' <= event_time`)
      .groupBy("LOWER(actor_login)");

    const prsReviewedCte = this.pullRequestGithubEventsRepository.manager
      .createQueryBuilder()
      .select("LOWER(actor_login)", "actor_login")
      .addSelect("COALESCE(COUNT(*), 0) AS prs_reviewed")
      .from("pull_request_review_github_events", "pull_request_review_github_events")
      .where(`LOWER(actor_login) IN (:...users)`, { users })
      .andWhere("pr_review_action = 'created'")
      .andWhere(`now() - INTERVAL '${range} days' <= event_time`)
      .groupBy("LOWER(actor_login)");

    const issuesCreatedCte = this.pullRequestGithubEventsRepository.manager
      .createQueryBuilder()
      .select("LOWER(actor_login)", "actor_login")
      .addSelect("COALESCE(COUNT(*), 0) AS issues_created")
      .from("issues_github_events", "issues_github_events")
      .where(`LOWER(actor_login) IN (:...users)`, { users })
      .andWhere("issue_action = 'opened'")
      .andWhere(`now() - INTERVAL '${range} days' <= event_time`)
      .groupBy("LOWER(actor_login)");

    const commitCommentsCte = this.pullRequestGithubEventsRepository.manager
      .createQueryBuilder()
      .select("LOWER(actor_login)", "actor_login")
      .addSelect("COALESCE(COUNT(*), 0) AS commit_comments")
      .from("commit_comment_github_events", "commit_comment_github_events")
      .where(`LOWER(actor_login) IN (:...users)`, { users })
      .andWhere(`now() - INTERVAL '${range} days' <= event_time`)
      .groupBy("LOWER(actor_login)");

    const issueCommentsCte = this.pullRequestGithubEventsRepository.manager
      .createQueryBuilder()
      .select("LOWER(actor_login)", "actor_login")
      .addSelect("COALESCE(COUNT(*), 0) AS issue_comments")
      .from("issue_comment_github_events", "issue_comment_github_events")
      .where(`LOWER(actor_login) IN (:...users)`, { users })
      .andWhere(`now() - INTERVAL '${range} days' <= event_time`)
      .groupBy("LOWER(actor_login)");

    const prReviewCommentsCte = this.pullRequestGithubEventsRepository.manager
      .createQueryBuilder()
      .select("LOWER(actor_login)", "actor_login")
      .addSelect("COALESCE(COUNT(*), 0) AS pr_review_comments")
      .from("pull_request_review_comment_github_events", "pull_request_review_comment_github_events")
      .where(`LOWER(actor_login) IN (:...users)`, { users })
      .andWhere(`now() - INTERVAL '${range} days' <= event_time`)
      .groupBy("LOWER(actor_login)");

    switch (pageOptionsDto.contributorType) {
      case UserListContributorStatsTypeEnum.all:
        usersCte.andWhere(`event_time >= now() - INTERVAL '${range} days'`);
        break;

      case UserListContributorStatsTypeEnum.active:
        /*
         * pr authors who have contributed in the last 2 date ranges (i.e., for a 30 day,
         * 1 month date range, we should look back 60 days) are considered "active"
         */
        usersCte
          .andWhere(`event_time >= now() - INTERVAL '${range * 2} days'`)
          .having(
            `COUNT(CASE WHEN event_time BETWEEN now() - INTERVAL '${range} days'
            AND now() THEN 1 END) > 0`
          )
          .andHaving(
            `COUNT(CASE WHEN event_time BETWEEN now() - INTERVAL '${range * 2} days'
             AND now() - INTERVAL '${range} days' THEN 1 END) > 0`
          );
        break;

      case UserListContributorStatsTypeEnum.new:
        /*
         * pr authors who have contributed in the current date range
         * but not the previous date range (i.e., for a 30 day range, users who have
         * contributed in the last 30 days but not 30-60 days ago) would be considered "new"
         */
        usersCte
          .andWhere(`event_time >= now() - INTERVAL '${range * 2} days'`)
          .having(
            `COUNT(CASE WHEN event_time BETWEEN now() - INTERVAL '${range} days'
            AND now() THEN 1 END) > 0`
          )
          .andHaving(
            `COUNT(CASE WHEN event_time BETWEEN now() - INTERVAL '${range * 2} days'
             AND now() - INTERVAL '${range} days' THEN 1 END) = 0`
          );
        break;

      case UserListContributorStatsTypeEnum.alumni: {
        /*
         * pr authors who have not contributed in the current date range
         * but have in the previous date range (i.e., for a 30 day range, users who have not
         * contributed in the last 30 days but have 30-60 days ago) would be considered "alumni"
         */
        usersCte
          .andWhere(`event_time >= now() - INTERVAL '${range * 2} days'`)
          .having(
            `COUNT(CASE WHEN event_time BETWEEN now() - INTERVAL '${range} days'
            AND now() THEN 1 END) = 0`
          )
          .andHaving(
            `COUNT(CASE WHEN event_time BETWEEN now() - INTERVAL '${range * 2} days'
             AND now() - INTERVAL '${range} days' THEN 1 END) > 0`
          );
        break;
      }

      default:
        usersCte.andWhere(`event_time >= now() - INTERVAL '${range} days'`);
        break;
    }

    const entityQb = this.pullRequestGithubEventsRepository.manager
      .createQueryBuilder()
      .addCommonTableExpression(usersCte, "users")
      .setParameters(usersCte.getParameters())
      .addCommonTableExpression(commitsCte, "commits_agg")
      .setParameters(commitsCte.getParameters())
      .addCommonTableExpression(prsCreatedCte, "prs_created_agg")
      .setParameters(prsCreatedCte.getParameters())
      .addCommonTableExpression(prsReviewedCte, "prs_reviewed_agg")
      .setParameters(prsReviewedCte.getParameters())
      .addCommonTableExpression(issuesCreatedCte, "issues_created_agg")
      .setParameters(issuesCreatedCte.getParameters())
      .addCommonTableExpression(commitCommentsCte, "commit_comments_agg")
      .setParameters(commitCommentsCte.getParameters())
      .addCommonTableExpression(issueCommentsCte, "issue_comments_agg")
      .setParameters(issueCommentsCte.getParameters())
      .addCommonTableExpression(prReviewCommentsCte, "pr_review_comments_agg")
      .setParameters(prReviewCommentsCte.getParameters())
      .select("users.login")
      .addSelect("COALESCE(commits_agg.commits, 0)::INTEGER AS commits")
      .addSelect("COALESCE(prs_created_agg.prs_created, 0)::INTEGER AS prs_created")
      .addSelect("COALESCE(prs_reviewed_agg.prs_reviewed, 0)::INTEGER AS prs_reviewed")
      .addSelect("COALESCE(issues_created_agg.issues_created, 0)::INTEGER AS issues_created")
      .addSelect("COALESCE(commit_comments_agg.commit_comments, 0)::INTEGER AS commit_comments")
      .addSelect(
        `
          COALESCE(commits, 0)::INTEGER +
          COALESCE(prs_created, 0)::INTEGER +
          COALESCE(prs_reviewed, 0)::INTEGER +
          COALESCE(issues_created, 0)::INTEGER +
          COALESCE(commit_comments, 0)::INTEGER AS total_contributions
      `
      )
      .from("users", "users")
      .leftJoin("commits_agg", "commits_agg", "users.login = commits_agg.actor_login")
      .leftJoin("prs_created_agg", "prs_created_agg", "users.login = prs_created_agg.actor_login")
      .leftJoin("prs_reviewed_agg", "prs_reviewed_agg", "users.login = prs_reviewed_agg.actor_login")
      .leftJoin("issues_created_agg", "issues_created_agg", "users.login = issues_created_agg.actor_login")
      .leftJoin("commit_comments_agg", "commit_comments_agg", "users.login = commit_comments_agg.actor_login")
      .leftJoin("issue_comments_agg", "issue_comments_agg", "commits_agg.actor_login = issue_comments_agg.actor_login")
      .leftJoin("pr_review_comments_agg", "pr_review_comments_agg", "users.login = pr_review_comments_agg.actor_login");

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

    const cteCounter = entityQb.clone();
    const cteCounterResult = await cteCounter.getRawMany();

    entityQb.offset(pageOptionsDto.skip).limit(pageOptionsDto.limit);

    const entities: DbUserListContributorStat[] = await entityQb.getRawMany();

    let totalCount = 0;

    entities.forEach((entity) => {
      totalCount += entity.total_contributions;
    });

    const pageMetaDto = new ContributionsPageMetaDto(
      { itemCount: cteCounterResult.length, pageOptionsDto },
      totalCount
    );

    return new ContributionsPageDto(entities, pageMetaDto);
  }

  async findContributionsInTimeFrame(
    options: ContributionsTimeframeDto,
    listId: string
  ): Promise<DbContributionStatTimeframe[]> {
    const range = options.range!;
    const contribType = options.contributorType!;

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

  async findTopContributorsByProject(options: TopProjectsDto, listId: string): Promise<DbUserListContributorStat[]> {
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

    const allUsers = await this.findContributorsByType(listId, range, UserListContributorStatsTypeEnum.all);

    if (allUsers.length === 0) {
      return [];
    }

    const activeUsers = await this.findContributorsByType(listId, range, UserListContributorStatsTypeEnum.active);
    const newUsers = await this.findContributorsByType(listId, range, UserListContributorStatsTypeEnum.new);
    const alumniUsers = await this.findContributorsByType(listId, range, UserListContributorStatsTypeEnum.alumni);

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
