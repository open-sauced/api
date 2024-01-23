import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { StarsHistogramDto } from "../histogram/dtos/stars";
import { DbWatchGitHubEventsHistogram } from "./entities/watch_github_events_histogram";

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
    const repo = options.repo!;

    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .select("time_bucket('1 day', event_time)", "bucket")
      .addSelect("count(*)", "star_count")
      .from("watch_github_events", "watch_github_events")
      .where(`LOWER("repo_name") = LOWER(:repo)`, { repo: repo.toLowerCase() })
      .andWhere(`now() - INTERVAL '${range} days' <= "event_time"`)
      .groupBy("bucket")
      .orderBy("bucket", order);

    const rawResults = await queryBuilder.getRawMany();

    return rawResults as DbWatchGitHubEventsHistogram[];
  }
}
