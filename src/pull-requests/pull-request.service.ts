import { BadRequestException, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { ConfigService } from "@nestjs/config";
import { GetPrevDateISOString } from "../common/util/datetimes";
import { PageMetaDto } from "../common/dtos/page-meta.dto";
import { PageDto } from "../common/dtos/page.dto";
import { OrderDirectionEnum } from "../common/constants/order-direction.constant";
import { PageOptionsDto } from "../common/dtos/page-options.dto";
import { RepoFilterService } from "../common/filters/repo-filter.service";
import { InsightFilterFieldsEnum } from "../insight/dtos/insight-options.dto";
import { PullRequestPageOptionsDto } from "./dtos/pull-request-page-options.dto";
import { DbPullRequest } from "./entities/pull-request.entity";
import { DbPullRequestContributor } from "./dtos/pull-request-contributor.dto";
import { PullRequestContributorOptionsDto } from "./dtos/pull-request-contributor-options.dto";
import { PullRequestContributorInsightsDto } from "./dtos/pull-request-contributor-insights.dto";
import { ContributorPullRequestsDto, RangeTypeEnum } from "../user/dtos/contributor-prs.dto";

@Injectable()
export class PullRequestService {
  constructor(
    @InjectRepository(DbPullRequest, "ApiConnection")
    private pullRequestRepository: Repository<DbPullRequest>,
    private filterService: RepoFilterService,
    private configService: ConfigService
  ) {}

  baseQueryBuilder() {
    const builder = this.pullRequestRepository.createQueryBuilder("pull_requests");

    return builder;
  }

  hacktoberfestPrFilterBuilderStart() {
    const hacktoberfestYear: string = this.configService.get("hacktoberfest.year")!;

    /*
     * take the date range starting from the last day of October.
     * this is inclusive of previous years where the current pull_requests have "newer" updates
     */
    return `to_date('${hacktoberfestYear}', 'YYYY')
                + INTERVAL '10 months'
                - INTERVAL '1 day' >= "pull_requests"."updated_at"`;
  }

  hacktoberfestPrFilterBuilderEnd(range = 30) {
    const hacktoberfestYear: string = this.configService.get("hacktoberfest.year")!;

    /*
     * take the date range starting from the last day of October.
     * so Oct 31st minus 30 days would be the full hacktoberfest month date range
     */
    return `to_date('${hacktoberfestYear}', 'YYYY')
                + INTERVAL '10 months'
                - INTERVAL '1 day'
                - INTERVAL '${range} days' <= "pull_requests"."updated_at"`;
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<DbPullRequest>> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .addOrderBy(`"pull_requests"."updated_at"`, OrderDirectionEnum.DESC)
      .offset(pageOptionsDto.skip)
      .limit(pageOptionsDto.limit);

    const itemCount = await queryBuilder.getCount();
    const entities = await queryBuilder.getMany();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async findAllByContributor(
    contributor: string,
    pageOptionsDto: ContributorPullRequestsDto
  ): Promise<PageDto<DbPullRequest>> {
    const queryBuilder = this.baseQueryBuilder();
    const startDate = GetPrevDateISOString(pageOptionsDto.prev_days_start_date);
    const range = pageOptionsDto.range!;

    queryBuilder
      .innerJoin("repos", "repos", `"pull_requests"."repo_id"="repos"."id"`)
      .addSelect("repos.full_name", "pull_requests_full_name")
      .addSelect("repos.id", "pull_requests_repo_id")
      .where(`LOWER("pull_requests"."author_login")=:contributor`, { contributor: contributor.toLowerCase() });

    if (pageOptionsDto.rangeType === RangeTypeEnum.Recent) {
      queryBuilder
        .andWhere(`'${startDate}'::TIMESTAMP >= "pull_requests"."updated_at"`)
        .andWhere(`'${startDate}'::TIMESTAMP - INTERVAL '${range} days' <= "pull_requests"."updated_at"`);
    }

    queryBuilder
      .orderBy(`"pull_requests"."updated_at"`, OrderDirectionEnum.DESC)
      .offset(pageOptionsDto.skip)
      .limit(pageOptionsDto.limit);

    const itemCount = await queryBuilder.getCount();
    const entities = await queryBuilder.getMany();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async findAllWithFilters(pageOptionsDto: PullRequestPageOptionsDto): Promise<PageDto<DbPullRequest>> {
    const queryBuilder = this.baseQueryBuilder();
    const startDate = GetPrevDateISOString(pageOptionsDto.prev_days_start_date);
    const range = pageOptionsDto.range!;

    queryBuilder
      .innerJoin("repos", "repos", `"pull_requests"."repo_id"="repos"."id"`)
      .addSelect("repos.full_name", "pull_requests_full_name")
      .addSelect("repos.id", "pull_requests_repo_id");

    const filters = this.filterService.getRepoFilters(pageOptionsDto, startDate, range);

    switch (pageOptionsDto.topic) {
      case "hacktoberfest":
        filters.push([this.hacktoberfestPrFilterBuilderStart(), {}]);
        filters.push([this.hacktoberfestPrFilterBuilderEnd(range), {}]);
        break;
      default:
        filters.push([`'${startDate}'::TIMESTAMP >= "pull_requests"."updated_at"`, {}]);
        filters.push([`'${startDate}'::TIMESTAMP - INTERVAL '${range} days' <= "pull_requests"."updated_at"`, {}]);
        break;
    }

    if (pageOptionsDto.contributor) {
      filters.push([
        `LOWER("pull_requests"."author_login")=:contributor`,
        { contributor: decodeURIComponent(pageOptionsDto.contributor.toLowerCase()) },
      ]);
    }

    if (pageOptionsDto.listId) {
      filters.push([
        `author_login IN (
          SELECT login FROM
          user_list_contributors
          JOIN users ON user_list_contributors.user_id=users.id AND users.deleted_at IS NULL
          WHERE list_id=:listId
        )`,
        { listId: pageOptionsDto.listId },
      ]);
    }

    if (pageOptionsDto.status) {
      filters.push([`(LOWER("pull_requests"."state")=:status)`, { status: pageOptionsDto.status.toUpperCase() }]);
    }

    this.filterService.applyQueryBuilderFilters(queryBuilder, filters);

    if (pageOptionsDto.filter === InsightFilterFieldsEnum.Recent) {
      queryBuilder.orderBy(`"repos"."updated_at"`, "DESC");
    }

    queryBuilder
      .addOrderBy(`"pull_requests"."updated_at"`, OrderDirectionEnum.DESC)
      .offset(pageOptionsDto.skip)
      .limit(pageOptionsDto.limit);

    const itemCount = await queryBuilder.getCount();
    const entities = await queryBuilder.getMany();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async findAllContributorsWithFilters(
    pageOptionsDto: PullRequestContributorOptionsDto
  ): Promise<PageDto<DbPullRequestContributor>> {
    const queryBuilder = this.pullRequestRepository.manager.createQueryBuilder();
    const startDate = GetPrevDateISOString(pageOptionsDto.prev_days_start_date);
    const range = pageOptionsDto.range!;

    queryBuilder
      .from(DbPullRequest, "pull_requests")
      .distinct()
      .select("pull_requests.author_login", "author_login")
      .addSelect("MAX(pull_requests.updated_at)", "updated_at")
      .addSelect("users.id", "user_id")
      .innerJoin("repos", "repos", `"pull_requests"."repo_id"="repos"."id"`)
      .innerJoin("users", "users", `"pull_requests"."author_login"="users"."login"`)
      .addGroupBy("author_login")
      .addGroupBy("users.id");

    const filters = this.filterService.getRepoFilters(pageOptionsDto, startDate, range);

    switch (pageOptionsDto.topic) {
      case "hacktoberfest":
        filters.push([this.hacktoberfestPrFilterBuilderStart(), {}]);
        filters.push([this.hacktoberfestPrFilterBuilderEnd(range), {}]);
        break;
      default:
        filters.push([`'${startDate}'::TIMESTAMP >= "pull_requests"."updated_at"`, {}]);
        filters.push([`'${startDate}'::TIMESTAMP - INTERVAL '${range} days' <= "pull_requests"."updated_at"`, {}]);
        break;
    }

    this.filterService.applyQueryBuilderFilters(queryBuilder, filters);

    const subQuery = this.pullRequestRepository.manager
      .createQueryBuilder()
      .from(`(${queryBuilder.getQuery()})`, "subquery_for_count")
      .setParameters(queryBuilder.getParameters())
      .select("count(author_login)");

    const countQueryResult = await subQuery.getRawOne<{ count: number }>();
    const itemCount = parseInt(`${countQueryResult?.count ?? "0"}`, 10);

    queryBuilder
      .addOrderBy(`"updated_at"`, OrderDirectionEnum.DESC)
      .offset(pageOptionsDto.skip)
      .limit(pageOptionsDto.limit);

    const entities: DbPullRequestContributor[] = await queryBuilder.getRawMany();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async findNewContributorsInTimeRange(
    pageOptionsDto: PullRequestContributorInsightsDto
  ): Promise<PageDto<DbPullRequestContributor>> {
    const startDate = GetPrevDateISOString(pageOptionsDto.prev_days_start_date);
    const range = pageOptionsDto.range!;
    const repoIds = pageOptionsDto.repoIds?.split(",") ?? [];

    const queryBuilder = this.pullRequestRepository.manager.createQueryBuilder();
    const currentMonthQuery = this.getContributorRangeQueryBuilder(startDate, 0, range, repoIds);

    queryBuilder
      .select("current_month.author_login")
      .distinct()
      .from(`(${currentMonthQuery.getQuery()})`, "current_month")
      .leftJoin(
        (qb) =>
          qb
            .select("author_login")
            .distinct()
            .from(DbPullRequest, "pull_requests")
            .innerJoin("repos", "repos", `"pull_requests"."repo_id"="repos"."id"`)
            .where(`pull_requests.updated_at >= '${startDate}'::TIMESTAMP - INTERVAL '${range + range} days'`)
            .andWhere(`pull_requests.updated_at < '${startDate}'::TIMESTAMP - INTERVAL '${range} days'`)
            .andWhere("pull_requests.author_login != ''")
            .andWhere("repos.id IN (:...repoIds)", { repoIds }),
        "previous_month",
        "previous_month.author_login = current_month.author_login"
      )
      .where("previous_month.author_login IS NULL");

    const entities: DbPullRequestContributor[] = await queryBuilder.getRawMany();
    const itemCount = entities.length;

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async findAllRecentContributors(
    pageOptionsDto: PullRequestContributorInsightsDto
  ): Promise<PageDto<DbPullRequestContributor>> {
    const startDate = GetPrevDateISOString(pageOptionsDto.prev_days_start_date);
    const range = pageOptionsDto.range!;
    const repoIds = pageOptionsDto.repoIds?.split(",") ?? [];

    const queryBuilder = this.getContributorRangeQueryBuilder(startDate, 0, range, repoIds);
    const entities: DbPullRequestContributor[] = await queryBuilder.getRawMany();
    const itemCount = entities.length;

    const pageMetaDto = new PageMetaDto({
      itemCount,
      pageOptionsDto: { ...pageOptionsDto, limit: itemCount, skip: 0 },
    });

    return new PageDto(entities, pageMetaDto);
  }

  async findAllChurnContributors(
    pageOptionsDto: PullRequestContributorOptionsDto
  ): Promise<PageDto<DbPullRequestContributor>> {
    const startDate = GetPrevDateISOString(pageOptionsDto.prev_days_start_date);
    const range = pageOptionsDto.range!;
    const repoIds = pageOptionsDto.repoIds?.split(",") ?? [];

    const queryBuilder = this.pullRequestRepository.manager.createQueryBuilder();
    const prevMonthQuery = this.getContributorRangeQueryBuilder(startDate, range, range + range, repoIds);

    queryBuilder
      .select("previous_month.author_login")
      .distinct()
      .from(`(${prevMonthQuery.getQuery()})`, "previous_month")
      .leftJoin(
        (qb) =>
          qb
            .select("author_login")
            .distinct()
            .from(DbPullRequest, "pull_requests")
            .innerJoin("repos", "repos", `"pull_requests"."repo_id"="repos"."id"`)
            .where(`pull_requests.updated_at >= '${startDate}'::TIMESTAMP - INTERVAL '${range} days'`)
            .andWhere(`pull_requests.updated_at < '${startDate}'::TIMESTAMP - INTERVAL '0 days'`)
            .andWhere("pull_requests.author_login != ''")
            .andWhere("repos.id IN (:...repoIds)", { repoIds }),
        "current_month",
        "previous_month.author_login = current_month.author_login"
      )
      .where("current_month.author_login IS NULL");

    const entities: DbPullRequestContributor[] = await queryBuilder.getRawMany();
    const itemCount = entities.length;

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async findAllRepeatContributors(
    pageOptionsDto: PullRequestContributorOptionsDto
  ): Promise<PageDto<DbPullRequestContributor>> {
    const startDate = GetPrevDateISOString(pageOptionsDto.prev_days_start_date);
    const range = pageOptionsDto.range!;
    const repoIds = pageOptionsDto.repoIds?.split(",") ?? [];

    const queryBuilder = this.pullRequestRepository.manager.createQueryBuilder();
    const prevMonthQuery = this.getContributorRangeQueryBuilder(startDate, range, range + range, repoIds);

    queryBuilder
      .select("previous_month.author_login")
      .distinct()
      .from(`(${prevMonthQuery.getQuery()})`, "previous_month")
      .leftJoin(
        (qb) =>
          qb
            .select("author_login")
            .distinct()
            .from(DbPullRequest, "pull_requests")
            .innerJoin("repos", "repos", `"pull_requests"."repo_id"="repos"."id"`)
            .where(`pull_requests.updated_at >= '${startDate}'::TIMESTAMP - INTERVAL '${range} days'`)
            .andWhere(`pull_requests.updated_at < '${startDate}'::TIMESTAMP - INTERVAL '0 days'`)
            .andWhere("pull_requests.author_login != ''")
            .andWhere("repos.id IN (:...repoIds)", { repoIds }),
        "current_month",
        "previous_month.author_login = current_month.author_login"
      )
      .where("current_month.author_login IS NOT NULL");

    const entities: DbPullRequestContributor[] = await queryBuilder.getRawMany();
    const itemCount = entities.length;

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  private getContributorRangeQueryBuilder(
    start_date: string,
    start_range: number,
    end_range: number,
    repoIds: string[]
  ) {
    if (repoIds.length === 0) {
      throw new BadRequestException("Repo Ids cannot be empty");
    }

    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .select("author_login")
      .distinct()
      .innerJoin("repos", "repos", `"pull_requests"."repo_id"="repos"."id"`)
      .where(`pull_requests.updated_at >= '${start_date}'::TIMESTAMP - INTERVAL '${end_range} days'`)
      .andWhere(`pull_requests.updated_at < '${start_date}'::TIMESTAMP - INTERVAL '${start_range} days'`)
      .andWhere("pull_requests.author_login != ''")
      .andWhere("repos.id IN (:...repoIds)", { repoIds });

    return queryBuilder;
  }
}
