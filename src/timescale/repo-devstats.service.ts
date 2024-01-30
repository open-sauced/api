import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as math from "mathjs";
import { avgRepoActivityRatioSample } from "../common/calculations/avg-repo-activity-ratio-sample";
import { DbPullRequestGitHubEvents } from "./entities/pull_request_github_event";
import { DbIssuesGitHubEvents } from "./entities/issues_github_event";
import { DbPushGitHubEvents } from "./entities/push_github_events";

@Injectable()
export class RepoDevstatsService {
  constructor(
    @InjectRepository(DbPullRequestGitHubEvents, "TimescaleConnection")
    private pullRequestGithubEventsRepository: Repository<DbPullRequestGitHubEvents>,
    @InjectRepository(DbIssuesGitHubEvents, "TimescaleConnection")
    private issuesGithubEventsRepository: Repository<DbIssuesGitHubEvents>,
    @InjectRepository(DbPushGitHubEvents, "TimescaleConnection")
    private pushGithubEventsRepository: Repository<DbPushGitHubEvents>
  ) {
    // defines quantile boundaries (ignore lower 5% and upper 95% percentiles)
    const lowerQ = 0.05;
    const upperQ = 0.95;

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
}
