import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository, SelectQueryBuilder } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { DbRepo } from "./entities/repo.entity";
import { PageMetaDto } from "../common/dtos/page-meta.dto";
import { PageDto } from "../common/dtos/page.dto";
import { RepoPageOptionsDto } from "./dtos/repo-page-options.dto";
import { OrderDirectionEnum } from "../common/constants/order-direction.constant";

@Injectable()
export class RepoService {
  constructor (
    @InjectRepository(DbRepo)
    private repoRepository: Repository<DbRepo>,
  ) {}

  subQueryCount<T> (subQuery: SelectQueryBuilder<T>, entity: string, alias: string, target = "repo") {
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
    const orderField = pageOptionsDto.orderBy ?? "is_fork";

    if (userId) {
      userRelations?.map(relation =>
        queryBuilder
          .innerJoin(`repo.repoToUser${relation}`, `authUser${relation}`, `authUser${relation}.user_id = :userId`, { userId }));
    }

    queryBuilder
      .orderBy(`"repo"."is_fork"`, OrderDirectionEnum.ASC)
      .addOrderBy(`"${orderField}"`, pageOptionsDto.orderDirection)
      .addOrderBy(`"repo"."stars"`, OrderDirectionEnum.DESC)
      .addOrderBy(`"repo"."created_at"`, OrderDirectionEnum.DESC)
      .offset(pageOptionsDto.skip)
      .limit(pageOptionsDto.limit);

    // console.log(queryBuilder.getSql());

    const itemCount = await queryBuilder.getCount();
    const entities = await queryBuilder.getMany();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }
}
