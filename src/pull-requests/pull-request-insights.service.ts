import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ObjectLiteral, Repository, SelectQueryBuilder } from "typeorm";

import { RepoFilterService } from "../common/filters/repo-filter.service";
import { FilterOptionsDto } from "../common/dtos/filter-options.dto";
import { DbPRInsight } from "./entities/pull-request-insight.entity";

@Injectable()
export class PullRequestInsightsService {
  constructor(
    @InjectRepository(DbPRInsight, "ApiConnection")
    private prInsightRepository: Repository<DbPRInsight>,
    private repoFilterService: RepoFilterService
  ) {}

  baseQueryBuilder() {
    return this.prInsightRepository.createQueryBuilder("pr");
  }

  subQueryCountPrs<T extends ObjectLiteral>(
    qb: SelectQueryBuilder<T>,
    type = "all",
    interval = 0,
    options: FilterOptionsDto
  ) {
    const prQuery = this.baseQueryBuilder()
      .select(`COALESCE(COUNT("pr"."id"), 0)`)
      .innerJoin("repos", "repos", `"pr"."repo_id"="repos"."id"`);

    const filters = this.repoFilterService.getRepoFilters(options, interval);

    filters.push([`now() - INTERVAL '${interval} days' <= "pr"."updated_at"`, {}]);

    if (type !== "all") {
      filters.push([`('${type}' = ANY("pr"."label_names")${type === "accepted" ? ` OR "pr"."merged"=true` : ""})`, {}]);
    }

    this.repoFilterService.applyQueryBuilderFilters(prQuery, filters);

    return qb.addSelect(`(${prQuery.getQuery()})::INTEGER`, `${type}_prs`);
  }

  async getInsight(interval = 0, options: FilterOptionsDto): Promise<DbPRInsight> {
    const queryBuilder = this.baseQueryBuilder()
      .select(`TO_CHAR(now() - INTERVAL '${interval} days', 'YYYY-MM-DD')`, "day")
      .addSelect(`${interval}::INTEGER`, "interval")
      .limit(1);

    ["all", "accepted", "spam"].forEach((type) => {
      this.subQueryCountPrs(queryBuilder, type, interval, options);
    });

    queryBuilder.setParameters({ ...options, repoIds: options.repoIds ? options.repoIds.split(",") : [] });

    const item: DbPRInsight | undefined = await queryBuilder.getRawOne();

    if (!item) {
      throw new NotFoundException();
    }

    return item;
  }
}
