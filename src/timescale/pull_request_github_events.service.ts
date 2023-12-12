import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PageOptionsDto } from "../common/dtos/page-options.dto";
import { PageMetaDto } from "../common/dtos/page-meta.dto";
import { PageDto } from "../common/dtos/page.dto";
import { GetPrevDateISOString } from "../common/util/datetimes";
import { DbPullRequestGitHubEvents } from "./entities/pull_request_github_event";

@Injectable()
export class PullRequestGithubEventsService {
  constructor(
    @InjectRepository(DbPullRequestGitHubEvents, "TimescaleConnection")
    private pullRequestGithubEventsRepository: Repository<DbPullRequestGitHubEvents>
  ) {}

  baseQueryBuilder() {
    const builder = this.pullRequestGithubEventsRepository.createQueryBuilder("pull_request_github_events");

    return builder;
  }

  async findAllByPrAuthor(author: string, pageOptionsDto: PageOptionsDto): Promise<PageDto<DbPullRequestGitHubEvents>> {
    const startDate = GetPrevDateISOString(pageOptionsDto.prev_days_start_date);
    const range = pageOptionsDto.range!;
    const order = pageOptionsDto.orderDirection!;

    /*
     * because PR events may be "opened" or "closed" many times, this inner CTE query gets similar PRs rows
     *  based on pr_number and repo_name. This essentially gives a full picture of opened/closed PRs
     *  and their current state
     */

    const cteBuilder = this.pullRequestGithubEventsRepository
      .createQueryBuilder("pull_request_github_events")
      .select("*")
      .addSelect(`ROW_NUMBER() OVER (PARTITION BY pr_number, repo_name ORDER BY event_time ${order}) AS row_num`)
      .where(`"pull_request_github_events"."pr_author_login"=:author`, { author: author.toLowerCase() })
      .andWhere(`'${startDate}'::TIMESTAMP >= "pull_request_github_events"."event_time"`)
      .andWhere(`'${startDate}'::TIMESTAMP - INTERVAL '${range} days' <= "pull_request_github_events"."event_time"`)
      .orderBy("event_time", order);

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
}
