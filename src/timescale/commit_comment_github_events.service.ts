import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CommitCommentsHistogramDto } from "../histogram/dtos/commit_comments.dto";
import { GetPrevDateISOString } from "../common/util/datetimes";
import { OrderDirectionEnum } from "../common/constants/order-direction.constant";
import { DbCommitCommentGitHubEventsHistogram } from "./entities/commit_comment_github_events_histogram.entity";

/*
 * commit comment events, named "CommitCommentEvent" in the GitHub API, are when
 * a GitHub actor makes a comment on a specific line(s) within a commit within a repo.
 * This feature is not frequently used but sees some usage by bots.
 *
 * for further details, refer to: https://docs.github.com/en/rest/using-the-rest-api/github-event-types?apiVersion=2022-11-28
 */

@Injectable()
export class CommitCommentGithubEventsService {
  constructor(
    @InjectRepository(DbCommitCommentGitHubEventsHistogram, "TimescaleConnection")
    private commitCommentGitHubEventsHistogramRepository: Repository<DbCommitCommentGitHubEventsHistogram>
  ) {}

  baseQueryBuilder() {
    const builder = this.commitCommentGitHubEventsHistogramRepository.manager.createQueryBuilder();

    return builder;
  }

  async genCommitCommentHistogram(
    options: CommitCommentsHistogramDto
  ): Promise<DbCommitCommentGitHubEventsHistogram[]> {
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
      .addSelect("count(*)", "all_commit_comments")
      .from("commit_comment_github_events", "commit_comment_github_events")
      .where(`'${startDate}':: TIMESTAMP >= "commit_comment_github_events"."event_time"`)
      .andWhere(`'${startDate}':: TIMESTAMP - INTERVAL '${range} days' <= "commit_comment_github_events"."event_time"`)
      .groupBy("bucket")
      .orderBy("bucket", order);

    /* filter on the provided commit comment author */
    if (options.contributor) {
      queryBuilder.andWhere(`LOWER("commit_comment_github_events"."comment_user_login") = LOWER(:user)`, {
        user: options.contributor,
      });
    }

    /* filter on the provided repo names */
    if (options.repo) {
      queryBuilder.andWhere(`LOWER("commit_comment_github_events"."repo_name") IN (:...repoNames)`).setParameters({
        repoNames: options.repo.toLowerCase().split(","),
      });
    }

    /* filter on the provided repo ids */
    if (options.repoIds) {
      queryBuilder.andWhere(`"commit_comment_github_events"."repo_id" IN (:...repoIds)`).setParameters({
        repoIds: options.repoIds.split(","),
      });
    }

    const rawResults = await queryBuilder.getRawMany();

    return rawResults as DbCommitCommentGitHubEventsHistogram[];
  }
}
