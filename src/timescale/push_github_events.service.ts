import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PushesHistogramDto } from "../histogram/dtos/pushes";
import { DbPushGitHubEventsHistogram } from "./entities/push_github_events_histogram";

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
    if (!options.contributor && !options.repo && !options.topic && !options.filter && !options.repoIds) {
      throw new BadRequestException("must provide contributor, repo, topic, filter, or repoIds");
    }

    const order = options.orderDirection!;
    const range = options.range!;
    const repo = options.repo!;

    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .select("time_bucket('1 day', event_time)", "bucket")
      .addSelect("count(*)", "pushes_count")
      .from("push_github_events", "push_github_events")
      .where(`LOWER("repo_name") = LOWER(:repo)`, { repo: repo.toLowerCase() })
      .andWhere(`now() - INTERVAL '${range} days' <= "event_time"`)
      .groupBy("bucket")
      .orderBy("bucket", order);

    const rawResults = await queryBuilder.getRawMany();

    return rawResults as DbPushGitHubEventsHistogram[];
  }
}
