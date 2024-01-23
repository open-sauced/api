import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, SelectQueryBuilder } from "typeorm";
import { FilterListContributorsDto } from "../user-lists/dtos/filter-contributors.dto";
import { RepoService } from "../repo/repo.service";
import { PullRequestPageOptionsDto } from "../pull-requests/dtos/pull-request-page-options.dto";
import { RepoSearchOptionsDto } from "../repo/dtos/repo-search-options.dto";
import { PageOptionsDto } from "../common/dtos/page-options.dto";
import { PageMetaDto } from "../common/dtos/page-meta.dto";
import { PageDto } from "../common/dtos/page.dto";
import { GetPrevDateISOString } from "../common/util/datetimes";
import { UserListService } from "../user-lists/user-list.service";
import { PullRequestReviewHistogramDto } from "../histogram/dtos/pull_request_review";
import { DbPullRequestReviewGitHubEvents } from "./entities/pull_request_review_github_event";
import { DbPullRequestReviewGitHubEventsHistogram } from "./entities/pull_request_review_github_events_histogram";

@Injectable()
export class PullRequestReviewGithubEventsService {
  constructor(
    @InjectRepository(DbPullRequestReviewGitHubEvents, "TimescaleConnection")
    private pullRequestReviewGithubEventsRepository: Repository<DbPullRequestReviewGitHubEvents>,
    private readonly repoService: RepoService,
    private readonly userListService: UserListService
  ) {}

  baseQueryBuilder() {
    const builder = this.pullRequestReviewGithubEventsRepository.createQueryBuilder(
      "pull_request_review_github_events"
    );

    return builder;
  }

  /*
   * this function takes a cte builder and gets the common rows for pull_request_review_github_events
   * off of it. It also builds a cte counter to ensure metadata is built correctly
   * for the timescale query.
   */
  async execCommonTableExpression(
    pageOptionsDto: PageOptionsDto,
    cteBuilder: SelectQueryBuilder<DbPullRequestReviewGitHubEvents>
  ) {
    const queryBuilder = this.pullRequestReviewGithubEventsRepository.manager
      .createQueryBuilder()
      .addCommonTableExpression(cteBuilder, "CTE")
      .setParameters(cteBuilder.getParameters())
      .select(
        `event_id,
        pr_number,
        pr_state,
        pr_is_draft,
        pr_is_merged,
        pr_mergeable_state,
        pr_is_rebaseable,
        pr_title,
        pr_head_label,
        pr_base_label,
        pr_head_ref,
        pr_base_ref,
        pr_author_login,
        pr_created_at,
        pr_closed_at,
        pr_merged_at,
        pr_updated_at,
        pr_comments,
        pr_additions,
        pr_deletions,
        pr_changed_files,
        repo_name,
        pr_commits,
        pr_review_body`
      )
      .from("CTE", "CTE")
      .where("row_num = 1")
      .offset(pageOptionsDto.skip)
      .limit(pageOptionsDto.limit);

    const cteCounter = this.pullRequestReviewGithubEventsRepository.manager
      .createQueryBuilder()
      .addCommonTableExpression(cteBuilder, "CTE")
      .setParameters(cteBuilder.getParameters())
      .select(`COUNT(*) as count`)
      .from("CTE", "CTE")
      .where("row_num = 1");

    const cteCounterResult = await cteCounter.getRawOne<{ count: number }>();
    const itemCount = parseInt(`${cteCounterResult?.count ?? "0"}`, 10);

    const entities = await queryBuilder.getRawMany<DbPullRequestReviewGitHubEvents>();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async findAllWithFilters(
    pageOptionsDto: PullRequestPageOptionsDto
  ): Promise<PageDto<DbPullRequestReviewGitHubEvents>> {
    const startDate = GetPrevDateISOString(pageOptionsDto.prev_days_start_date);
    const range = pageOptionsDto.range!;
    const order = pageOptionsDto.orderDirection!;

    const cteBuilder = this.pullRequestReviewGithubEventsRepository
      .createQueryBuilder("pull_request_review_github_events")
      .select("*")
      .addSelect(`ROW_NUMBER() OVER (PARTITION BY pr_number, repo_name ORDER BY event_time ${order}) AS row_num`)
      .orderBy("event_time", order);

    cteBuilder
      .where(`'${startDate}'::TIMESTAMP >= "pull_request_review_github_events"."event_time"`)
      .andWhere(
        `'${startDate}'::TIMESTAMP - INTERVAL '${range} days' <= "pull_request_review_github_events"."event_time"`
      );

    /* filter on PR author / contributor */
    if (pageOptionsDto.contributor) {
      cteBuilder.andWhere(`LOWER("pull_request_review_github_events"."actor_login") = LOWER(:author)`, {
        author: pageOptionsDto.contributor,
      });
    }

    /*
     * apply repo specific filters (topics, top 100, etc.) - this captures a few
     * pre-defined filters provided by the PullRequestPageOptionsDto.
     * This will call out to the API connection to get metadata on the repos.
     */
    if (pageOptionsDto.filter || pageOptionsDto.topic) {
      const filtersDto: RepoSearchOptionsDto = {
        filter: pageOptionsDto.filter,
        topic: pageOptionsDto.topic,
        limit: 50,
        skip: 0,
        range,
      };

      const repos = await this.repoService.findAllWithFilters(filtersDto);
      const repoNames = repos.data.map((repo) => repo.full_name.toLowerCase());

      cteBuilder.andWhere(`LOWER("pull_request_review_github_events"."repo_name") IN (:...repoNames)`, {
        repoNames,
      });
    }

    /* apply user provided repo name filters */
    if (pageOptionsDto.repo) {
      cteBuilder.andWhere(`LOWER("pull_request_review_github_events"."repo_name") IN (:...repoNames)`, {
        repoNames: pageOptionsDto.repo.toLowerCase().split(","),
      });
    }

    /* apply filters for consumer provided repo ids */
    if (pageOptionsDto.repoIds) {
      cteBuilder.andWhere(`"pull_request_review_github_events"."repo_id" IN (:...repoIds)`, {
        repoIds: pageOptionsDto.repoIds.split(","),
      });
    }

    /*
     * filter on a given list ID: this uses the API connection to find the usernames
     * to use for filtering on the timescale data.
     */
    if (pageOptionsDto.listId) {
      const filtersDto: FilterListContributorsDto = {
        skip: 0,
      };

      const users = await this.userListService.findContributorsByListId(filtersDto, pageOptionsDto.listId);
      const userNames = users.data.map((user) => user.username?.toLowerCase());

      cteBuilder.andWhere(`LOWER("pull_request_review_github_events"."pr_author_login") IN (:...userNames)`, {
        userNames,
      });
    }

    /* filter on provided status */
    if (pageOptionsDto.status) {
      cteBuilder.andWhere(`"pull_request_review_github_events"."pr_state" = LOWER(:status)`, {
        status: pageOptionsDto.status,
      });
    }

    return this.execCommonTableExpression(pageOptionsDto, cteBuilder);
  }

  async genPrReviewHistogram(
    options: PullRequestReviewHistogramDto
  ): Promise<DbPullRequestReviewGitHubEventsHistogram[]> {
    if (!options.contributor && !options.repo && !options.topic && !options.filter && !options.repoIds) {
      throw new BadRequestException("must provide contributor, repo, topic, filter, or repoIds");
    }

    const order = options.orderDirection!;
    const range = options.range!;
    const repo = options.repo!;

    const queryBuilder = this.pullRequestReviewGithubEventsRepository.manager.createQueryBuilder();

    queryBuilder
      .select("time_bucket('1 day', event_time)", "bucket")
      .addSelect("count(*)", "prs_count")
      .from("pull_request_review_github_events", "pull_request_review_github_events")
      .where(`LOWER("repo_name") = LOWER(:repo)`, { repo: repo.toLowerCase() })
      .andWhere(`now() - INTERVAL '${range} days' <= "event_time"`)
      .groupBy("bucket")
      .orderBy("bucket", order);

    const rawResults = await queryBuilder.getRawMany();

    return rawResults as DbPullRequestReviewGitHubEventsHistogram[];
  }
}
