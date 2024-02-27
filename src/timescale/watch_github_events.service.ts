import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { StarsHistogramDto } from "../histogram/dtos/stars";
import {
  DbTopWatchGitHubEventsHistogram,
  DbWatchGitHubEventsHistogram,
} from "./entities/watch_github_events_histogram";
import { sanitizeRepos } from "./common/repos";

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
    if (!options.contributor && !options.repo && !options.topic && !options.filter && !options.repoIds) {
      throw new BadRequestException("must provide contributor, repo, topic, filter, or repoIds");
    }

    const order = options.orderDirection!;
    const range = options.range!;
    const repo = sanitizeRepos(options.repo!);

    if (!repo) {
      throw new BadRequestException();
    }

    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .select("time_bucket('1 day', event_time)", "bucket")
      .addSelect("count(*)", "star_count")
      .from("watch_github_events", "watch_github_events")
      .where(`LOWER("repo_name") = LOWER(:repo)`, { repo })
      .andWhere(`now() - INTERVAL '${range} days' <= "event_time"`)
      .groupBy("bucket")
      .orderBy("bucket", order);

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
