import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ObjectLiteral, Repository, SelectQueryBuilder } from "typeorm";

import { ConfigService } from "@nestjs/config";
import { RepoFilterService } from "../common/filters/repo-filter.service";
import { FilterOptionsDto } from "../common/dtos/filter-options.dto";
import { GetPrevDateISOString } from "../common/util/datetimes";
import { DbPRInsight } from "./entities/pull-request-insight.entity";

@Injectable()
export class PullRequestInsightsService {
  constructor(
    @InjectRepository(DbPRInsight, "ApiConnection")
    private prInsightRepository: Repository<DbPRInsight>,
    private repoFilterService: RepoFilterService,
    private configService: ConfigService
  ) {}

  baseQueryBuilder() {
    return this.prInsightRepository.createQueryBuilder("pr");
  }

  hacktoberfestPrCountFilterBuilderStart() {
    const hacktoberfestYear: string = this.configService.get("hacktoberfest.year")!;

    /*
     * take the date range starting from the last day of October.
     * this ensures inclusive date range blocks for years in the past.
     */
    return `to_date('${hacktoberfestYear}', 'YYYY')
            + INTERVAL '10 months'
            - INTERVAL '1 day' >= "pr"."updated_at"`;
  }

  hacktoberfestPrCountFilterBuilderEnd(interval = 0) {
    const hacktoberfestYear: string = this.configService.get("hacktoberfest.year")!;

    /*
     * take the date range starting from the last day of October minus the range.
     * so Oct 31st minus 30 days would be the full hacktoberfest month date range
     */
    return `to_date('${hacktoberfestYear}', 'YYYY')
            + INTERVAL '10 months'
            - INTERVAL '1 day'
            - INTERVAL '${interval} days' <= "pr"."updated_at"`;
  }

  hacktoberfestPrDateCharBuilder(interval = 0) {
    const hacktoberfestYear: string = this.configService.get("hacktoberfest.year")!;

    /*
     * take the date range starting from the last day of October minus the range.
     * so Oct 31st minus 30 days would be first day of October for the timestamp.
     */
    return `TO_CHAR(to_date('${hacktoberfestYear}', 'YYYY')
                + INTERVAL '10 months'
                - INTERVAL '1 day'
                - INTERVAL '${interval} days',
            'YYYY-MM-DD')`;
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

    switch (options.topic) {
      case "hacktoberfest":
        filters.push([this.hacktoberfestPrCountFilterBuilderStart(), {}]);
        filters.push([this.hacktoberfestPrCountFilterBuilderEnd(interval), {}]);
        break;

      default:
        filters.push([`'${startDate}'::TIMESTAMP >= "pr"."updated_at"`, {}]);
        filters.push([`'${startDate}'::TIMESTAMP - INTERVAL '${interval} days' <= "pr"."updated_at"`, {}]);
        break;
    }

    if (type !== "all") {
      filters.push([`('${type}' = ANY("pr"."label_names")${type === "accepted" ? ` OR "pr"."merged"=true` : ""})`, {}]);
    }

    this.repoFilterService.applyQueryBuilderFilters(prQuery, filters);

    return qb.addSelect(`(${prQuery.getQuery()})::INTEGER`, `${type}_prs`);
  }

  async getInsight(interval = 0, options: FilterOptionsDto): Promise<DbPRInsight> {
    const startDate = GetPrevDateISOString(options.prev_days_start_date);
    let queryBuilder: SelectQueryBuilder<DbPRInsight>;

    switch (options.topic) {
      case "hacktoberfest":
        queryBuilder = this.baseQueryBuilder()
          .select(this.hacktoberfestPrDateCharBuilder(interval), "day")
          .addSelect(`${interval}::INTEGER`, "interval");
        break;

      default:
        queryBuilder = this.baseQueryBuilder()
          .select(`TO_CHAR('${startDate}'::TIMESTAMP - INTERVAL '${interval} days', 'YYYY-MM-DD')`, "day")
          .addSelect(`${interval}::INTEGER`, "interval");
        break;
    }

    queryBuilder.limit(1);

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
