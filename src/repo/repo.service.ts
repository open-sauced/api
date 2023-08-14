import { Injectable, NotFoundException } from "@nestjs/common";
import { ObjectLiteral, Repository, SelectQueryBuilder } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { PageMetaDto } from "../common/dtos/page-meta.dto";
import { PageDto } from "../common/dtos/page.dto";
import { OrderDirectionEnum } from "../common/constants/order-direction.constant";
import { InsightFilterFieldsEnum } from "../insight/dtos/insight-options.dto";
import { RepoFilterService } from "../common/filters/repo-filter.service";
import { RepoOrderFieldsEnum, RepoPageOptionsDto } from "./dtos/repo-page-options.dto";
import { DbRepo } from "./entities/repo.entity";
import { RepoSearchOptionsDto } from "./dtos/repo-search-options.dto";

@Injectable()
export class RepoService {
  constructor(
    @InjectRepository(DbRepo, "ApiConnection")
    private repoRepository: Repository<DbRepo>,
    private filterService: RepoFilterService
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

      /*
       * .select(['repo.id'])
       * .leftJoinAndSelect("repo.user", "user")
       * .leftJoinAndSelect(DbRepoToUserStars, "stars")
       * .leftJoinAndMapMany("repo.contributions", DbContribution, "contributions", "contributions.repo_id = repo.id")
       */

      .addSelect((qb) => this.subQueryCount(qb, "DbContribution", "contributions"), "contributionsCount")
      .addSelect((qb) => this.subQueryCount(qb, "DbRepoToUserVotes", "votes"), "votesCount")
      .addSelect((qb) => this.subQueryCount(qb, "DbRepoToUserSubmissions", "submissions"), "submissionsCount")
      .addSelect((qb) => this.subQueryCount(qb, "DbRepoToUserStargazers", "stargazers"), "stargazersCount")
      .addSelect((qb) => this.subQueryCount(qb, "DbRepoToUserStars", "stars"), "starsCount")
      .loadRelationCountAndMap("repo.contributionsCount", "repo.contributions")
      .loadRelationCountAndMap("repo.votesCount", "repo.repoToUserVotes")
      .loadRelationCountAndMap("repo.submissionsCount", "repo.repoToUserSubmissions")
      .loadRelationCountAndMap("repo.stargazersCount", "repo.repoToUserStargazers")
      .loadRelationCountAndMap("repo.starsCount", "repo.repoToUserStars");

    return builder;
  }

  private baseFilterQueryBuilder(range = 30) {
    return this.repoRepository
      .createQueryBuilder("repos")
      .addSelect(
        `(
          SELECT COALESCE(COUNT("open_pull_requests"."id"), 0)
          FROM "pull_requests" "open_pull_requests"
          WHERE
            LOWER("open_pull_requests"."state") = 'open'
            AND "open_pull_requests"."repo_id" = "repos"."id"
            AND now() - INTERVAL '${range} days' <= "open_pull_requests"."updated_at"
        )::INTEGER`,
        "repos_open_prs_count"
      )
      .addSelect(
        `(
          SELECT COALESCE(COUNT("closed_pull_requests"."id"), 0)
          FROM "pull_requests" "closed_pull_requests"
          WHERE
            LOWER("closed_pull_requests"."state") = 'closed'
            AND "closed_pull_requests"."merged" = false
            AND "closed_pull_requests"."repo_id" = "repos"."id"
            AND now() - INTERVAL '${range} days' <= "closed_pull_requests"."updated_at"
        )::INTEGER`,
        `repos_closed_prs_count`
      )
      .addSelect(
        `(
          SELECT COALESCE(COUNT("merged_pull_requests"."id"), 0)
          FROM "pull_requests" "merged_pull_requests"
          WHERE
            (LOWER("merged_pull_requests"."state") = 'merged'
            OR "merged_pull_requests"."merged" = true)
            AND "merged_pull_requests"."repo_id" = "repos"."id"
            AND now() - INTERVAL '${range} days' <= "merged_pull_requests"."updated_at"
        )::INTEGER`,
        `repos_merged_prs_count`
      )
      .addSelect(
        `(
          SELECT COALESCE(COUNT("draft_pull_requests"."id"), 0)
          FROM "pull_requests" "draft_pull_requests"
          WHERE
            "draft_pull_requests"."draft" = true
            AND "draft_pull_requests"."repo_id" = "repos"."id"
            AND now() - INTERVAL '${range} days' <= "draft_pull_requests"."updated_at"
        )::INTEGER`,
        `repos_draft_prs_count`
      )
      .addSelect(
        `(
          SELECT COALESCE(COUNT("spam_pull_requests"."id"), 0)
          FROM "pull_requests" "spam_pull_requests"
          WHERE
            'spam' = ANY("spam_pull_requests"."label_names")
            AND "spam_pull_requests"."repo_id" = "repos"."id"
            AND now() - INTERVAL '${range} days' <= "spam_pull_requests"."updated_at"
        )::INTEGER`,
        `repos_spam_prs_count`
      )
      .addSelect(
        `(
          SELECT COALESCE(AVG("pull_requests_velocity"."closed_at"::DATE-"pull_requests_velocity"."created_at"::DATE), 0)
          FROM "pull_requests" "pull_requests_velocity"
          WHERE
            "pull_requests_velocity"."repo_id" = "repos"."id"
            AND "pull_requests_velocity"."closed_at" > "pull_requests_velocity"."created_at"
            AND now() - INTERVAL '${range} days' <= "pull_requests_velocity"."updated_at"
        )::INTEGER`,
        `repos_pr_velocity_count`
      )
      .addSelect(
        `(
          SELECT COALESCE(COUNT("active_pull_requests"."id"), 0)
          FROM "pull_requests" "active_pull_requests"
          WHERE
            "active_pull_requests"."repo_id" = "repos"."id"
            AND now() - INTERVAL '${range} days' <= "active_pull_requests"."updated_at"
            AND "active_pull_requests".state != 'closed'
        )::INTEGER`,
        `repo_active_prs_count`
      );
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

    queryBuilder.where("repo.full_name = :name", { name: `${owner}/${repo}` });

    const item = await queryBuilder.getOne();

    if (!item) {
      throw new NotFoundException();
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
    const range = pageOptionsDto.range!;
    const queryBuilder = this.baseFilterQueryBuilder(range);

    const filters = this.filterService.getRepoFilters(pageOptionsDto, range);

    if (!pageOptionsDto.repoIds && !pageOptionsDto.repo) {
      filters.push([`now() - INTERVAL '${range} days' <= "repos"."updated_at"`, { range }]);
    }

    this.filterService.applyQueryBuilderFilters(queryBuilder, filters);

    if (pageOptionsDto.filter === InsightFilterFieldsEnum.Recent) {
      queryBuilder.orderBy(`"repos"."updated_at"`, "DESC");
    }

    const countQueryBuilder = this.baseFilterQueryBuilder(range);

    countQueryBuilder.select("repos.id", "repos_id");

    const countFilters = this.filterService.getRepoFilters(pageOptionsDto, range);

    if (!pageOptionsDto.repoIds) {
      countFilters.push([`now() - INTERVAL '${range} days' <= "repos"."updated_at"`, { range }]);
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

    return new PageDto(entities, pageMetaDto);
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
}
