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
import { DbPullRequestInsight } from "./entities/pull-request-insights.entity";

@Injectable()
export class PullRequestService {
  constructor (
    @InjectRepository(DbPullRequest, "ApiConnection")
    private pullRequestRepository: Repository<DbPullRequest>,
    @InjectRepository(DbPullRequestInsight, "ApiConnection")
    private pullRequestInsightsRepository: Repository<DbPullRequestInsight>,
    private filterService: RepoFilterService,
  ) {}

  baseQueryBuilder () {
    const builder = this.pullRequestRepository.createQueryBuilder("pull_requests");

    return builder;
  }

  insightsQueryBuilder () {
    const builder = this.pullRequestInsightsRepository.createQueryBuilder("pull_requests_insights");

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
    const queryBuilder = this.insightsQueryBuilder();
    const range = pageOptionsDto.range!;

    const filters: [string, object?][] = [];

    filters.push([`now() - INTERVAL '${range} days' <= "updated_at"`]);

    if (pageOptionsDto.repoIds) {
      filters.push([`repo_id IN (:...repoIds)`, { repoIds: pageOptionsDto.repoIds.split(",") }]);
    }

    if (pageOptionsDto.repo) {
      filters.push([`LOWER(repo_full_name)=LOWER(:repo)`, { repo: decodeURIComponent(pageOptionsDto.repo) }]);
    }

    if (pageOptionsDto.topic) {
      filters.push([`:topic = ANY("repo_topics")`, { topic: pageOptionsDto.topic }]);
    }

    if (pageOptionsDto.filter === InsightFilterFieldsEnum.Recent) {
      filters.push(["repo_stars >= 1000"]);
    } else if (pageOptionsDto.filter === InsightFilterFieldsEnum.Top100) {
      filters.push(["repo_is_top_100 = true"]);
    } else if (pageOptionsDto.filter === InsightFilterFieldsEnum.MostSpammed) {
      filters.push(["repo_has_spam = true"]);
    } else if (pageOptionsDto.filter === InsightFilterFieldsEnum.MostActive) {
      queryBuilder.orderBy(`"repo_recent_contributor_count"`, "DESC");
    } else if (pageOptionsDto.filter === InsightFilterFieldsEnum.MinimumContributors) {
      filters.push(["repo_recent_contributor_count >= 5"]);
    }

    if (pageOptionsDto.contributor) {
      filters.push([`LOWER("author_login")=LOWER(:contributor)`, { contributor: decodeURIComponent(pageOptionsDto.contributor ) }]);
    }

    if (pageOptionsDto.status) {
      filters.push([`("state"=:status)`, { status: pageOptionsDto.status }]);
    }

    this.filterService.applyQueryBuilderFilters(queryBuilder, filters);

    if (pageOptionsDto.filter === InsightFilterFieldsEnum.Recent) {
      queryBuilder
        .orderBy(`"repo_updated_at"`, "DESC");
    }

    queryBuilder
      .addOrderBy(`"updated_at"`, OrderDirectionEnum.DESC)
      .offset(pageOptionsDto.skip)
      .limit(pageOptionsDto.limit);

    const itemCount = await queryBuilder.getCount();
    const entities = await queryBuilder.getMany();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }
}
