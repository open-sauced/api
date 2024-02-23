import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { IssueCommentsHistogramDto } from "../histogram/dtos/issue_comments";
import {
  DbIssueCommentGitHubEventsHistogram,
  DbTopCommentGitHubEventsHistogram,
} from "./entities/issue_comment_github_events_histogram";
import { DbPullRequestReviewCommentGitHubEventsHistogram } from "./entities/pull_request_review_comment_events_histogram.entity";

@Injectable()
export class IssueCommentGithubEventsService {
  constructor(
    @InjectRepository(DbIssueCommentGitHubEventsHistogram, "TimescaleConnection")
    private issueCommentGitHubEventsHistogramRepository: Repository<DbIssueCommentGitHubEventsHistogram>,
    @InjectRepository(DbPullRequestReviewCommentGitHubEventsHistogram, "TimescaleConnection")
    private pullRequestReviewCommentGitHubEventsHistogramRepository: Repository<DbPullRequestReviewCommentGitHubEventsHistogram>
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

  async genCommentTopHistogram(): Promise<DbTopCommentGitHubEventsHistogram[]> {
    const issueCommentsCte = this.issueCommentGitHubEventsHistogramRepository.manager
      .createQueryBuilder()
      .select("repo_name")
      .addSelect("time_bucket('1 day', event_time)", "bucket")
      .addSelect("count(*)", "comment_count")
      .from("issue_comment_github_events", "issue_comment_github_events")
      .where(`now() - INTERVAL '1 days' <= "event_time"`)
      .groupBy("bucket, repo_name")
      .orderBy("comment_count", "DESC")
      .limit(100);

    const prReviewCommentsCte = this.pullRequestReviewCommentGitHubEventsHistogramRepository.manager
      .createQueryBuilder()
      .select("repo_name")
      .addSelect("time_bucket('1 day', event_time)", "bucket")
      .addSelect("count(*)", "comment_count")
      .from("pull_request_review_comment_github_events", "pull_request_review_comment_github_events")
      .where(`now() - INTERVAL '1 days' <= "event_time"`)
      .groupBy("bucket, repo_name")
      .orderBy("comment_count", "DESC")
      .limit(100);

    const combinedComments = `
      SELECT * FROM issue_comments_cte
      UNION ALL
      SELECT * FROM pr_review_comments_cte
    `;

    const queryBuilder = this.issueCommentGitHubEventsHistogramRepository.manager
      .createQueryBuilder()
      .addCommonTableExpression(issueCommentsCte, "issue_comments_cte")
      .setParameters(issueCommentsCte.getParameters())
      .addCommonTableExpression(prReviewCommentsCte, "pr_review_comments_cte")
      .setParameters(prReviewCommentsCte.getParameters())
      .addCommonTableExpression(combinedComments, "combined_comments_cte")
      .select("repo_name")
      .addSelect("bucket")
      .addSelect("CAST(SUM(comment_count) AS INTEGER)", "comment_count")
      .from("combined_comments_cte", "combined_comments_cte")
      .groupBy("bucket, repo_name")
      .orderBy("comment_count", "DESC")
      .limit(100);

    const rawResults = await queryBuilder.getRawMany();

    return rawResults as DbTopCommentGitHubEventsHistogram[];
  }
}
