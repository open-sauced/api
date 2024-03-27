import { BadRequestException, Inject, Injectable, NotFoundException, forwardRef } from "@nestjs/common";
import { ObjectLiteral, Repository, SelectQueryBuilder } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { ConfigService } from "@nestjs/config";
import { Octokit } from "@octokit/rest";
import { PageMetaDto } from "../common/dtos/page-meta.dto";
import { PageDto } from "../common/dtos/page.dto";
import { OrderDirectionEnum } from "../common/constants/order-direction.constant";
import { InsightFilterFieldsEnum } from "../insight/dtos/insight-options.dto";
import { RepoFilterService } from "../common/filters/repo-filter.service";
import { PageOptionsDto } from "../common/dtos/page-options.dto";
import { GetPrevDateISOString } from "../common/util/datetimes";
import { PullRequestGithubEventsService } from "../timescale/pull_request_github_events.service";
import { RepoDevstatsService } from "../timescale/repo-devstats.service";
import { UserService } from "../user/services/user.service";
import { ForkGithubEventsService } from "../timescale/fork_github_events.service";
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
    private pullRequestGithubEventsService: PullRequestGithubEventsService,
    private forkGithubEventsService: ForkGithubEventsService,
    private repoDevstatsService: RepoDevstatsService,
    private configService: ConfigService,
    private userService: UserService
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

  private async findAllWithFiltersScaffolding(
    pageOptionsDto: RepoSearchOptionsDto,
    workspaceId: string | undefined
  ): Promise<PageDto<DbRepo>> {
    const orderField = pageOptionsDto.orderBy ?? "stars";
    const startDate = GetPrevDateISOString(pageOptionsDto.prev_days_start_date);
    const prevDaysStartDate = pageOptionsDto.prev_days_start_date!;
    const range = pageOptionsDto.range!;

    const queryBuilder = this.baseFilterQueryBuilder().withDeleted().addSelect("repos.deleted_at");

    const filters = this.filterService.getRepoFilters(pageOptionsDto);

    if (!pageOptionsDto.repoIds && !pageOptionsDto.repo && !workspaceId) {
      filters.push([`'${startDate}'::TIMESTAMP >= "repos"."updated_at"`, { range }]);
      filters.push([`'${startDate}'::TIMESTAMP - INTERVAL '${range} days' <= "repos"."updated_at"`, { range }]);
    }

    this.filterService.applyQueryBuilderFilters(queryBuilder, filters);

    if (workspaceId) {
      queryBuilder
        .innerJoin("workspace_repos", "workspace_repos", "workspace_repos.repo_id = repos.id")
        .andWhere("workspace_repos.workspace_id = :workspaceId", { workspaceId });
    }

    if (pageOptionsDto.filter === InsightFilterFieldsEnum.Recent) {
      queryBuilder.orderBy(`"repos"."updated_at"`, "DESC");
    }

    const cteCounter = this.repoRepository.manager
      .createQueryBuilder()
      .addCommonTableExpression(queryBuilder, "CTE")
      .setParameters(queryBuilder.getParameters())
      .select(`COUNT(*) as count`)
      .from("CTE", "CTE");

    const countQueryResult = await cteCounter.getRawOne<{ count: number }>();
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

      const forksHisto = await this.forkGithubEventsService.genForkHistogram({ repo: entity.full_name, range });
      const forksVelocity = forksHisto.reduce((acc, curr) => acc + curr.forks_count, 0) / range;
      const activityRatio = await this.repoDevstatsService.calculateRepoActivityRatio(entity.full_name, range);
      const confidence = await this.repoDevstatsService.calculateContributorConfidence(entity.full_name, range);

      return {
        ...entity,
        pr_active_count: prStats.active_prs,
        open_prs_count: prStats.open_prs,
        merged_prs_count: prStats.accepted_prs,
        spam_prs_count: prStats.spam_prs,
        draft_prs_count: prStats.draft_prs,
        closed_prs_count: prStats.closed_prs,
        pr_velocity_count: prStats.pr_velocity,
        fork_velocity: forksVelocity,
        activity_ratio: activityRatio,
        contributor_confidence: confidence,
        health: activityRatio,
      } as DbRepo;
    });

    const updatedEntities = await Promise.all(promises);

    return new PageDto(updatedEntities, pageMetaDto);
  }

  async findAllWithFilters(pageOptionsDto: RepoSearchOptionsDto): Promise<PageDto<DbRepo>> {
    return this.findAllWithFiltersScaffolding(pageOptionsDto, undefined);
  }

  async findAllWithFiltersInWorkspace(
    pageOptionsDto: RepoSearchOptionsDto,
    workspaceId: string
  ): Promise<PageDto<DbRepo>> {
    return this.findAllWithFiltersScaffolding(pageOptionsDto, workspaceId);
  }

  async findRecommendations(interests: string[]): Promise<Record<string, DbRepo[]>> {
    const queryBuilder = this.repoRepository.createQueryBuilder("repo");
    const userInterests: Record<string, DbRepo[]> = {};

    const promises = interests.map(async (interest) => {
      queryBuilder
        .where(`(:topic = ANY("repo"."topics"))`, { topic: interest })
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

  async tryFindRepoOrMakeStub(repoId?: number, repoOwner?: string, repoName?: string): Promise<DbRepo> {
    if (!repoId && (!repoOwner || !repoName)) {
      throw new BadRequestException("must provide repo ID or repo owner/name");
    }

    let repo;

    try {
      if (repoId) {
        repo = await this.findOneById(repoId);
      } else if (repoOwner && repoName) {
        repo = await this.findOneByOwnerAndRepo(repoOwner, repoName);
      }
    } catch (e) {
      // could not find repo being added to workspace in our database. Add it.
      if (repoId && !repoOwner && !repoName) {
        throw new BadRequestException(
          `no repo by repo ID ${repoId} found in DB: must also provide repo owner/name to create stub user from GitHub`
        );
      } else if (repoOwner && repoName) {
        repo = await this.createStubRepo(repoOwner, repoName);
      }
    }

    if (!repo) {
      throw new NotFoundException("could not find nor create repo");
    }

    return repo;
  }

  private async createStubRepo(owner: string, repo: string): Promise<DbRepo> {
    const ghAuthToken: string = this.configService.get("github.authToken")!;

    // using octokit and GitHub's API, go fetch the user
    const octokit = new Octokit({
      auth: ghAuthToken,
    });

    let octoResponse;

    try {
      octoResponse = await octokit.repos.get({
        owner,
        repo,
      });
    } catch (error: unknown) {
      console.error(error);
      throw new BadRequestException("Error fetching repo:", `${owner}/${repo}`);
    }

    const parts = octoResponse.data.full_name.split("/");

    if (parts.length !== 2) {
      throw new NotFoundException("");
    }

    /*
     * because there is a reference to the "user" (the owner) of a repo
     * in the repos table, we need to ensure we find or create the user
     */
    const user = await this.userService.tryFindUserOrMakeStub(undefined, parts[0]);

    /*
     * create a new, minimum, partial repo based on GitHub data (primarily, the ID).
     * Because our first party databases for repos uses the GitHub IDs as primary keys,
     * we can't use an auto generated ID for a stub repo.
     *
     * This stub repo will eventually get picked up by the ETL and more data will get backfilled.
     */

    return this.repoRepository.save({
      id: octoResponse.data.id,
      user_id: user.id,
      name: octoResponse.data.name,
      full_name: octoResponse.data.full_name,
    });
  }
}
