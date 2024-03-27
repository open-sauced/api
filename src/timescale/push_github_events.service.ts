import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { GetPrevDateISOString } from "../common/util/datetimes";
import { PushesHistogramDto } from "../histogram/dtos/pushes.dto";
import { OrderDirectionEnum } from "../common/constants/order-direction.constant";
import { DbPushGitHubEventsHistogram } from "./entities/push_github_events_histogram.entity";
import { DbPushGitHubEvents } from "./entities/push_github_events.entity";

/*
 * push events, named "PushEvent" in the GitHub API, are when
 * a GitHub actor makes a "git push" to a repo's ref. This may be the main ref
 * (like ref/head/main) or some branch on the repo.
 *
 * for further details, refer to: https://docs.github.com/en/rest/using-the-rest-api/github-event-types?apiVersion=2022-11-28
 */

@Injectable()
export class PushGithubEventsService {
  constructor(
    @InjectRepository(DbPushGitHubEventsHistogram, "TimescaleConnection")
    private pushGitHubEventsHistogramRepository: Repository<DbPushGitHubEventsHistogram>
  ) {}

  baseQueryBuilder() {
    const builder = this.pushGitHubEventsHistogramRepository.manager.createQueryBuilder();

    return builder;
  }

  async genPushHistogram(options: PushesHistogramDto): Promise<DbPushGitHubEventsHistogram[]> {
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
      .addSelect("count(*)", "pushes_count")
      .addSelect("count(CASE WHEN LOWER(push_ref) SIMILAR TO '%(main|master)%' THEN 1 END)", "main_pushes")
      .from("push_github_events", "push_github_events")
      .where(`'${startDate}':: TIMESTAMP >= "push_github_events"."event_time"`)
      .andWhere(`'${startDate}':: TIMESTAMP - INTERVAL '${range} days' <= "push_github_events"."event_time"`)
      .groupBy("bucket")
      .orderBy("bucket", order);

    /* filter on the provided pusher username */
    if (options.contributor) {
      queryBuilder.andWhere(`LOWER("push_github_events"."actor_login") = LOWER(:actor)`, {
        actor: options.contributor,
      });
    }

    /* filter on the provided repo names */
    if (options.repo) {
      queryBuilder.andWhere(`LOWER("push_github_events"."repo_name") IN (:...repoNames)`).setParameters({
        repoNames: options.repo.toLowerCase().split(","),
      });
    }

    /* filter on the provided repo ids */
    if (options.repoIds) {
      queryBuilder.andWhere(`"push_github_events"."repo_id" IN (:...repoIds)`).setParameters({
        repoIds: options.repoIds.split(","),
      });
    }

    const rawResults = await queryBuilder.getRawMany();

    return rawResults as DbPushGitHubEventsHistogram[];
  }

  async lastPushDatesForRepo(repo: string): Promise<{ push_date: Date; main_push_date: Date }> {
    const startDate = GetPrevDateISOString(0);
    const range = 30;

    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .select(`*`)
      .from("push_github_events", "push_github_events")
      .where(`'${startDate}':: TIMESTAMP >= "push_github_events"."event_time"`)
      .andWhere(`'${startDate}':: TIMESTAMP - INTERVAL '${range} days' <= "push_github_events"."event_time"`)
      .andWhere(`LOWER("push_github_events"."repo_name") = '${repo}'`)
      .orderBy("event_time", OrderDirectionEnum.DESC);

    const results = await queryBuilder.getRawMany<DbPushGitHubEvents>();

    if (results.length === 0) {
      return { push_date: new Date(0), main_push_date: new Date(0) };
    }

    const firstPushDate = results[0].event_time;
    const mainMasterRegex = new RegExp("main|master");
    const firstMainPushDate =
      results.find((item) => item.push_ref && mainMasterRegex.test(item.push_ref))?.event_time ?? new Date(0);

    return {
      push_date: firstPushDate,
      main_push_date: firstMainPushDate,
    };
  }
}
