import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { GetPrevDateISOString } from "../common/util/datetimes";
import { ForksHistogramDto } from "../histogram/dtos/forks.dto";
import { OrderDirectionEnum } from "../common/constants/order-direction.constant";
import {
  DbForkGitHubEventsHistogram,
  DbTopForkGitHubEventsHistogram,
} from "./entities/fork_github_events_histogram.entity";

/*
 * fork events, named "ForkEvent" in the GitHub API, are when
 * a GitHub actor forks an existing repo. The metadata included with this event
 * denotes both the name of the forked repo and the new fork.
 *
 * for further details, refer to: https://docs.github.com/en/rest/using-the-rest-api/github-event-types?apiVersion=2022-11-28
 */

@Injectable()
export class ForkGithubEventsService {
  constructor(
    @InjectRepository(DbForkGitHubEventsHistogram, "TimescaleConnection")
    private forkGitHubEventsHistogramRepository: Repository<DbForkGitHubEventsHistogram>
  ) {}

  baseQueryBuilder() {
    const builder = this.forkGitHubEventsHistogramRepository.manager.createQueryBuilder();

    return builder;
  }

  async genForkHistogram(options: ForksHistogramDto): Promise<DbForkGitHubEventsHistogram[]> {
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
      .addSelect("count(*)", "forks_count")
      .from("fork_github_events", "fork_github_events")
      .where(`'${startDate}':: TIMESTAMP >= "fork_github_events"."event_time"`)
      .andWhere(`'${startDate}':: TIMESTAMP - INTERVAL '${range} days' <= "fork_github_events"."event_time"`)
      .groupBy("bucket")
      .orderBy("bucket", order);

    /* filter on the provided forker username */
    if (options.contributor) {
      queryBuilder.andWhere(`LOWER("fork_github_events"."actor_login") = LOWER(:actor)`, {
        actor: options.contributor,
      });
    }

    /* filter on the provided repo names */
    if (options.repo) {
      queryBuilder.andWhere(`LOWER("fork_github_events"."repo_name") IN (:...repoNames)`).setParameters({
        repoNames: options.repo.toLowerCase().split(","),
      });
    }

    /* filter on the provided repo ids */
    if (options.repoIds) {
      queryBuilder.andWhere(`"fork_github_events"."repo_id" IN (:...repoIds)`).setParameters({
        repoIds: options.repoIds.split(","),
      });
    }

    const rawResults = await queryBuilder.getRawMany();

    return rawResults as DbForkGitHubEventsHistogram[];
  }

  async genForkTopHistogram(): Promise<DbTopForkGitHubEventsHistogram[]> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .select("repo_name")
      .addSelect("time_bucket('1 day', event_time)", "bucket")
      .addSelect("count(*)", "fork_count")
      .from("fork_github_events", "fork_github_events")
      .where(`now() - INTERVAL '1 days' <= "event_time"`)
      .groupBy("bucket, repo_name")
      .orderBy("fork_count", "DESC")
      .limit(100);

    const rawResults = await queryBuilder.getRawMany();

    return rawResults as DbTopForkGitHubEventsHistogram[];
  }
}
