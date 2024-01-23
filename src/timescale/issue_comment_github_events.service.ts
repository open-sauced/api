import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { IssueCommentsHistogramDto } from "../histogram/dtos/issue_comments";
import { DbIssueCommentGitHubEventsHistogram } from "./entities/issue_comment_github_events_histogram";

@Injectable()
export class IssueCommentGithubEventsService {
  constructor(
    @InjectRepository(DbIssueCommentGitHubEventsHistogram, "TimescaleConnection")
    private issueCommentGitHubEventsHistogramRepository: Repository<DbIssueCommentGitHubEventsHistogram>
  ) {}

  baseQueryBuilder() {
    const builder = this.issueCommentGitHubEventsHistogramRepository.manager.createQueryBuilder();

    return builder;
  }

  async genIssueCommentHistogram(options: IssueCommentsHistogramDto): Promise<DbIssueCommentGitHubEventsHistogram[]> {
    if (!options.contributor && !options.repo && !options.topic && !options.filter && !options.repoIds) {
      throw new BadRequestException("must provide contributor, repo, topic, filter, or repoIds");
    }

    const order = options.orderDirection!;
    const range = options.range!;
    const repo = options.repo!;

    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .select("time_bucket('1 day', event_time)", "bucket")
      .addSelect("count(*)", "issues_comment_count")
      .from("issue_comment_github_events", "issue_comment_github_events")
      .where(`LOWER("repo_name") = LOWER(:repo)`, { repo: repo.toLowerCase() })
      .andWhere(`now() - INTERVAL '${range} days' <= "event_time"`)
      .andWhere(`LOWER(issue_comment_action) = LOWER('created')`)
      .groupBy("bucket")
      .orderBy("bucket", order);

    const rawResults = await queryBuilder.getRawMany();

    return rawResults as DbIssueCommentGitHubEventsHistogram[];
  }
}
