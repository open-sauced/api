import { BadRequestException, Inject, Injectable, NotFoundException, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, SelectQueryBuilder } from "typeorm";
import { PullRequestHistogramDto } from "../histogram/dtos/pull_request.dto";
import { FilterListContributorsDto } from "../user-lists/dtos/filter-contributors.dto";
import { RepoService } from "../repo/repo.service";
import { PullRequestPageOptionsDto } from "../pull-requests/dtos/pull-request-page-options.dto";
import { RepoSearchOptionsDto } from "../repo/dtos/repo-search-options.dto";
import { PageOptionsDto } from "../common/dtos/page-options.dto";
import { PageMetaDto } from "../common/dtos/page-meta.dto";
import { PageDto } from "../common/dtos/page.dto";
import { GetPrevDateISOString } from "../common/util/datetimes";
import { UserListService } from "../user-lists/user-list.service";
import { PullRequestContributorOptionsDto } from "../pull-requests/dtos/pull-request-contributor-options.dto";
import { DbPullRequestContributor } from "../pull-requests/dtos/pull-request-contributor.dto";
import { PullRequestContributorInsightsDto } from "../pull-requests/dtos/pull-request-contributor-insights.dto";
import { OrderDirectionEnum } from "../common/constants/order-direction.constant";
import { DbPullRequestGitHubEvents } from "./entities/pull_request_github_event.entity";
import { DbPullRequestGitHubEventsHistogram } from "./entities/pull_request_github_events_histogram.entity";
import { DbRossContributorsHistogram, DbRossIndexHistogram } from "./entities/ross_index_histogram.entity";
import { sanitizeRepos } from "./common/repos";

/*
 * pull request events, named "PullRequestEvent" in the GitHub API, are when
 * a GitHub actor opens/modifies/closes a pull request.
 *
 * IMPORTANT NOTE: issue events in this context are for only repo issues.
 * This may be confusing because "issues" in the context of the GitHub API refer to BOTH pull
 * requests and actual issues. But, pull requests in this service are for only prs on GitHub repos.
 * Not repo issues. For creation / edits of GitHub issues, see IssuesGithubEventsService.
 *
 * for further details, refer to: https://docs.github.com/en/rest/using-the-rest-api/github-event-types?apiVersion=2022-11-28
 */

@Injectable()
export class PullRequestGithubEventsService {
  constructor(
    @InjectRepository(DbPullRequestGitHubEvents, "TimescaleConnection")
    private pullRequestGithubEventsRepository: Repository<DbPullRequestGitHubEvents>,
    @Inject(forwardRef(() => RepoService))
    private readonly repoService: RepoService,
    private readonly userListService: UserListService
  ) {}

  baseQueryBuilder() {
    const builder = this.pullRequestGithubEventsRepository.createQueryBuilder("pull_request_github_events");

    return builder;
  }

  /*
   * this CTE gets all pull requests for a given author in a given time window.
   * the prs are partitioned by the most recent event (since there may be multiple
   * events for any given pr): this way, the most up to date pr events can be used with "row_num = 1"
   */
  basePrAuthorCteBuilder(author: string, range: number, prevDays: number) {
    const startDate = GetPrevDateISOString(prevDays);
    const cteBuilder = this.pullRequestGithubEventsRepository
      .createQueryBuilder("pull_request_github_events")
      .select("*")
      .addSelect(`ROW_NUMBER() OVER (PARTITION BY pr_number, repo_name ORDER BY event_time DESC) AS row_num`)
      .where(`LOWER("pull_request_github_events"."pr_author_login") = LOWER(:author)`, { author: author.toLowerCase() })
      .andWhere(`'${startDate}'::TIMESTAMP >= "pull_request_github_events"."event_time"`)
      .andWhere(`'${startDate}'::TIMESTAMP - INTERVAL '${range} days' <= "pull_request_github_events"."event_time"`);

    return cteBuilder;
  }

  /*
   * this CTE gets all pull requests for a given repo in a given time window.
   * the prs are partitioned by the most recent event (since there may be multiple
   * events for any given pr): this way, the most up to date pr events can be used with "row_num = 1"
   */
  baseRepoCteBuilder(repo: string, range: number, prevDays: number) {
    const startDate = GetPrevDateISOString(prevDays);
    const cteBuilder = this.pullRequestGithubEventsRepository
      .createQueryBuilder("pull_request_github_events")
      .select("*")
      .addSelect(`ROW_NUMBER() OVER (PARTITION BY pr_number, repo_name ORDER BY event_time DESC) AS row_num`)
      .where(`LOWER("pull_request_github_events"."repo_name") = LOWER(:repo_name)`, { repo_name: repo.toLowerCase() })
      .andWhere(`'${startDate}'::TIMESTAMP >= "pull_request_github_events"."event_time"`)
      .andWhere(`'${startDate}'::TIMESTAMP - INTERVAL '${range} days' <= "pull_request_github_events"."event_time"`);

    return cteBuilder;
  }

  /*
   * this function takes a cte builder and gets the common rows for pull_request_github_events
   * off of it. It also builds a cte counter to ensure metadata is built correctly
   * for the timescale query.
   */
  async execCommonTableExpression(
    pageOptionsDto: PageOptionsDto,
    cteBuilder: SelectQueryBuilder<DbPullRequestGitHubEvents>
  ) {
    const queryBuilder = this.pullRequestGithubEventsRepository.manager
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
        pr_commits`
      )
      .from("CTE", "CTE")
      .where("row_num = 1")
      .offset(pageOptionsDto.skip)
      .limit(pageOptionsDto.limit);

    const cteCounter = this.pullRequestGithubEventsRepository.manager
      .createQueryBuilder()
      .addCommonTableExpression(cteBuilder, "CTE")
      .setParameters(cteBuilder.getParameters())
      .select(`COUNT(*) as count`)
      .from("CTE", "CTE")
      .where("row_num = 1");

    const cteCounterResult = await cteCounter.getRawOne<{ count: number }>();
    const itemCount = parseInt(`${cteCounterResult?.count ?? "0"}`, 10);

    const entities = await queryBuilder.getRawMany<DbPullRequestGitHubEvents>();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async execVelocityCommonTableExpression(cteBuilder: SelectQueryBuilder<DbPullRequestGitHubEvents>): Promise<number> {
    /*
     * use a CTE aggregator to get most recent merged PR events
     * and aggregate the velocity over a period of time by:
     * average(merged date - opened date)
     */

    const queryBuilder = this.pullRequestGithubEventsRepository.manager
      .createQueryBuilder()
      .addCommonTableExpression(cteBuilder, "CTE")
      .setParameters(cteBuilder.getParameters())
      .select(`COALESCE(AVG(pr_merged_at::DATE - pr_created_at::DATE), 0)::INTEGER AS velocity`)
      .from("CTE", "CTE")
      .where("row_num = 1")
      .andWhere(`pr_is_merged = true`);

    const counterResult = await queryBuilder.getRawOne<{ velocity: number }>();
    const avgVelocity = parseInt(`${counterResult?.velocity ?? "0"}`, 10);

    return avgVelocity;
  }

  async findVelocityByPrAuthor(author: string, range: number, prevDaysStartDate: number): Promise<number> {
    const cteBuilder = this.basePrAuthorCteBuilder(author, range, prevDaysStartDate);

    return this.execVelocityCommonTableExpression(cteBuilder);
  }

  async findVelocityByRepoName(repo: string, range: number, prevDaysStartDate: number): Promise<number> {
    const cteBuilder = this.baseRepoCteBuilder(repo, range, prevDaysStartDate);

    return this.execVelocityCommonTableExpression(cteBuilder);
  }

  counterBaseQueryBuilder(range: number, prevDay: number) {
    const startDate = GetPrevDateISOString(prevDay);
    const queryBuilder = this.pullRequestGithubEventsRepository
      .createQueryBuilder("pull_request_github_events")
      .select("COUNT(DISTINCT pr_number)", "count")
      .where(`'${startDate}'::TIMESTAMP >= "pull_request_github_events"."event_time"`)
      .andWhere(`'${startDate}'::TIMESTAMP - INTERVAL '${range} days' <= "pull_request_github_events"."event_time"`);

    return queryBuilder;
  }

  async findCountByPrAuthor(author: string, range: number, prevDaysStartDate: number): Promise<number> {
    /*
     * because PR events may be "opened" or "closed" many times, this inner CTE query gets similar PRs rows
     * based on pr_number for a sole pr author.
     * This essentially gives a full picture of all PRs in a timeframe for a given the author
     * across all repos they've contributed to regardless of their state.
     * since getting the whole count over a time period doesn't need to get the most "up to date" event
     * we can just do a count over a whole timerange instead of the cte workflow.
     */

    const queryBuilder = this.counterBaseQueryBuilder(range, prevDaysStartDate);

    queryBuilder.andWhere(`LOWER("pull_request_github_events"."pr_author_login") = LOWER(:author)`, {
      author: author.toLowerCase(),
    });

    const counterResult = await queryBuilder.getRawOne<{ count: number }>();
    const itemCount = parseInt(`${counterResult?.count ?? "0"}`, 10);

    return itemCount;
  }

  async isMaintainer(merger: string): Promise<boolean> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .select("COUNT(*)")
      .where(
        `"pull_request_github_events"."pr_is_merged" = true AND "pull_request_github_events"."pr_action" = 'closed'`
      )
      .andWhere(`LOWER("pull_request_github_events"."actor_login") = LOWER(:merger)`, {
        merger: merger.toLowerCase(),
      });

    const countResult = await queryBuilder.getRawOne<{ count: number }>();

    if (!countResult) {
      return false;
    }

    return countResult.count !== 0;
  }

  async findAllByPrAuthor(author: string, pageOptionsDto: PageOptionsDto): Promise<PageDto<DbPullRequestGitHubEvents>> {
    const startDate = GetPrevDateISOString(pageOptionsDto.prev_days_start_date);
    const range = pageOptionsDto.range!;
    const order = pageOptionsDto.orderDirection!;

    /*
     * because PR events may be "opened" or "closed" many times, this inner CTE query gets similar PRs rows
     * based on pr_number and repo_name. This essentially gives a full picture of opened/closed PRs
     * and their current state
     */

    const cteBuilder = this.pullRequestGithubEventsRepository
      .createQueryBuilder("pull_request_github_events")
      .select("*")
      .addSelect(`ROW_NUMBER() OVER (PARTITION BY pr_number, repo_name ORDER BY event_time ${order}) AS row_num`)
      .where(`LOWER("pull_request_github_events"."pr_author_login") = LOWER(:author)`, { author: author.toLowerCase() })
      .andWhere(`'${startDate}'::TIMESTAMP >= "pull_request_github_events"."event_time"`)
      .andWhere(`'${startDate}'::TIMESTAMP - INTERVAL '${range} days' <= "pull_request_github_events"."event_time"`)
      .orderBy("event_time", order);

    return this.execCommonTableExpression(pageOptionsDto, cteBuilder);
  }

  async findAllWithFilters(pageOptionsDto: PullRequestPageOptionsDto): Promise<PageDto<DbPullRequestGitHubEvents>> {
    const startDate = GetPrevDateISOString(pageOptionsDto.prev_days_start_date);
    const range = pageOptionsDto.range!;
    const order = pageOptionsDto.orderDirection!;

    const cteBuilder = this.pullRequestGithubEventsRepository
      .createQueryBuilder("pull_request_github_events")
      .select("*");

    if (pageOptionsDto.distinctAuthors) {
      const distinctAuthors = pageOptionsDto.distinctAuthors === "true" || pageOptionsDto.distinctAuthors === "1";

      if (distinctAuthors) {
        cteBuilder.addSelect(
          `ROW_NUMBER() OVER (PARTITION BY pr_author_login, repo_name ORDER BY event_time ${order}) AS row_num`
        );
      } else {
        cteBuilder.addSelect(
          `ROW_NUMBER() OVER (PARTITION BY pr_number, repo_name ORDER BY event_time ${order}) AS row_num`
        );
      }
    }

    cteBuilder
      .orderBy("event_time", order)
      .where(`'${startDate}'::TIMESTAMP >= "pull_request_github_events"."event_time"`)
      .andWhere(`'${startDate}'::TIMESTAMP - INTERVAL '${range} days' <= "pull_request_github_events"."event_time"`);

    /* filter on PR author / contributor */
    if (pageOptionsDto.contributor) {
      cteBuilder.andWhere(`LOWER("pull_request_github_events"."pr_author_login") = LOWER(:author)`, {
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

      cteBuilder.andWhere(`LOWER("pull_request_github_events"."repo_name") IN (:...repoNames)`, {
        repoNames,
      });
    }

    /* apply user provided repo name filters */
    if (pageOptionsDto.repo) {
      cteBuilder.andWhere(`LOWER("pull_request_github_events"."repo_name") IN (:...repoNames)`, {
        repoNames: pageOptionsDto.repo.toLowerCase().split(","),
      });
    }

    /* apply filters for consumer provided repo ids */
    if (pageOptionsDto.repoIds) {
      cteBuilder.andWhere(`"pull_request_github_events"."repo_id" IN (:...repoIds)`, {
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

      cteBuilder.andWhere(`LOWER("pull_request_github_events"."pr_author_login") IN (:...userNames)`, {
        userNames,
      });
    }

    /* filter on provided status */
    if (pageOptionsDto.status) {
      cteBuilder.andWhere(`"pull_request_github_events"."pr_state" = LOWER(:status)`, {
        status: pageOptionsDto.status,
      });
    }

    return this.execCommonTableExpression(pageOptionsDto, cteBuilder);
  }

  async findPrStatsByRepo(
    repo: string,
    range: number,
    prevDaysStartDate: number
  ): Promise<DbPullRequestGitHubEventsHistogram> {
    const startDate = GetPrevDateISOString(prevDaysStartDate);

    const queryBuilder = this.pullRequestGithubEventsRepository.manager
      .createQueryBuilder()
      .addSelect("count(*)", "prs_count")
      .addSelect("count(CASE WHEN LOWER(pr_action) = 'closed' AND pr_is_merged = true THEN 1 END)", "accepted_prs")
      .addSelect("count(CASE WHEN LOWER(pr_action) = 'opened' AND pr_is_draft = false THEN 1 END)", "open_prs")
      .addSelect("count(CASE WHEN LOWER(pr_action) = 'closed' AND pr_is_merged = false THEN 1 END)", "closed_prs")
      .addSelect("count(CASE WHEN LOWER(pr_action) = 'opened' AND pr_is_draft = true THEN 1 END)", "draft_prs")
      .addSelect("count(CASE WHEN LOWER(pr_action) = 'opened' THEN 1 END)", "active_prs")
      .addSelect("count(CASE WHEN pr_active_lock_reason = 'spam' THEN 1 END)", "spam_prs")
      .addSelect(
        `COALESCE(AVG(CASE WHEN pr_is_merged = true THEN pr_merged_at::DATE - pr_created_at::DATE END), 0)::INTEGER AS pr_velocity`
      )
      .from("pull_request_github_events", "pull_request_github_events")
      .where(`LOWER("pull_request_github_events"."repo_name") = LOWER(:repo_name)`, { repo_name: repo.toLowerCase() })
      .andWhere(`'${startDate}'::TIMESTAMP >= "pull_request_github_events"."event_time"`)
      .andWhere(`'${startDate}'::TIMESTAMP - INTERVAL '${range} days' <= "pull_request_github_events"."event_time"`);

    const result: DbPullRequestGitHubEventsHistogram | undefined = await queryBuilder.getRawOne();

    if (!result) {
      throw new NotFoundException();
    }

    return result;
  }

  async findRossIndexByRepos(repos: string[], range: number): Promise<DbRossIndexHistogram[]> {
    const sanitizedRepos = sanitizeRepos(repos);

    const outsideContribsCte = this.pullRequestGithubEventsRepository.manager
      .createQueryBuilder()
      .select(`time_bucket('7 day', event_time)`, "bucket")
      .addSelect("COALESCE(COUNT(DISTINCT pr_author_login), 0) AS contributors")
      .from("pull_request_github_events", "pull_request_github_events")
      .where("pr_author_association = 'NONE'")
      .andWhere("pr_is_merged = TRUE")
      .andWhere(`LOWER(repo_name) IN (:...sanitizedRepos)`, { sanitizedRepos })
      .andWhere(`now() - INTERVAL '${range} days' <= event_time`)
      .groupBy("bucket");

    const totalContribPrsCte = this.pullRequestGithubEventsRepository.manager
      .createQueryBuilder()
      .select(`time_bucket('7 day', event_time)`, "bucket")
      .addSelect("COALESCE(COUNT(DISTINCT pr_number), 0) AS weekly_prs")
      .from("pull_request_github_events", "pull_request_github_events")
      .andWhere(`LOWER(repo_name) IN (:...sanitizedRepos)`, { sanitizedRepos })
      .andWhere(`now() - INTERVAL '${range} days' <= event_time`)
      .groupBy("bucket");

    const entityQb = this.pullRequestGithubEventsRepository.manager
      .createQueryBuilder()
      .addCommonTableExpression(outsideContribsCte, "outside_contributors")
      .setParameters(outsideContribsCte.getParameters())
      .addCommonTableExpression(totalContribPrsCte, "total_contributor_prs")
      .setParameters(totalContribPrsCte.getParameters())
      .select("oc.bucket", "bucket")
      .addSelect("COALESCE(oc.contributors::FLOAT / NULLIF(prs.weekly_prs, 0), 0)", "index")
      .from("outside_contributors", "oc")
      .leftJoin("total_contributor_prs", "prs", "oc.bucket = prs.bucket")
      .orderBy("oc.bucket", "DESC");

    return entityQb.getRawMany<DbRossIndexHistogram>();
  }

  async findRossContributorsByRepos(repos: string[], range: number): Promise<DbRossContributorsHistogram[]> {
    const sanitizedRepos = sanitizeRepos(repos);

    const outsideContribsCte = this.pullRequestGithubEventsRepository.manager
      .createQueryBuilder()
      .select(`time_bucket('7 day', event_time)`, "bucket")
      .addSelect("COALESCE(COUNT(DISTINCT pr_author_login), 0) AS contributors")
      .from("pull_request_github_events", "pull_request_github_events")
      .where("pr_author_association = 'NONE'")
      .andWhere("pr_is_merged = TRUE")
      .andWhere(`LOWER(repo_name) IN (:...sanitizedRepos)`, { sanitizedRepos })
      .andWhere(`now() - INTERVAL '${range} days' <= event_time`)
      .groupBy("bucket");

    const returningContribsCte = this.pullRequestGithubEventsRepository.manager
      .createQueryBuilder()
      .select(`time_bucket('7 day', event_time)`, "bucket")
      .addSelect("COALESCE(COUNT(DISTINCT pr_author_login), 0) AS contributors")
      .from("pull_request_github_events", "pull_request_github_events")
      .where("pr_author_association = 'CONTRIBUTOR'")
      .andWhere("pr_is_merged = TRUE")
      .andWhere(`LOWER(repo_name) IN (:...sanitizedRepos)`, { sanitizedRepos })
      .andWhere(`now() - INTERVAL '${range} days' <= event_time`)
      .groupBy("bucket");

    const orgContribsCte = this.pullRequestGithubEventsRepository.manager
      .createQueryBuilder()
      .select(`time_bucket('7 day', event_time)`, "bucket")
      .addSelect("COALESCE(COUNT(DISTINCT pr_author_login), 0) AS contributors")
      .from("pull_request_github_events", "pull_request_github_events")
      .where("pr_author_association = 'MEMBER'")
      .andWhere("pr_is_merged = TRUE")
      .andWhere(`LOWER(repo_name) IN (:...sanitizedRepos)`, { sanitizedRepos })
      .andWhere(`now() - INTERVAL '${range} days' <= event_time`)
      .groupBy("bucket");

    const entityQb = this.pullRequestGithubEventsRepository.manager
      .createQueryBuilder()
      .addCommonTableExpression(outsideContribsCte, "outside_contributors")
      .setParameters(outsideContribsCte.getParameters())
      .addCommonTableExpression(returningContribsCte, "returning_contributors")
      .setParameters(returningContribsCte.getParameters())
      .addCommonTableExpression(orgContribsCte, "org_contributors")
      .setParameters(orgContribsCte.getParameters())
      .select("outside_contributors.bucket", "bucket")
      .addSelect("outside_contributors.contributors", "new")
      .addSelect("returning_contributors.contributors", "recurring")
      .addSelect("org_contributors.contributors", "internal")
      .from("outside_contributors", "outside_contributors")
      .leftJoin(
        "returning_contributors",
        "returning_contributors",
        "outside_contributors.bucket = returning_contributors.bucket"
      )
      .leftJoin("org_contributors", "org_contributors", "outside_contributors.bucket = org_contributors.bucket")
      .orderBy("outside_contributors.bucket", "DESC");

    return entityQb.getRawMany<DbRossContributorsHistogram>();
  }

  async genPrHistogram(options: PullRequestHistogramDto): Promise<DbPullRequestGitHubEventsHistogram[]> {
    if (!options.contributor && !options.repo && !options.topic && !options.filter && !options.repoIds) {
      throw new BadRequestException("must provide contributor, repo, topic, filter, or repoIds");
    }

    const { range } = options;
    const order = options.orderDirection ?? OrderDirectionEnum.DESC;
    const startDate = GetPrevDateISOString(options.prev_days_start_date ?? 0);
    const width = options.width ?? 1;

    const cteBuilder = this.pullRequestGithubEventsRepository
      .createQueryBuilder("pull_request_github_events")
      .select("*")
      .addSelect(`ROW_NUMBER() OVER (PARTITION BY pr_number, repo_name ORDER BY event_time ${order}) AS row_num`)
      .orderBy("event_time", order)
      .where(`'${startDate}'::TIMESTAMP >= "pull_request_github_events"."event_time"`)
      .andWhere(`'${startDate}'::TIMESTAMP - INTERVAL '${range} days' <= "pull_request_github_events"."event_time"`);

    /* filter on PR author / contributor */
    if (options.contributor) {
      cteBuilder.andWhere(`LOWER("pull_request_github_events"."pr_author_login") = LOWER(:author)`, {
        author: options.contributor,
      });
    }

    /*
     * apply repo specific filters (topics, top 100, etc.) - this captures a few
     * pre-defined filters provided by the PullRequestPageOptionsDto.
     * This will call out to the API connection to get metadata on the repos.
     */
    if (options.filter || options.topic) {
      const filtersDto: RepoSearchOptionsDto = {
        filter: options.filter,
        topic: options.topic,
        limit: 50,
        skip: 0,
        range,
      };

      const repos = await this.repoService.findAllWithFilters(filtersDto);
      const repoNames = repos.data.map((repo) => repo.full_name.toLowerCase());

      cteBuilder.andWhere(`LOWER("pull_request_github_events"."repo_name") IN (:...repoNames)`, {
        repoNames,
      });
    }

    /* apply user provided repo name filters */
    if (options.repo) {
      cteBuilder.andWhere(`LOWER("pull_request_github_events"."repo_name") IN (:...repoNames)`, {
        repoNames: options.repo.toLowerCase().split(","),
      });
    }

    /* apply filters for consumer provided repo ids */
    if (options.repoIds) {
      cteBuilder.andWhere(`"pull_request_github_events"."repo_id" IN (:...repoIds)`, {
        repoIds: options.repoIds.split(","),
      });
    }

    const queryBuilder = this.pullRequestGithubEventsRepository.manager
      .createQueryBuilder()
      .addCommonTableExpression(cteBuilder, "CTE")
      .setParameters(cteBuilder.getParameters())
      .select(`time_bucket('${width} day', event_time)`, "bucket")
      .addSelect("count(*)", "prs_count")
      .addSelect(
        "count(CASE WHEN LOWER(pr_author_association) = 'collaborator' THEN 1 END)",
        "collaborator_associated_prs"
      )
      .addSelect(
        "count(CASE WHEN LOWER(pr_author_association) = 'contributor' THEN 1 END)",
        "contributor_associated_prs"
      )
      .addSelect("count(CASE WHEN LOWER(pr_author_association) = 'member' THEN 1 END)", "member_associated_prs")
      .addSelect("count(CASE WHEN LOWER(pr_author_association) = 'none' THEN 1 END)", "non_associated_prs")
      .addSelect("count(CASE WHEN LOWER(pr_author_association) = 'owner' THEN 1 END)", "owner_associated_prs")
      .addSelect("count(CASE WHEN LOWER(pr_action) = 'closed' AND pr_is_merged = true THEN 1 END)", "accepted_prs")
      .addSelect("count(CASE WHEN LOWER(pr_action) = 'closed' AND pr_is_merged = false THEN 1 END)", "closed_prs")
      .addSelect("count(CASE WHEN LOWER(pr_action) = 'opened' AND pr_is_draft = true THEN 1 END)", "draft_prs")
      .addSelect("count(CASE WHEN LOWER(pr_action) = 'opened' THEN 1 END)", "active_prs")
      .addSelect("count(CASE WHEN pr_active_lock_reason = 'spam' THEN 1 END)", "spam_prs")
      .addSelect(
        `COALESCE(AVG(CASE WHEN pr_is_merged = true THEN pr_merged_at::DATE - pr_created_at::DATE END), 0)::INTEGER AS pr_velocity`
      )
      .from("CTE", "CTE")
      .where("row_num = 1")
      .groupBy("bucket")
      .orderBy("bucket", order);

    return queryBuilder.getRawMany<DbPullRequestGitHubEventsHistogram>();
  }

  async searchAuthors(pageOptionsDto: PullRequestContributorOptionsDto): Promise<PageDto<DbPullRequestContributor>> {
    if (!pageOptionsDto.repos && !pageOptionsDto.repoIds && !pageOptionsDto.topic && !pageOptionsDto.filter) {
      throw new BadRequestException("must provide repo, repoIds, topic, filter");
    }

    const startDate = GetPrevDateISOString(pageOptionsDto.prev_days_start_date);
    const range = pageOptionsDto.range!;
    const order = pageOptionsDto.orderDirection!;

    /*
     * partitions by pr_author_login only and orders by time to get the latest PRs
     * for the given subset of prs for a repo
     */
    const cteBuilder = this.pullRequestGithubEventsRepository
      .createQueryBuilder("pull_request_github_events")
      .select(
        `
        pull_request_github_events.pr_author_login,
        pull_request_github_events.pr_author_id,
        pull_request_github_events.event_time`
      )
      .addSelect(
        `ROW_NUMBER() OVER (PARTITION BY pull_request_github_events.pr_author_login ORDER BY pull_request_github_events.event_time ${order}) AS row_num`
      )
      .orderBy("event_time", order)
      .where(`'${startDate}'::TIMESTAMP >= "pull_request_github_events"."event_time"`)
      .andWhere(`'${startDate}'::TIMESTAMP - INTERVAL '${range} days' <= "pull_request_github_events"."event_time"`);

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

      cteBuilder.andWhere(`LOWER("pull_request_github_events"."repo_name") IN (:...repoNames)`, {
        repoNames,
      });
    }

    /* apply user provided repo name filters */
    if (pageOptionsDto.repos) {
      cteBuilder.andWhere(`LOWER("pull_request_github_events"."repo_name") IN (:...repoNames)`, {
        repoNames: pageOptionsDto.repos.toLowerCase().split(","),
      });
    }

    /* apply filters for consumer provided repo ids */
    if (pageOptionsDto.repoIds) {
      cteBuilder.andWhere(`"pull_request_github_events"."repo_id" IN (:...repoIds)`, {
        repoIds: pageOptionsDto.repoIds.split(","),
      });
    }

    const queryBuilder = this.pullRequestGithubEventsRepository.manager
      .createQueryBuilder()
      .addCommonTableExpression(cteBuilder, "CTE")
      .setParameters(cteBuilder.getParameters())
      .select(
        `
        pr_author_login AS author_login,
        pr_author_id AS user_id,
        event_time AS updated_at
      `
      )
      .from("CTE", "CTE")
      .where("row_num = 1")
      .offset(pageOptionsDto.skip)
      .limit(pageOptionsDto.limit);

    const cteCounter = this.pullRequestGithubEventsRepository.manager
      .createQueryBuilder()
      .addCommonTableExpression(cteBuilder, "CTE")
      .setParameters(cteBuilder.getParameters())
      .select(`COUNT(*) as count`)
      .from("CTE", "CTE")
      .where("row_num = 1");

    const cteCounterResult = await cteCounter.getRawOne<{ count: number }>();
    const itemCount = parseInt(`${cteCounterResult?.count ?? "0"}`, 10);

    const entities = await queryBuilder.getRawMany<DbPullRequestContributor>();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async findAuthorsWithFilters(
    pageOptionsDto: PullRequestContributorInsightsDto,
    contribType = "all"
  ): Promise<PageDto<DbPullRequestContributor>> {
    const startDate = GetPrevDateISOString(pageOptionsDto.prev_days_start_date);
    const range = pageOptionsDto.range!;
    const order = pageOptionsDto.orderDirection!;
    const repos = pageOptionsDto.repos.toLowerCase();

    /*
     * partitions by pr_author_login only and orders by time to get the latest PRs
     * for the given subset of prs for a repo
     */
    const cteBuilder = this.pullRequestGithubEventsRepository
      .createQueryBuilder("pull_request_github_events")
      .select(
        `
        pull_request_github_events.pr_author_login,
        pull_request_github_events.pr_author_id,
        pull_request_github_events.event_time`
      )
      .addSelect(
        `ROW_NUMBER() OVER (PARTITION BY pull_request_github_events.pr_author_login ORDER BY pull_request_github_events.event_time ${order}) AS row_num`
      )
      .orderBy("event_time", order);

    switch (contribType) {
      case "active":
        /* capture pr authors in current range window */
        cteBuilder
          .where(`'${startDate}'::TIMESTAMP >= "pull_request_github_events"."event_time"`)
          .andWhere(
            `'${startDate}'::TIMESTAMP - INTERVAL '${range} days' <= "pull_request_github_events"."event_time"`
          );

        this.applyActiveContributorsFilter(cteBuilder, repos, startDate, range);
        break;

      case "new":
        /* capture pr authors in current range window */
        cteBuilder
          .where(`'${startDate}'::TIMESTAMP >= "pull_request_github_events"."event_time"`)
          .andWhere(
            `'${startDate}'::TIMESTAMP - INTERVAL '${range} days' <= "pull_request_github_events"."event_time"`
          );

        this.applyNewContributorsFilter(cteBuilder, repos, startDate, range);
        break;

      case "alumni": {
        /* capture pr authors in previous range window */
        cteBuilder
          .where(`'${startDate}'::TIMESTAMP >= "pull_request_github_events"."event_time"`)
          .andWhere(
            `'${startDate}'::TIMESTAMP - INTERVAL '${range + range} days' <= "pull_request_github_events"."event_time"`
          );

        this.applyAlumniContributorsFilter(cteBuilder, repos, startDate, range);
        break;
      }

      default:
        /* capture pr authors in current range window */
        cteBuilder
          .where(`'${startDate}'::TIMESTAMP >= "pull_request_github_events"."event_time"`)
          .andWhere(
            `'${startDate}'::TIMESTAMP - INTERVAL '${range} days' <= "pull_request_github_events"."event_time"`
          );
        break;
    }

    /* apply user provided repo name filters */
    if (pageOptionsDto.repos) {
      cteBuilder.andWhere(`LOWER("pull_request_github_events"."repo_name") IN (:...repoNames)`, {
        repoNames: pageOptionsDto.repos.toLowerCase().split(","),
      });
    }

    const queryBuilder = this.pullRequestGithubEventsRepository.manager
      .createQueryBuilder()
      .addCommonTableExpression(cteBuilder, "CTE")
      .setParameters(cteBuilder.getParameters())
      .select(
        `
        pr_author_login AS author_login,
        pr_author_id AS user_id,
        event_time AS updated_at
      `
      )
      .from("CTE", "CTE")
      .where("row_num = 1")
      .offset(pageOptionsDto.skip)
      .limit(pageOptionsDto.limit);

    const cteCounter = this.pullRequestGithubEventsRepository.manager
      .createQueryBuilder()
      .addCommonTableExpression(cteBuilder, "CTE")
      .setParameters(cteBuilder.getParameters())
      .select(`COUNT(*) as count`)
      .from("CTE", "CTE")
      .where("row_num = 1");

    const cteCounterResult = await cteCounter.getRawOne<{ count: number }>();
    const itemCount = parseInt(`${cteCounterResult?.count ?? "0"}`, 10);

    const entities = await queryBuilder.getRawMany<DbPullRequestContributor>();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  applyActiveContributorsFilter(
    queryBuilder: SelectQueryBuilder<DbPullRequestGitHubEvents>,
    repos = "",
    startDate: string,
    range = 30
  ) {
    queryBuilder
      .leftJoin(
        `(
          SELECT DISTINCT LOWER("pr_author_login") pr_author_login
          FROM "pull_request_github_events"
            WHERE LOWER(repo_name) IN (${repos
              .toLowerCase()
              .split(",")
              .map((repo) => `'${repo}'`)
              .join(", ")})
              AND "pull_request_github_events"."event_time" BETWEEN '${startDate}':: TIMESTAMP - INTERVAL '${range} days'
              AND '${startDate}':: TIMESTAMP
        )`,
        "current_month_prs",
        `pull_request_github_events.pr_author_login = current_month_prs.pr_author_login`
      )
      .leftJoin(
        `(
          SELECT DISTINCT LOWER("pr_author_login") pr_author_login
            FROM "pull_request_github_events"
            WHERE LOWER(repo_name) IN (${repos
              .toLowerCase()
              .split(",")
              .map((repo) => `'${repo}'`)
              .join(", ")})
              AND "pull_request_github_events"."event_time" BETWEEN '${startDate}':: TIMESTAMP - INTERVAL '${
          range + range
        } days'
              AND '${startDate}':: TIMESTAMP - INTERVAL '${range} days'
        )`,
        "previous_month_prs",
        `pull_request_github_events.pr_author_login = current_month_prs.pr_author_login`
      )
      .andWhere(`"previous_month_prs"."pr_author_login" IS NOT NULL`)
      .andWhere(`"current_month_prs"."pr_author_login" IS NOT NULL`);
  }

  applyNewContributorsFilter(
    queryBuilder: SelectQueryBuilder<DbPullRequestGitHubEvents>,
    repos = "",
    startDate: string,
    range = 30
  ) {
    queryBuilder
      .leftJoin(
        `(
          SELECT DISTINCT LOWER("pr_author_login") pr_author_login
          FROM "pull_request_github_events"
            WHERE LOWER(repo_name) IN (${repos
              .toLowerCase()
              .split(",")
              .map((repo) => `'${repo}'`)
              .join(", ")})
              AND "pull_request_github_events"."event_time" BETWEEN '${startDate}':: TIMESTAMP - INTERVAL '${range} days'
              AND '${startDate}':: TIMESTAMP
        )`,
        "current_month_prs",
        `pull_request_github_events.pr_author_login = current_month_prs.pr_author_login`
      )
      .leftJoin(
        `(
          SELECT DISTINCT LOWER("pr_author_login") pr_author_login
            FROM "pull_request_github_events"
            WHERE LOWER(repo_name) IN (${repos
              .toLowerCase()
              .split(",")
              .map((repo) => `'${repo}'`)
              .join(", ")})
              AND "pull_request_github_events"."event_time" BETWEEN '${startDate}':: TIMESTAMP - INTERVAL '${
          range + range
        } days'
              AND '${startDate}':: TIMESTAMP - INTERVAL '${range} days'
        )`,
        "previous_month_prs",
        `pull_request_github_events.pr_author_login = previous_month_prs.pr_author_login`
      )
      .andWhere(`"previous_month_prs"."pr_author_login" IS NULL`)
      .andWhere(`"current_month_prs"."pr_author_login" IS NOT NULL`);
  }

  applyAlumniContributorsFilter(
    queryBuilder: SelectQueryBuilder<DbPullRequestGitHubEvents>,
    repos = "",
    startDate: string,
    range = 30
  ) {
    queryBuilder
      .leftJoin(
        `(
          SELECT DISTINCT LOWER("pr_author_login") pr_author_login
          FROM "pull_request_github_events"
            WHERE LOWER(repo_name) IN (${repos
              .toLowerCase()
              .split(",")
              .map((repo) => `'${repo}'`)
              .join(", ")})
              AND "pull_request_github_events"."event_time" BETWEEN '${startDate}':: TIMESTAMP - INTERVAL '${range} days'
              AND '${startDate}':: TIMESTAMP
        )`,
        "current_month_prs",
        `pull_request_github_events.pr_author_login = current_month_prs.pr_author_login`
      )
      .leftJoin(
        `(
          SELECT DISTINCT LOWER("pr_author_login") pr_author_login
            FROM "pull_request_github_events"
            WHERE LOWER(repo_name) IN (${repos
              .toLowerCase()
              .split(",")
              .map((repo) => `'${repo}'`)
              .join(", ")})
              AND "pull_request_github_events"."event_time" BETWEEN '${startDate}':: TIMESTAMP - INTERVAL '${
          range + range
        } days'
              AND '${startDate}':: TIMESTAMP - INTERVAL '${range} days'
        )`,
        "previous_month_prs",
        `pull_request_github_events.pr_author_login = previous_month_prs.pr_author_login`
      )
      .andWhere(`"previous_month_prs"."pr_author_login" IS NOT NULL`)
      .andWhere(`"current_month_prs"."pr_author_login" IS NULL`);
  }
}
