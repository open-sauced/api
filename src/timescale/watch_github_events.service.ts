import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { GetPrevDateISOString } from "../common/util/datetimes";
import { StarsHistogramDto } from "../histogram/dtos/stars.dto";
import { OrderDirectionEnum } from "../common/constants/order-direction.constant";
import {
  DbTopWatchGitHubEventsHistogram,
  DbWatchGitHubEventsHistogram,
} from "./entities/watch_github_events_histogram.entity";

/*
 * watch events, named "WatchEvent" in the GitHub API, are when a GitHub actor stars a repo.
 * This is NOT when an actor "watches" a repo in the traditional sense; in the GitHub events API,
 * there is no "watching", only star events which are named "watch". The assumption is
 * that this is for historical reasons.
 *
 * for further details, refer to: https://docs.github.com/en/rest/using-the-rest-api/github-event-types?apiVersion=2022-11-28
 */

@Injectable()
export class WatchGithubEventsService {
  constructor(
    @InjectRepository(DbWatchGitHubEventsHistogram, "TimescaleConnection")
    private watchGitHubEventsHistogramRepository: Repository<DbWatchGitHubEventsHistogram>
  ) {}

  baseQueryBuilder() {
    const builder = this.watchGitHubEventsHistogramRepository.manager.createQueryBuilder();

    return builder;
  }

  async genStarsHistogram(options: StarsHistogramDto): Promise<DbWatchGitHubEventsHistogram[]> {
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
      .addSelect("count(*)", "star_count")
      .from("watch_github_events", "watch_github_events")
      .where(`'${startDate}':: TIMESTAMP >= "watch_github_events"."event_time"`)
      .andWhere(`'${startDate}':: TIMESTAMP - INTERVAL '${range} days' <= "watch_github_events"."event_time"`)
      .groupBy("bucket")
      .orderBy("bucket", order);

    /* filter on the provided star-er username */
    if (options.contributor) {
      queryBuilder.andWhere(`LOWER("watch_github_events"."actor_login") = LOWER(:actor)`, {
        actor: options.contributor,
      });
    }

    /* filter on the provided repo names */
    if (options.repo) {
      queryBuilder.andWhere(`LOWER("watch_github_events"."repo_name") IN (:...repoNames)`).setParameters({
        repoNames: options.repo.toLowerCase().split(","),
      });
    }

    /* filter on the provided repo ids */
    if (options.repoIds) {
      queryBuilder.andWhere(`"watch_github_events"."repo_id" IN (:...repoIds)`).setParameters({
        repoIds: options.repoIds.split(","),
      });
    }

    const rawResults = await queryBuilder.getRawMany();

    return rawResults as DbWatchGitHubEventsHistogram[];
  }

  async genStarsTopHistogram(): Promise<DbTopWatchGitHubEventsHistogram[]> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .select("repo_name")
      .addSelect("time_bucket('1 day', event_time)", "bucket")
      .addSelect("count(*)", "star_count")
      .from("watch_github_events", "watch_github_events")
      .where(`now() - INTERVAL '1 days' <= "event_time"`)
      .groupBy("bucket, repo_name")
      .orderBy("star_count", "DESC")
      .limit(100);

    const rawResults = await queryBuilder.getRawMany();

    return rawResults as DbTopWatchGitHubEventsHistogram[];
  }

  async genStarsNewTopHistogram(): Promise<DbTopWatchGitHubEventsHistogram[]> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .select("repo_name")
      .addSelect("time_bucket('1 day', event_time)", "bucket")
      .addSelect("count(*)", "star_count")
      .from("watch_github_events", "watch_github_events")
      .where(`now() - INTERVAL '1 days' <= "event_time"`)
      .groupBy("bucket, repo_name")
      .orderBy("star_count", "DESC")
      .limit(500);

    const rawResults = await queryBuilder.getRawMany<DbTopWatchGitHubEventsHistogram>();

    /*
     * this performs two additional queries on each of the top repos found
     * to check if they have either been recently made public or recently created.
     * because the public/created tables contain many millions of rows within
     * short time periods, joining or using a subquery to filter the raw results
     * is not performant.
     */
    const onlyNewResults = await Promise.all(
      rawResults.map(async (result) => {
        const recentlyPublicQueryBuilder = this.baseQueryBuilder();

        recentlyPublicQueryBuilder
          .select("repo_name")
          .from("public_github_events", "public_github_events")
          .where(`now() - INTERVAL '30 days' <= "event_time"`)
          .andWhere("LOWER(repo_name) = :repo_name", { repo_name: result.repo_name });

        const recentlyPublicResult = await recentlyPublicQueryBuilder.getRawMany();

        const recentlyCreatedQueryBuilder = this.baseQueryBuilder();

        recentlyCreatedQueryBuilder
          .select("repo_name")
          .from("create_github_events", "create_github_events")
          .where(`now() - INTERVAL '30 days' <= "event_time"`)
          .andWhere("LOWER(repo_name) = :repo_name", { repo_name: result.repo_name })
          .andWhere("create_ref_type = 'repository'");

        const recentlyCreatedResult = await recentlyCreatedQueryBuilder.getRawMany();

        if (recentlyPublicResult.length === 0 && recentlyCreatedResult.length === 0) {
          return null;
        }

        return result;
      })
    );

    const filteredResults = onlyNewResults.filter((result) => result !== null);

    return filteredResults.slice(0, 100) as DbTopWatchGitHubEventsHistogram[];
  }
}
