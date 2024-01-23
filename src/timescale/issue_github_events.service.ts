import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { IssueHistogramDto } from "../histogram/dtos/issue";
import { DbIssueGitHubEventsHistogram } from "./entities/issue_github_events_histogram";

@Injectable()
export class IssueGithubEventsService {
  constructor(
    @InjectRepository(DbIssueGitHubEventsHistogram, "TimescaleConnection")
    private issueGitHubEventsHistogramRepository: Repository<DbIssueGitHubEventsHistogram>
  ) {}

  baseQueryBuilder() {
    const builder = this.issueGitHubEventsHistogramRepository.manager.createQueryBuilder();

    return builder;
  }

  async genIssueHistogram(options: IssueHistogramDto): Promise<DbIssueGitHubEventsHistogram[]> {
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

    return rawResults as DbIssueGitHubEventsHistogram[];
  }
}
