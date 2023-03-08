import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { DbPullRequest } from "./entities/pull-request.entity";
import { PageMetaDto } from "../common/dtos/page-meta.dto";
import { PageDto } from "../common/dtos/page.dto";
import { OrderDirectionEnum } from "../common/constants/order-direction.constant";
import { PageOptionsDto } from "../common/dtos/page-options.dto";
import { PullRequestPageOptionsDto } from "./dtos/pull-request-page-options.dto";
import { RepoFilterService } from "../common/filters/repo-filter.service";
import { InsightFilterFieldsEnum } from "../insight/dtos/insight-options.dto";

@Injectable()
export class PullRequestService {
  constructor (
    @InjectRepository(DbPullRequest, "ApiConnection")
    private pullRequestRepository: Repository<DbPullRequest>,
    private filterService: RepoFilterService,
  ) {}

  baseQueryBuilder () {
    const builder = this.pullRequestRepository.createQueryBuilder("pull_requests");

    return builder;
  }

  async findAll (
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<DbPullRequest>> {
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

  async findAllByContributor (
    contributor: string,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<DbPullRequest>> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .where(`LOWER("pull_requests"."author_login")=LOWER(:contributor)`, { contributor })
      .orderBy(`"pull_requests"."updated_at"`, OrderDirectionEnum.DESC)
      .offset(pageOptionsDto.skip)
      .limit(pageOptionsDto.limit);

    const itemCount = await queryBuilder.getCount();
    const entities = await queryBuilder.getMany();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async findAllWithFilters (
    pageOptionsDto: PullRequestPageOptionsDto,
  ): Promise<PageDto<DbPullRequest>> {
    const queryBuilder = this.baseQueryBuilder();
    const range = pageOptionsDto.range!;

    queryBuilder
      .innerJoin("repos", "repos", `"pull_requests"."repo_id"=repos.id`);

    const filters = this.filterService.getRepoFilters(pageOptionsDto, range);

    filters.push([`now() - INTERVAL '${range} days' <= "pull_requests"."updated_at"`, {}]);

    if (pageOptionsDto.contributor) {
      filters.push([`LOWER("pull_requests"."author_login")=LOWER(:contributor)`, { contributor: decodeURIComponent(pageOptionsDto.contributor ) }]);
    }

    if (pageOptionsDto.status) {
      filters.push([`("pull_requests"."state"=:status)`, { status: pageOptionsDto.status }]);
    }

    this.filterService.applyQueryBuilderFilters(queryBuilder, filters);

    if (pageOptionsDto.filter === InsightFilterFieldsEnum.Recent) {
      queryBuilder
        .orderBy(`"repos"."updated_at"`, "DESC");
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
}
