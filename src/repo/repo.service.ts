import { Injectable, NotFoundException } from "@nestjs/common";
import { ObjectLiteral, Repository, SelectQueryBuilder } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { DbRepo } from "./entities/repo.entity";
import { PageMetaDto } from "../common/dtos/page-meta.dto";
import { PageDto } from "../common/dtos/page.dto";
import { RepoOrderFieldsEnum, RepoPageOptionsDto } from "./dtos/repo-page-options.dto";
import { OrderDirectionEnum } from "../common/constants/order-direction.constant";
import { InsightFilterFieldsEnum } from "../insight/dtos/insight-options.dto";
import { RepoFilterService } from "../common/filters/repo-filter.service";
import { RepoSearchOptionsDto } from "./dtos/repo-search-options.dto";

@Injectable()
export class RepoService {
  constructor (
    @InjectRepository(DbRepo, "ApiConnection")
    private repoRepository: Repository<DbRepo>,
    private filterService: RepoFilterService,
  ) {}

  subQueryCount<T extends ObjectLiteral> (subQuery: SelectQueryBuilder<T>, entity: string, alias: string, target = "repo") {
    const aliasName = `${alias}Count`;
    const aliasTable = `${alias}CountSelect`;

    return subQuery
      .select("COUNT(DISTINCT id)", aliasName)
      .from(entity, aliasTable)
      .where(`${aliasTable}.${target}_id = ${target}.id`);
  }

  baseQueryBuilder () {
    const builder = this.repoRepository.createQueryBuilder("repo")

    /*
     * .select(['repo.id'])
     * .leftJoinAndSelect("repo.user", "user")
     * .leftJoinAndSelect(DbRepoToUserStars, "stars")
     * .leftJoinAndMapMany("repo.contributions", DbContribution, "contributions", "contributions.repo_id = repo.id")
     */

      .addSelect(qb => this.subQueryCount(qb, "DbContribution", "contributions"), "contributionsCount")
      .addSelect(qb => this.subQueryCount(qb, "DbRepoToUserVotes", "votes"), "votesCount")
      .addSelect(qb => this.subQueryCount(qb, "DbRepoToUserSubmissions", "submissions"), "submissionsCount")
      .addSelect(qb => this.subQueryCount(qb, "DbRepoToUserStargazers", "stargazers"), "stargazersCount")
      .addSelect(qb => this.subQueryCount(qb, "DbRepoToUserStars", "stars"), "starsCount")
      .loadRelationCountAndMap("repo.contributionsCount", "repo.contributions")
      .loadRelationCountAndMap("repo.votesCount", "repo.repoToUserVotes")
      .loadRelationCountAndMap("repo.submissionsCount", "repo.repoToUserSubmissions")
      .loadRelationCountAndMap("repo.stargazersCount", "repo.repoToUserStargazers")
      .loadRelationCountAndMap("repo.starsCount", "repo.repoToUserStars");

    return builder;
  }

  async findOneById (id: number): Promise<DbRepo> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .where("repo.id = :id", { id });

    const item = await queryBuilder.getOne();

    if (!item) {
      throw (new NotFoundException);
    }

    return item;
  }

  async findOneByOwnerAndRepo (owner: string, repo: string): Promise<DbRepo> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .where("repo.full_name = :name", { name: `${owner}/${repo}` });

    const item = await queryBuilder.getOne();

    if (!item) {
      throw (new NotFoundException);
    }

    return item;
  }

  async findAll (
    pageOptionsDto: RepoPageOptionsDto,
    userId?: number,
    userRelations?: string[],
  ): Promise<PageDto<DbRepo>> {
    const queryBuilder = this.baseQueryBuilder();
    const orderField = pageOptionsDto.orderBy ?? RepoOrderFieldsEnum.stars;

    if (userId) {
      userRelations?.map(relation =>
        queryBuilder
          .innerJoin(`repo.repoToUser${relation}`, `authUser${relation}`, `authUser${relation}.user_id = :userId`, { userId }));
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

  async findAllWithFilters (pageOptionsDto: RepoSearchOptionsDto): Promise<PageDto<DbRepo>> {
    const queryBuilder = this.repoRepository.createQueryBuilder("repos");
    const orderField = pageOptionsDto.orderBy ?? "stars";
    const range = pageOptionsDto.range!;

    const filters = this.filterService.getRepoFilters(pageOptionsDto, range);

    filters.push([`now() - INTERVAL '${range} days' <= "repos"."updated_at"`, { range }]);

    this.filterService.applyQueryBuilderFilters(queryBuilder, filters);

    if (pageOptionsDto.filter === InsightFilterFieldsEnum.Recent) {
      queryBuilder.orderBy(`"repos"."${orderField}"`, "DESC");
    }

    const subQuery = this.repoRepository.manager.createQueryBuilder()
      .from(`(${queryBuilder.getQuery()})`, "subquery_for_count")
      .setParameters(queryBuilder.getParameters())
      .select("count(repos_id)");

    const countQueryResult = await subQuery.getRawOne<{ count: number }>();
    const itemCount = parseInt(`${countQueryResult?.count ?? "0"}`, 10);

    queryBuilder
      .orderBy(`"repos"."${orderField}"`, OrderDirectionEnum.DESC)
      .offset(pageOptionsDto.skip)
      .limit(pageOptionsDto.limit);

    const entities = await queryBuilder.getMany();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }
}
