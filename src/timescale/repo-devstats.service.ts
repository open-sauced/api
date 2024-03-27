import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as math from "mathjs";
import { PageOptionsDto } from "../common/dtos/page-options.dto";
import { avgRepoActivityRatioSample } from "../common/calculations/avg-repo-activity-ratio-sample";
import { PageDto } from "../common/dtos/page.dto";
import { PageMetaDto } from "../common/dtos/page-meta.dto";
import { DbRepoContributor } from "../repo/entities/repo_contributors.entity";
import { DbPullRequestGitHubEvents } from "./entities/pull_request_github_event.entity";
import { DbIssuesGitHubEvents } from "./entities/issues_github_event.entity";
import { DbPushGitHubEvents } from "./entities/push_github_events.entity";
import { DbWatchGitHubEvents } from "./entities/watch_github_events.entity";
import { DbForkGitHubEvents } from "./entities/fork_github_events.entity";

@Injectable()
export class RepoDevstatsService {
  constructor(
    @InjectRepository(DbPullRequestGitHubEvents, "TimescaleConnection")
    private pullRequestGithubEventsRepository: Repository<DbPullRequestGitHubEvents>,
    @InjectRepository(DbIssuesGitHubEvents, "TimescaleConnection")
    private issuesGithubEventsRepository: Repository<DbIssuesGitHubEvents>,
    @InjectRepository(DbPushGitHubEvents, "TimescaleConnection")
    private pushGithubEventsRepository: Repository<DbPushGitHubEvents>,
    @InjectRepository(DbWatchGitHubEvents, "TimescaleConnection")
    private watchGitHubEventsRepository: Repository<DbWatchGitHubEvents>,
    @InjectRepository(DbForkGitHubEvents, "TimescaleConnection")
    private forkGitHubEventsRepository: Repository<DbForkGitHubEvents>
  ) {
    // defines quantile boundaries (ignore lower 5% and upper 95% percentiles)
    const lowerQ = 0.05;
    const upperQ = 0.75;

    // calculate quantile values using the constant sampled activity ratios
    this.lowerBound = math.quantileSeq(avgRepoActivityRatioSample, lowerQ) as number;
    this.upperBound = math.quantileSeq(avgRepoActivityRatioSample, upperQ) as number;
  }

  private lowerBound: number;
  private upperBound: number;

  private winsorizeAndNormalizeRatio(ratio: number): number {
    /*
     * winsorizing the data uses the upper and lower bounds to ignore extreme
     * data samples and outliers.
     * See the following for more detail: https://en.wikipedia.org/wiki/Winsorizing
     */
    const winsorizedRatio = Math.max(this.lowerBound, Math.min(ratio, this.upperBound));

    /*
     * normalizing the data gives us a common, human readable ratio between 0 - 10
     * that denotes the activity ratio.
     */
    const normalized = ((winsorizedRatio - this.lowerBound) / (this.upperBound - this.lowerBound)) * 10;

    return normalized;
  }

  async calculateRepoActivityRatio(repoName: string, range: number): Promise<number> {
    // push events subquery
    const pushCteBuilder = this.pushGithubEventsRepository
      .createQueryBuilder("push_github_events")
      .select("time_bucket('1 day', event_time)", "day")
      .addSelect("repo_name")
      .addSelect("COUNT(DISTINCT LOWER(actor_login))", "contributors")
      .where(`LOWER(repo_name) = LOWER(:repoName)`, { repoName })
      .andWhere(`now() - INTERVAL '${range} days' <= event_time`)
      .groupBy("day")
      .addGroupBy("repo_name");

    // issues github events CTE
    const issuesCteBuilder = this.issuesGithubEventsRepository
      .createQueryBuilder("issues_github_events")
      .select("time_bucket('1 day', event_time)", "day")
      .addSelect("repo_name")
      .addSelect("SUM(issue_comments)", "daily_comments")
      .where(`LOWER(repo_name) = LOWER(:repoName)`, { repoName })
      .andWhere(`now() - INTERVAL '${range} days' <= event_time`)
      .groupBy("day")
      .addGroupBy("repo_name");

    // pull request github events subquery
    const prCteBuilder = this.pullRequestGithubEventsRepository
      .createQueryBuilder("pull_request_github_events")
      .select("time_bucket('1 day', event_time)", "day")
      .addSelect("repo_name")
      .addSelect("SUM(pr_commits)", "daily_pr_commits")
      .where(`LOWER(repo_name) = LOWER(:repoName)`, { repoName })
      .andWhere(`now() - INTERVAL '${range} days' <= event_time`)
      .groupBy("day")
      .addGroupBy("repo_name");

    const queryBuilder = this.pullRequestGithubEventsRepository.manager
      .createQueryBuilder()
      .addCommonTableExpression(pushCteBuilder, "contributors")
      .setParameters(pushCteBuilder.getParameters())
      .addCommonTableExpression(issuesCteBuilder, "issues")
      .setParameters(pushCteBuilder.getParameters())
      .addCommonTableExpression(prCteBuilder, "prs")
      .setParameters(pushCteBuilder.getParameters())
      .select("AVG(calculated_activity)", "avg_calculated_activity")
      .from(
        `(SELECT
          co.day,
          co.repo_name,
          COALESCE((issues.daily_comments + pr.daily_pr_commits) / NULLIF(co.contributors, 0), 0) AS calculated_activity
        FROM
          contributors co
        LEFT JOIN issues ON co.day = issues.day
          AND co.repo_name = issues.repo_name
        LEFT JOIN prs pr ON co.day = pr.day
          AND co.repo_name = pr.repo_name
        ORDER BY co.day DESC)`,
        "average_activity"
      );

    const result = await queryBuilder.getRawOne<{ avg_calculated_activity: number }>();
    const parsedResult = parseFloat(`${result?.avg_calculated_activity ?? "0"}`);

    return this.winsorizeAndNormalizeRatio(parsedResult);
  }

  private async calculateStarGazerConfidence(repoName: string, range: number): Promise<number> {
    let result = 0;

    // gets relevant star gazers for the repo
    const starGazersQuery = this.watchGitHubEventsRepository.manager
      .createQueryBuilder()
      .select("DISTINCT LOWER(actor_login) as login")
      .from("watch_github_events", "watch_github_events")
      .where("LOWER(repo_name) = LOWER(:repoName)", { repoName })
      .andWhere(`now() - INTERVAL '${range} days' <= event_time`);

    const allStarGazers = await starGazersQuery.getRawMany<{ login: string }>();

    if (allStarGazers.length === 0) {
      return result;
    }

    const starGazers = allStarGazers
      .map((starGazer) => (starGazer.login ? starGazer.login.toLowerCase() : ""))
      .filter((starGazer) => starGazer !== "");

    if (starGazers.length === 0) {
      return result;
    }

    const starGazersContributingReposQuery = this.pullRequestGithubEventsRepository.manager
      .createQueryBuilder()
      .select("count(DISTINCT repo_name) as contributing_repos")
      .addSelect("pr_author_login")
      .from("pull_request_github_events", "pull_request_github_events")
      .where("LOWER(pr_author_login) IN (:...logins)", { logins: starGazers })
      .andWhere(`now() - INTERVAL '${range} days' <= event_time`)
      .groupBy("pr_author_login");

    const starGazersContributingReposCount = await starGazersContributingReposQuery.getRawMany<{
      contributing_repos: number;
      pr_author_login: string;
    }>();

    starGazersContributingReposCount.forEach((repoCount) => {
      if (repoCount.contributing_repos > 1) {
        result += 0.1;
      }
    });

    return result / starGazers.length;
  }

  private async calculateForkerConfidence(repoName: string, range: number): Promise<number> {
    let result = 0;

    // gets relevant forkers for the repo over range of days
    const forkerQuery = this.forkGitHubEventsRepository.manager
      .createQueryBuilder()
      .select("DISTINCT LOWER(actor_login) as login")
      .from("fork_github_events", "fork_github_events")
      .where("LOWER(repo_name) = LOWER(:repoName)", { repoName })
      .andWhere(`now() - INTERVAL '${range} days' <= event_time`);

    const allForkers = await forkerQuery.getRawMany<{ login: string }>();

    if (allForkers.length === 0) {
      return result;
    }

    const forkers = allForkers
      .map((forker) => (forker.login ? forker.login.toLowerCase() : ""))
      .filter((forker) => forker !== "");

    if (forkers.length === 0) {
      return result;
    }

    const forkerContributingReposQuery = this.pullRequestGithubEventsRepository.manager
      .createQueryBuilder()
      .select("count(DISTINCT repo_name) as contributing_repos")
      .addSelect("pr_author_login")
      .from("pull_request_github_events", "pull_request_github_events")
      .where("LOWER(pr_author_login) IN (:...logins)", { logins: forkers })
      .andWhere(`now() - INTERVAL '${range} days' <= event_time`)
      .groupBy("pr_author_login");

    const forkerContributingReposCount = await forkerContributingReposQuery.getRawMany<{
      contributing_repos: number;
      pr_author_login: string;
    }>();

    forkerContributingReposCount.forEach((repoCount) => {
      if (repoCount.contributing_repos > 1) {
        // forking is weighted slightly higher than simply watching a repo
        result += 0.5;
      }
    });

    return result / forkers.length;
  }

  /*
   * this is a proof of concept metric called the "Contributor Confidence".
   *
   * the confidence score is a percentage metric that determines if certain activity on a
   * repository (staring, forking, etc.) may result in a meaningful contribution. This can be
   * used to determine how likely "fly by" contributors who've contributed meaningfully elsewhere
   * within a given time range, are to contribute meaningfully back to the project in question
   *
   * Currently the algorithm exists as:
   * --------------------------------------------------------------------------
   *
   * For all stargazers over the time range:
   *   Check if those users have more than one contribution to 2 or more projects:
   *     Add 0.1 to score
   *
   * For all forkers over the time range:
   *   Check if those users have more than one contribution to 2 or more projects:
   *     Add 0.5 to score (forks weight slightly higher)
   *
   * Finally, calculate:
   *   score / (# stargazers + forkers) within time range
   *     = confidence score as a percentage
   */
  async calculateContributorConfidence(repoName: string, range: number): Promise<number> {
    const forkerConfidence = await this.calculateForkerConfidence(repoName, range);
    const starGazerConfidence = await this.calculateStarGazerConfidence(repoName, range);

    return (forkerConfidence + starGazerConfidence) / 2;
  }

  /*
   * this method is very similar to finding user list contributor stats but instead
   * filters on owner/repo for a given github repo name. It also derives the
   * users from distinct pull request contributors to that given repo in the given date range
   */
  async findRepoContributorStats(
    owner: string,
    repo: string,
    pageOptionsDto: PageOptionsDto
  ): Promise<PageDto<DbRepoContributor>> {
    if (!owner) {
      throw new BadRequestException("owner must be a valid github owner");
    }

    if (!repo) {
      throw new BadRequestException("repo must be a valid github repo");
    }

    const repoName = `${owner}/${repo}`.toLowerCase();
    const range = pageOptionsDto.range!;

    const usersQuery = this.pullRequestGithubEventsRepository.manager
      .createQueryBuilder()
      .select("DISTINCT LOWER(actor_login) as login")
      .from("pull_request_github_events", "pull_request_github_events")
      .where("LOWER(repo_name) = LOWER(:repoName)", { repoName })
      .andWhere(`now() - INTERVAL '${range} days' <= event_time`)
      .groupBy(`login`);

    const allUsers = await usersQuery.getRawMany<{ login: string }>();

    if (allUsers.length === 0) {
      return new PageDto(new Array<DbRepoContributor>(), new PageMetaDto({ itemCount: 0, pageOptionsDto }));
    }

    const users = allUsers.map((user) => (user.login ? user.login.toLowerCase() : "")).filter((user) => user !== "");

    if (users.length === 0) {
      return new PageDto(new Array<DbRepoContributor>(), new PageMetaDto({ itemCount: 0, pageOptionsDto }));
    }

    const usersCte = this.pullRequestGithubEventsRepository.manager
      .createQueryBuilder()
      .select("DISTINCT LOWER(actor_login) as login")
      .from("pull_request_github_events", "pull_request_github_events")
      .where(`LOWER(actor_login) IN (:...users)`, { users })
      .andWhere("LOWER(repo_name) = LOWER(:repoName)", { repoName })
      .andWhere(`now() - INTERVAL '${range} days' <= event_time`)
      .groupBy(`login`);

    const commitsCte = this.pullRequestGithubEventsRepository.manager
      .createQueryBuilder()
      .select("LOWER(actor_login)", "actor_login")
      .addSelect("COALESCE(sum(push_num_commits), 0) AS commits")
      .from("push_github_events", "push_github_events")
      .where(`LOWER(actor_login) IN (:...users)`, { users })
      .andWhere("push_ref IN ('refs/heads/main', 'refs/heads/master')")
      .andWhere(`now() - INTERVAL '${range} days' <= event_time`)
      .andWhere("LOWER(repo_name) = LOWER(:repoName)", { repoName })
      .groupBy("LOWER(actor_login)");

    const prsCreatedCte = this.pullRequestGithubEventsRepository.manager
      .createQueryBuilder()
      .select("LOWER(actor_login)", "actor_login")
      .addSelect("COALESCE(COUNT(*), 0) AS prs_created")
      .from("pull_request_github_events", "pull_request_github_events")
      .where(`LOWER(actor_login) IN (:...users)`, { users })
      .andWhere("pr_action = 'opened'")
      .andWhere(`now() - INTERVAL '${range} days' <= event_time`)
      .andWhere("LOWER(repo_name) = LOWER(:repoName)", { repoName })
      .groupBy("LOWER(actor_login)");

    const prsReviewedCte = this.pullRequestGithubEventsRepository.manager
      .createQueryBuilder()
      .select("LOWER(actor_login)", "actor_login")
      .addSelect("COALESCE(COUNT(*), 0) AS prs_reviewed")
      .from("pull_request_review_github_events", "pull_request_review_github_events")
      .where(`LOWER(actor_login) IN (:...users)`, { users })
      .andWhere("pr_review_action = 'created'")
      .andWhere(`now() - INTERVAL '${range} days' <= event_time`)
      .andWhere("LOWER(repo_name) = LOWER(:repoName)", { repoName })
      .groupBy("LOWER(actor_login)");

    const issuesCreatedCte = this.pullRequestGithubEventsRepository.manager
      .createQueryBuilder()
      .select("LOWER(actor_login)", "actor_login")
      .addSelect("COALESCE(COUNT(*), 0) AS issues_created")
      .from("issues_github_events", "issues_github_events")
      .where(`LOWER(actor_login) IN (:...users)`, { users })
      .andWhere("issue_action = 'opened'")
      .andWhere(`now() - INTERVAL '${range} days' <= event_time`)
      .andWhere("LOWER(repo_name) = LOWER(:repoName)", { repoName })
      .groupBy("LOWER(actor_login)");

    const commitCommentsCte = this.pullRequestGithubEventsRepository.manager
      .createQueryBuilder()
      .select("LOWER(actor_login)", "actor_login")
      .addSelect("COALESCE(COUNT(*), 0) AS commit_comments")
      .from("commit_comment_github_events", "commit_comment_github_events")
      .where(`LOWER(actor_login) IN (:...users)`, { users })
      .andWhere(`now() - INTERVAL '${range} days' <= event_time`)
      .andWhere("LOWER(repo_name) = LOWER(:repoName)", { repoName })
      .groupBy("LOWER(actor_login)");

    const issueCommentsCte = this.pullRequestGithubEventsRepository.manager
      .createQueryBuilder()
      .select("LOWER(actor_login)", "actor_login")
      .addSelect("COALESCE(COUNT(*), 0) AS issue_comments")
      .from("issue_comment_github_events", "issue_comment_github_events")
      .where(`LOWER(actor_login) IN (:...users)`, { users })
      .andWhere(`now() - INTERVAL '${range} days' <= event_time`)
      .andWhere("LOWER(repo_name) = LOWER(:repoName)", { repoName })
      .groupBy("LOWER(actor_login)");

    const prReviewCommentsCte = this.pullRequestGithubEventsRepository.manager
      .createQueryBuilder()
      .select("LOWER(actor_login)", "actor_login")
      .addSelect("COALESCE(COUNT(*), 0) AS pr_review_comments")
      .from("pull_request_review_comment_github_events", "pull_request_review_comment_github_events")
      .where(`LOWER(actor_login) IN (:...users)`, { users })
      .andWhere(`now() - INTERVAL '${range} days' <= event_time`)
      .andWhere("LOWER(repo_name) = LOWER(:repoName)", { repoName })
      .groupBy("LOWER(actor_login)");

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

    const cteCounter = entityQb.clone().select(`COUNT(*) as count`);

    const cteCounterResult = await cteCounter.getRawOne<{ count: number }>();
    const itemCount = parseInt(`${cteCounterResult?.count ?? "0"}`, 10);

    entityQb.offset(pageOptionsDto.skip).limit(pageOptionsDto.limit);

    const entities: DbRepoContributor[] = await entityQb.getRawMany();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }
}
