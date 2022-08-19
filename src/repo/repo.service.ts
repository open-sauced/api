import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { Repo } from "./entities/repo.entity";
import { PageOptionsDto } from "../common/dtos/page-options.dto";
import { PageMetaDto } from "../common/dtos/page-meta.dto";
import { PageDto } from "../common/dtos/page.dto";

@Injectable()
export class RepoService {
  constructor(
    @InjectRepository(Repo)
    private repoRepository: Repository<Repo>,
  ) {}

  // subQueryCount(subQuery: SelectQueryBuilder<any>, entity: string , alias: string, target = "repo") {
  //   const aliasName = `${alias}Count`;
  //   const aliasTable = `${alias}CountSelect`;
  //
  //   return subQuery
  //     .select("COUNT(DISTINCT id)", aliasName)
  //     .from(entity, aliasTable)
  //     .where(`${aliasTable}.${target}_id = ${target}.id`);
  // }

  baseQueryBuilder() {
    const builder = this.repoRepository.createQueryBuilder("repo")
      // .select(['repo.id'])
      // .leftJoinAndSelect("repo.user", "user")
      // .leftJoinAndSelect(RepoToUserStars, "stars")
      // .leftJoinAndMapMany("repo.contributions", Contribution, "contributions", "contributions.repo_id = repo.id")
      // .addSelect((qb) => this.subQueryCount(qb, "RepoToUserVotes", "votes"))
      // .addSelect((qb) => this.subQueryCount(qb, "RepoToUserSubmissions", "submissions"))
      // .addSelect((qb) => this.subQueryCount(qb, "RepoToUserStargazers", "stargazers"))
      // .addSelect((qb) => this.subQueryCount(qb, "RepoToUserStars", "stars"))
      .loadRelationCountAndMap("repo.contributionsCount", "repo.contributions")
      .loadRelationCountAndMap("repo.votesCount", "repo.repoToUserVotes")
      .loadRelationCountAndMap("repo.submissionsCount", "repo.repoToUserSubmissions")
      .loadRelationCountAndMap("repo.stargazersCount", "repo.repoToUserStargazers")
      .loadRelationCountAndMap("repo.starsCount", "repo.repoToUserStars");

    return builder;
  }

  async findOneById(id: number): Promise<Repo> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .where("repo.id = :id", { id });

    const item = await queryBuilder.getOne();

    if (!item) {
      throw new NotFoundException();
    }

    return item;
  }

  async findOneByOwnerAndRepo(owner: string, repo: string): Promise<Repo> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .where("repo.full_name = :name", {
        name: `${owner}/${repo}`
      });

    const item = await queryBuilder.getOne();

    if (!item) {
      throw new NotFoundException();
    }

    return item;
  }

  async findAll(
    pageOptionsDto: PageOptionsDto
  ): Promise<PageDto<Repo>> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .orderBy("repo.pushed_at", pageOptionsDto.order)
      .offset(pageOptionsDto.skip)
      .limit(pageOptionsDto.take);

    console.log(queryBuilder.getSql());

    const itemCount = await queryBuilder.getCount();
    const entities = await queryBuilder.getMany();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }
}
