import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { IssueHistogramDto } from "../histogram/dtos/issue";
import { GetPrevDateISOString } from "../common/util/datetimes";
import { DbIssuesGitHubEventsHistogram } from "./entities/issues_github_events_histogram";
import { DbIssuesGitHubEvents } from "./entities/issues_github_event";

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
    if (!options.contributor && !options.repo && !options.topic && !options.filter && !options.repoIds) {
      throw new BadRequestException("must provide contributor, repo, topic, filter, or repoIds");
    }

    const order = options.orderDirection!;
    const range = options.range!;
    const repo = options.repo!;

    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .select("time_bucket('1 day', event_time)", "bucket")
      .addSelect("count(*)", "issues_count")
      .from("issues_github_events", "issues_github_events")
      .where(`LOWER("repo_name") = LOWER(:repo)`, { repo: repo.toLowerCase() })
      .andWhere(`now() - INTERVAL '${range} days' <= "event_time"`)
      .andWhere(`LOWER(issue_action) = LOWER('opened')`)
      .groupBy("bucket")
      .orderBy("bucket", order);

    const rawResults = await queryBuilder.getRawMany();

    return rawResults as DbIssuesGitHubEventsHistogram[];
  }
}
