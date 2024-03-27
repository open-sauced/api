import { Injectable } from "@nestjs/common";
import { Repository, SelectQueryBuilder } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { PageDto } from "../common/dtos/page.dto";
import { DbPullRequestGitHubEvents } from "./entities/pull_request_github_event.entity";
import {
  ContributorStatsOrderEnum,
  ContributorStatsTypeEnum,
  MostActiveContributorsDto,
} from "./dtos/most-active-contrib.dto";
import { DbContributorStat } from "./entities/contributor_devstat.entity";
import { ContributionPageMetaDto } from "./dtos/contrib-page-meta.dto";
import { ContributionsPageDto } from "./dtos/contrib-page.dto";

@Injectable()
export class ContributorDevstatsService {
  constructor(
    @InjectRepository(DbPullRequestGitHubEvents, "TimescaleConnection")
    private pullRequestGithubEventsRepository: Repository<DbPullRequestGitHubEvents>
  ) {}

  baseQueryBuilder(): SelectQueryBuilder<DbPullRequestGitHubEvents> {
    const builder = this.pullRequestGithubEventsRepository.createQueryBuilder();

    return builder;
  }

  /*
   * warning! It is assumed that the "users" string input is already valid.
   * make all best efforts to validate and filter invalid user strings before calling this
   */
  async findAllContributorStats(
    pageOptionsDto: MostActiveContributorsDto,
    users: string[]
  ): Promise<PageDto<DbContributorStat>> {
    const range = pageOptionsDto.range!;

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
      case ContributorStatsTypeEnum.all:
        usersCte.andWhere(`event_time >= now() - INTERVAL '${range} days'`);
        break;

      case ContributorStatsTypeEnum.active:
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

      case ContributorStatsTypeEnum.new:
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

      case ContributorStatsTypeEnum.alumni: {
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
      case ContributorStatsOrderEnum.commits:
        entityQb.orderBy(`"${ContributorStatsOrderEnum.commits}"`, pageOptionsDto.orderDirection);
        break;

      case ContributorStatsOrderEnum.prs_created:
        entityQb.orderBy(`"${ContributorStatsOrderEnum.prs_created}"`, pageOptionsDto.orderDirection);
        break;

      case ContributorStatsOrderEnum.total_contributions:
        entityQb.orderBy(`"${ContributorStatsOrderEnum.total_contributions}"`, pageOptionsDto.orderDirection);
        break;

      default:
        break;
    }

    const cteCounter = entityQb.clone();
    const cteCounterResult = await cteCounter.getRawMany();

    entityQb.offset(pageOptionsDto.skip).limit(pageOptionsDto.limit);

    const entities: DbContributorStat[] = await entityQb.getRawMany();

    let totalCount = 0;

    entities.forEach((entity) => {
      totalCount += entity.total_contributions;
    });

    const pageMetaDto = new ContributionPageMetaDto({ itemCount: cteCounterResult.length, pageOptionsDto }, totalCount);

    return new ContributionsPageDto(entities, pageMetaDto);
  }
}
