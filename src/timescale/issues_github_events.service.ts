import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { IssueHistogramDto } from "../histogram/dtos/issue.dto";
import { GetPrevDateISOString } from "../common/util/datetimes";
import { OrderDirectionEnum } from "../common/constants/order-direction.constant";
import { DbIssuesGitHubEventsHistogram } from "./entities/issues_github_events_histogram.entity";
import { DbIssuesGitHubEvents } from "./entities/issues_github_event.entity";

/*
 * issue events, named "IssueEvent" in the GitHub API, are when
 * a GitHub actor creates/modifies an issue.
 *
 * IMPORTANT NOTE: issue events in this context are for only repo isues.
 * This may be confusing because "issues" in the context of the GitHub API refer to BOTH pull
 * requests and actual issues. But, issues in this service are for only issues on GitHub repos.
 * For creation / edits
 *
 * for further details, refer to: https://docs.github.com/en/rest/using-the-rest-api/github-event-types?apiVersion=2022-11-28
 */

@Injectable()
export class IssuesGithubEventsService {
  constructor(
    @InjectRepository(DbIssuesGitHubEvents, "TimescaleConnection")
    private issueGitHubEventsRepository: Repository<DbIssuesGitHubEvents>
  ) {}

  baseQueryBuilder() {
    const builder = this.issueGitHubEventsRepository.manager.createQueryBuilder();

    return builder;
  }

  /*
   * this CTE gets all issues for a given repo in a given time window.
   * the issues are partitioned by the most recent event (since there may be multiple
   * events for any given pr): this way, the most up to date pr events can be used with "row_num = 1"
   */
  baseRepoCteBuilder(repo: string, range: number, prevDays: number) {
    const startDate = GetPrevDateISOString(prevDays);
    const cteBuilder = this.issueGitHubEventsRepository
      .createQueryBuilder("issues_github_events")
      .select("*")
      .addSelect(`ROW_NUMBER() OVER (PARTITION BY issue_number, repo_name ORDER BY event_time DESC) AS row_num`)
      .where(`LOWER("issues_github_events"."repo_name") = LOWER(:repo_name)`, { repo_name: repo.toLowerCase() })
      .andWhere(`'${startDate}'::TIMESTAMP >= "issues_github_events"."event_time"`)
      .andWhere(`'${startDate}'::TIMESTAMP - INTERVAL '${range} days' <= "issues_github_events"."event_time"`);

    return cteBuilder;
  }

  async findIssueStatsByRepo(
    repo: string,
    range: number,
    prevDaysStartDate: number
  ): Promise<DbIssuesGitHubEventsHistogram> {
    const cteBuilder = this.baseRepoCteBuilder(repo, range, prevDaysStartDate);

    const queryBuilder = this.issueGitHubEventsRepository.manager
      .createQueryBuilder()
      .addCommonTableExpression(cteBuilder, "CTE")
      .setParameters(cteBuilder.getParameters())
      .addSelect("count(*)", "issue_count")
      .addSelect("count(CASE WHEN LOWER(issue_action) = 'opened' THEN 1 END)", "opened_issues")
      .addSelect("count(CASE WHEN LOWER(issue_action) = 'closed' THEN 1 END)", "closed_issues")
      .addSelect(
        `COALESCE(AVG(CASE WHEN issue_state = 'closed' THEN issue_closed_at::DATE - issue_created_at::DATE END), 0)::INTEGER AS issue_velocity`
      )
      .from("CTE", "CTE")
      .where("row_num = 1");

    const result: DbIssuesGitHubEventsHistogram | undefined = await queryBuilder.getRawOne();

    if (!result) {
      throw new NotFoundException();
    }

    return result;
  }

  async genIssueHistogram(options: IssueHistogramDto): Promise<DbIssuesGitHubEventsHistogram[]> {
    if (!options.contributor && !options.repo && !options.repoIds) {
      throw new BadRequestException("must provide contributor, repo, or repoIds");
    }

    const { range } = options;
    const order = options.orderDirection ?? OrderDirectionEnum.DESC;
    const startDate = GetPrevDateISOString(options.prev_days_start_date ?? 0);
    const width = options.width ?? 1;

    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .select(`time_bucket('${width} day', event_time)`, "bucket")
      .addSelect(
        "count(CASE WHEN LOWER(issue_author_association) = 'collaborator' THEN 1 END)",
        "collaborator_associated_issues"
      )
      .addSelect(
        "count(CASE WHEN LOWER(issue_author_association) = 'contributor' THEN 1 END)",
        "contributor_associated_issues"
      )
      .addSelect("count(CASE WHEN LOWER(issue_author_association) = 'member' THEN 1 END)", "member_associated_issues")
      .addSelect("count(CASE WHEN LOWER(issue_author_association) = 'none' THEN 1 END)", "non_associated_issues")
      .addSelect("count(CASE WHEN LOWER(issue_author_association) = 'owner' THEN 1 END)", "owner_associated_issues")
      .addSelect("count(CASE WHEN LOWER(issue_action) = 'opened' THEN 1 END)", "opened_issues")
      .addSelect("count(CASE WHEN LOWER(issue_action) = 'closed' THEN 1 END)", "closed_issues")
      .addSelect("count(CASE WHEN LOWER(issue_action) = 'reopened' THEN 1 END)", "reopened_issues")
      .addSelect("count(CASE WHEN LOWER(issue_active_lock_reason) = 'spam' THEN 1 END)", "spam_issues")
      .addSelect(
        `COALESCE(AVG(CASE WHEN issue_state = 'closed' THEN issue_closed_at::DATE - issue_created_at::DATE END), 0)::INTEGER AS issue_velocity`
      )
      .from("issues_github_events", "issues_github_events")
      .where(`'${startDate}':: TIMESTAMP >= "issues_github_events"."event_time"`)
      .andWhere(`'${startDate}':: TIMESTAMP - INTERVAL '${range} days' <= "issues_github_events"."event_time"`)
      .groupBy("bucket")
      .orderBy("bucket", order);

    /* filter on the provided issue author */
    if (options.contributor) {
      queryBuilder.andWhere(`LOWER("issues_github_events"."issue_author_login") = LOWER(:author)`, {
        author: options.contributor,
      });
    }

    /* filter on the provided repo names */
    if (options.repo) {
      queryBuilder.andWhere(`LOWER("issues_github_events"."repo_name") IN (:...repoNames)`).setParameters({
        repoNames: options.repo.toLowerCase().split(","),
      });
    }

    /* filter on the provided repo ids */
    if (options.repoIds) {
      queryBuilder.andWhere(`"issues_github_events"."repo_id" IN (:...repoIds)`).setParameters({
        repoIds: options.repoIds.split(","),
      });
    }

    const rawResults = await queryBuilder.getRawMany();

    return rawResults as DbIssuesGitHubEventsHistogram[];
  }
}
