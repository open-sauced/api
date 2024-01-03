import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ForksHistogramDto } from "../histogram/dtos/forks";
import { DbForkGitHubEventsHistogram } from "./entities/fork_github_events_histogram";

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
    const order = options.orderDirection!;
    const range = options.range!;

    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .select("time_bucket('1 day', event_time)", "bucket")
      .addSelect("count(*)", "forks_count")
      .from("fork_github_events", "fork_github_events")
      .where(`LOWER("repo_name") = LOWER(:repo)`, { repo: options.repo.toLowerCase() })
      .andWhere(`now() - INTERVAL '${range} days' <= "event_time"`)
      .groupBy("bucket")
      .orderBy("bucket", order);

    const rawResults = await queryBuilder.getRawMany();

    return rawResults as DbForkGitHubEventsHistogram[];
  }
}
