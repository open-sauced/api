import { Inject, Injectable, NotFoundException, forwardRef } from "@nestjs/common";
import { ObjectLiteral, Repository, SelectQueryBuilder } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { PageMetaDto } from "../common/dtos/page-meta.dto";
import { PageDto } from "../common/dtos/page.dto";
import { OrderDirectionEnum } from "../common/constants/order-direction.constant";
import { InsightFilterFieldsEnum } from "../insight/dtos/insight-options.dto";
import { RepoFilterService } from "../common/filters/repo-filter.service";
import { PageOptionsDto } from "../common/dtos/page-options.dto";
import { GetPrevDateISOString } from "../common/util/datetimes";
import { PullRequestGithubEventsService } from "../timescale/pull_request_github_events.service";
import { RepoOrderFieldsEnum, RepoPageOptionsDto } from "./dtos/repo-page-options.dto";
import { DbRepo } from "./entities/repo.entity";
import { RepoSearchOptionsDto } from "./dtos/repo-search-options.dto";

@Injectable()
export class RepoService {
  constructor(
    @InjectRepository(DbRepo, "ApiConnection")
    private repoRepository: Repository<DbRepo>,
    private filterService: RepoFilterService,
    @Inject(forwardRef(() => PullRequestGithubEventsService))
    private pullRequestGithubEventsService: PullRequestGithubEventsService
  ) {}

  subQueryCount<T extends ObjectLiteral>(
    subQuery: SelectQueryBuilder<T>,
    entity: string,
    alias: string,
    target = "repo"
  ) {
    const aliasName = `${alias}Count`;
    const aliasTable = `${alias}CountSelect`;

    return subQuery
      .select("COUNT(DISTINCT id)", aliasName)
      .from(entity, aliasTable)
      .where(`${aliasTable}.${target}_id = ${target}.id`);
  }

  baseQueryBuilder() {
    const builder = this.repoRepository
      .createQueryBuilder("repo")
      .addSelect((qb) => this.subQueryCount(qb, "DbRepoToUserVotes", "votes"), "votesCount")
      .addSelect((qb) => this.subQueryCount(qb, "DbRepoToUserSubmissions", "submissions"), "submissionsCount")
      .addSelect((qb) => this.subQueryCount(qb, "DbRepoToUserStargazers", "stargazers"), "stargazersCount")
      .addSelect((qb) => this.subQueryCount(qb, "DbRepoToUserStars", "stars"), "starsCount")
      .loadRelationCountAndMap("repo.votesCount", "repo.repoToUserVotes")
      .loadRelationCountAndMap("repo.submissionsCount", "repo.repoToUserSubmissions")
      .loadRelationCountAndMap("repo.stargazersCount", "repo.repoToUserStargazers")
      .loadRelationCountAndMap("repo.starsCount", "repo.repoToUserStars");

    return builder;
  }

  private baseFilterQueryBuilder() {
    return this.repoRepository.createQueryBuilder("repos");
  }

  async findOneById(id: number): Promise<DbRepo> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder.where("repo.id = :id", { id });

    const item = await queryBuilder.getOne();

    if (!item) {
      throw new NotFoundException();
    }

    return item;
  }

  async findOneByOwnerAndRepo(owner: string, repo: string): Promise<DbRepo> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder.where("LOWER(repo.full_name) = :name", { name: `${owner}/${repo}`.toLowerCase() });

    const item = await queryBuilder.getOne();

    if (!item) {
      throw new NotFoundException(`Repository not found: ${owner}/${repo}`);
    }

    return item;
  }

  async findAll(
    pageOptionsDto: RepoPageOptionsDto,
    userId?: number,
    userRelations?: string[]
  ): Promise<PageDto<DbRepo>> {
    const queryBuilder = this.baseQueryBuilder();
    const orderField = pageOptionsDto.orderBy ?? RepoOrderFieldsEnum.stars;

    if (userId) {
      userRelations?.map((relation) =>
        queryBuilder.innerJoin(
          `repo.repoToUser${relation}`,
          `authUser${relation}`,
          `authUser${relation}.user_id = :userId`,
          { userId }
        )
      );
    }

    queryBuilder
      .orderBy(`"repo"."is_fork"`, OrderDirectionEnum.ASC)
      .addOrderBy(`"${orderField}"`, pageOptionsDto.orderDirection)
      .addOrderBy(`"repo"."created_at"`, OrderDirectionEnum.DESC)
      .offset(pageOptionsDto.skip)
      .limit(pageOptionsDto.limit);

    const itemCount = await queryBuilder.getCount();
    const entities = await queryBuilder.getMany();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async findAllWithFilters(pageOptionsDto: RepoSearchOptionsDto): Promise<PageDto<DbRepo>> {
    const orderField = pageOptionsDto.orderBy ?? "stars";
    const startDate = GetPrevDateISOString(pageOptionsDto.prev_days_start_date);
    const prevDaysStartDate = pageOptionsDto.prev_days_start_date!;
    const range = pageOptionsDto.range!;

    const queryBuilder = this.baseFilterQueryBuilder();

    const filters = this.filterService.getRepoFilters(pageOptionsDto, startDate, range);

    if (!pageOptionsDto.repoIds && !pageOptionsDto.repo) {
      filters.push([`'${startDate}'::TIMESTAMP >= "repos"."updated_at"`, { range }]);
      filters.push([`'${startDate}'::TIMESTAMP - INTERVAL '${range} days' <= "repos"."updated_at"`, { range }]);
    }

    this.filterService.applyQueryBuilderFilters(queryBuilder, filters);

    if (pageOptionsDto.filter === InsightFilterFieldsEnum.Recent) {
      queryBuilder.orderBy(`"repos"."updated_at"`, "DESC");
    }

    const countQueryBuilder = this.baseFilterQueryBuilder().select("repos.id", "repos_id");

    const countFilters = this.filterService.getRepoFilters(pageOptionsDto, startDate, range);

    if (!pageOptionsDto.repoIds) {
      countFilters.push([`'${startDate}'::TIMESTAMP >= "repos"."updated_at"`, { range }]);
      countFilters.push([`'${startDate}'::TIMESTAMP - INTERVAL '${range} days' <= "repos"."updated_at"`, { range }]);
    }

    this.filterService.applyQueryBuilderFilters(countQueryBuilder, countFilters);

    const subQuery = this.repoRepository.manager
      .createQueryBuilder()
      .from(`(${countQueryBuilder.getQuery()})`, "subquery_for_count")
      .setParameters(countQueryBuilder.getParameters())
      .select("count(repos_id)");

    const countQueryResult = await subQuery.getRawOne<{ count: number }>();
    const itemCount = parseInt(`${countQueryResult?.count ?? "0"}`, 10);

    queryBuilder
      .addOrderBy(`"repos"."${orderField}"`, OrderDirectionEnum.DESC)
      .offset(pageOptionsDto.skip)
      .limit(pageOptionsDto.limit);

    const entities = await queryBuilder.getMany();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    // get PR stats for each repo found through filtering
    const promises = entities.map(async (entity) => {
      const prStats = await this.pullRequestGithubEventsService.findPrStatsByRepo(
        entity.full_name,
        range,
        prevDaysStartDate
      );

      return {
        ...entity,
        pr_active_count: prStats.active_prs,
        open_prs_count: prStats.open_prs,
        merged_prs_count: prStats.accepted_prs,
        spam_prs_count: prStats.spam_prs,
        draft_prs_count: prStats.draft_prs,
        closed_prs_count: prStats.closed_prs,
        pr_velocity_count: prStats.pr_velocity,
      } as DbRepo;
    });

    const updatedEntities = await Promise.all(promises);

    return new PageDto(updatedEntities, pageMetaDto);
  }

  async findRecommendations(interests: string[]): Promise<Record<string, DbRepo[]>> {
    const queryBuilder = this.repoRepository.createQueryBuilder("repo");
    const userInterests: Record<string, DbRepo[]> = {};

    const promises = interests.map(async (interest) => {
      queryBuilder
        .where(`(:topic = ANY("repo"."topics"))`, { topic: interest })
        .andWhere(
          `
          repo.id IN (
            SELECT repo_id FROM pull_requests
            WHERE now() - INTERVAL '30 days' <= "pull_requests"."updated_at"
          )
        `
        )
        .orderBy(`"repo"."updated_at"`, "DESC")
        .limit(3);

      return queryBuilder.getMany();
    });

    const results = await Promise.all(promises);

    interests.forEach((interest, index) => {
      userInterests[interest] = results[index];
    });

    return userInterests;
  }

  async findOrgsRecommendations(userId: number, pageOptionsDto: PageOptionsDto) {
    const queryBuilder = this.baseFilterQueryBuilder();
    const startDate = GetPrevDateISOString(pageOptionsDto.prev_days_start_date);
    const range = pageOptionsDto.range!;

    queryBuilder
      .leftJoin(
        (qb: SelectQueryBuilder<DbRepo>) =>
          qb
            .select("users.id", "id")
            .addSelect("users.login", "login")
            .addSelect("user_orgs.user_id", "user_id")
            .from("user_organizations", "user_orgs")
            .innerJoin("users", "users", "user_orgs.organization_id = users.id"),
        "user_orgs",
        "repos.full_name LIKE user_orgs.login || '/%'"
      )
      .where("user_orgs.user_id = :userId", { userId })
      .andWhere(`'${startDate}'::TIMESTAMP >= "repos"."updated_at"`)
      .andWhere(`'${startDate}'::TIMESTAMP - INTERVAL '${range} days' <= "repos"."updated_at"`)
      .orderBy("repos.stars", pageOptionsDto.orderDirection)
      .addOrderBy("repos.updated_at", pageOptionsDto.orderDirection);

    queryBuilder.offset(pageOptionsDto.skip).limit(pageOptionsDto.limit);

    const entities = await queryBuilder.getMany();
    const itemCount = await queryBuilder.getCount();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }
}
