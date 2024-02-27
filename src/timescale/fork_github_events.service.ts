import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ForksHistogramDto } from "../histogram/dtos/forks";
import { DbForkGitHubEventsHistogram, DbTopForkGitHubEventsHistogram } from "./entities/fork_github_events_histogram";

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
    if (!options.contributor && !options.repo && !options.topic && !options.filter && !options.repoIds) {
      throw new BadRequestException("must provide contributor, repo, topic, filter, or repoIds");
    }

    const order = options.orderDirection!;
    const range = options.range!;
    const repo = options.repo!;

    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .select("time_bucket('1 day', event_time)", "bucket")
      .addSelect("count(*)", "forks_count")
      .from("fork_github_events", "fork_github_events")
      .where(`LOWER("repo_name") = LOWER(:repo)`, { repo: repo.toLowerCase() })
      .andWhere(`now() - INTERVAL '${range} days' <= "event_time"`)
      .groupBy("bucket")
      .orderBy("bucket", order);

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
