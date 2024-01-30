import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ObjectLiteral, Repository, SelectQueryBuilder } from "typeorm";

import { RepoFilterService } from "../common/filters/repo-filter.service";
import { FilterOptionsDto } from "../common/dtos/filter-options.dto";
import { GetPrevDateISOString } from "../common/util/datetimes";
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
    const startDate = GetPrevDateISOString(options.prev_days_start_date);
    const prQuery = this.baseQueryBuilder()
      .select(`COALESCE(COUNT("pr"."id"), 0)`)
      .innerJoin("repos", "repos", `"pr"."repo_id"="repos"."id"`);

    const filters = this.repoFilterService.getRepoFilters(options, startDate, interval);

    filters.push([`'${startDate}'::TIMESTAMP >= "pr"."updated_at"`, {}]);
    filters.push([`'${startDate}'::TIMESTAMP - INTERVAL '${interval} days' <= "pr"."updated_at"`, {}]);

    if (type !== "all") {
      filters.push([`('${type}' = ANY("pr"."label_names")${type === "accepted" ? ` OR "pr"."merged"=true` : ""})`, {}]);
    }

    this.repoFilterService.applyQueryBuilderFilters(prQuery, filters);

    return qb.addSelect(`(${prQuery.getQuery()})::INTEGER`, `${type}_prs`);
  }
}
