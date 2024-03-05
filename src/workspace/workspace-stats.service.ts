import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository, SelectQueryBuilder } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { sanitizeRepos } from "../timescale/common/repos";
import { RepoDevstatsService } from "../timescale/repo-devstats.service";
import { IssuesGithubEventsService } from "../timescale/issues_github_events.service";
import { PullRequestGithubEventsService } from "../timescale/pull_request_github_events.service";
import { ForkGithubEventsService } from "../timescale/fork_github_events.service";
import { WatchGithubEventsService } from "../timescale/watch_github_events.service";
import { ContributionsPageDto } from "../timescale/dtos/contrib-page.dto";
import { DbContributorStat } from "../timescale/entities/contributor_devstat.entity";
import { ContributionPageMetaDto } from "../timescale/dtos/contrib-page-meta.dto";
import { MostActiveContributorsDto } from "../timescale/dtos/most-active-contrib.dto";
import { PageDto } from "../common/dtos/page.dto";
import { ContributorDevstatsService } from "../timescale/contrib-stats.service";
import { DbWorkspaceRepo } from "./entities/workspace-repos.entity";
import { WorkspaceService } from "./workspace.service";
import { canUserViewWorkspace } from "./common/memberAccess";
import { DbWorkspaceStats } from "./entities/workspace-stats.entity";
import { WorkspaceStatsOptionsDto } from "./dtos/workspace-stats.dto";
import { DbWorkspaceRossIndex } from "./entities/workspace-ross.entity";
import { WorkspaceContributorsService } from "./workspace-contributors.service";

@Injectable()
export class WorkspaceStatsService {
  constructor(
    @InjectRepository(DbWorkspaceRepo, "ApiConnection")
    private workspaceRepoRepository: Repository<DbWorkspaceRepo>,
    private workspaceService: WorkspaceService,
    private worksapceContributorsService: WorkspaceContributorsService,
    private pullRequestGithubEventsService: PullRequestGithubEventsService,
    private issueGithubEventsService: IssuesGithubEventsService,
    private forkGithubEventsService: ForkGithubEventsService,
    private watchGithubEventsService: WatchGithubEventsService,
    private repoDevstatsService: RepoDevstatsService,
    private contributorDevstatService: ContributorDevstatsService
  ) {}

  baseQueryBuilder(): SelectQueryBuilder<DbWorkspaceRepo> {
    const builder = this.workspaceRepoRepository.createQueryBuilder("workspace_repos");

    return builder;
  }

  async findStatsByWorkspaceIdForUserId(
    options: WorkspaceStatsOptionsDto,
    id: string,
    userId: number | undefined
  ): Promise<DbWorkspaceStats> {
    const range = options.range!;
    const prevDaysStartDate = options.prev_days_start_date!;

    const workspace = await this.workspaceService.findOneById(id);

    /*
     * viewers, editors, and owners can see what repos belongs to a workspace
     */

    const canView = canUserViewWorkspace(workspace, userId);

    if (!canView) {
      throw new NotFoundException();
    }

    const result = new DbWorkspaceStats();

    // get the repos
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .leftJoinAndSelect(
        "workspace_repos.repo",
        "workspace_repos_repo",
        "workspace_repos.repo_id = workspace_repos_repo.id"
      )
      .where("workspace_repos.workspace_id = :id", { id });

    if (options.repos) {
      const sanitizedRepos = sanitizeRepos(options.repos);

      queryBuilder.andWhere("LOWER(workspace_repos_repo.full_name) IN (:...sanitizedRepos)", { sanitizedRepos });
    }

    const entities = await queryBuilder.getMany();

    const promises = entities.map(async (entity) => {
      // get PR stats for each repo found through filtering
      const prStats = await this.pullRequestGithubEventsService.findPrStatsByRepo(
        entity.repo.full_name,
        range,
        prevDaysStartDate
      );

      result.pull_requests.opened += prStats.open_prs;
      result.pull_requests.merged += prStats.accepted_prs;
      result.pull_requests.velocity += prStats.pr_velocity;

      // get issue stats for each repo found through filtering
      const issuesStats = await this.issueGithubEventsService.findIssueStatsByRepo(
        entity.repo.full_name,
        range,
        prevDaysStartDate
      );

      result.issues.opened += issuesStats.opened_issues;
      result.issues.closed += issuesStats.closed_issues;
      result.issues.velocity += issuesStats.issue_velocity;

      // get the repo's activity ratio
      const activityRatio = await this.repoDevstatsService.calculateRepoActivityRatio(entity.repo.full_name, range);

      // get forks within time range
      const forks = await this.forkGithubEventsService.genForkHistogram({ range, repo: entity.repo.full_name });

      // get stars (watch events) within time range
      const stars = await this.watchGithubEventsService.genStarsHistogram({ range, repo: entity.repo.full_name });

      result.repos.stars += stars.length;
      result.repos.forks += forks.length;
      result.repos.activity_ratio += activityRatio;
    });

    await Promise.all(promises);

    result.pull_requests.velocity /= entities.length;
    result.issues.velocity /= entities.length;
    result.repos.activity_ratio /= entities.length;

    // activity ratio is currently the only stat that is used to inform health
    result.repos.health = result.repos.activity_ratio;

    return result;
  }

  async findRossByWorkspaceIdForUserId(
    options: WorkspaceStatsOptionsDto,
    id: string,
    userId: number | undefined
  ): Promise<DbWorkspaceRossIndex> {
    const range = options.range!;
    const workspace = await this.workspaceService.findOneById(id);

    /*
     * viewers, editors, and owners can see what repos belongs to a workspace
     */

    const canView = canUserViewWorkspace(workspace, userId);

    if (!canView) {
      throw new NotFoundException();
    }

    const result = new DbWorkspaceRossIndex();

    // get the repos
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .leftJoinAndSelect(
        "workspace_repos.repo",
        "workspace_repos_repo",
        "workspace_repos.repo_id = workspace_repos_repo.id"
      )
      .where("workspace_repos.workspace_id = :id", { id });

    const entities = await queryBuilder.getMany();
    const entityRepos = entities.map((entity) => entity.repo.full_name);

    const rossIndex = await this.pullRequestGithubEventsService.findRossIndexByRepos(entityRepos, range);
    const rossContributors = await this.pullRequestGithubEventsService.findRossContributorsByRepos(entityRepos, range);

    result.ross = rossIndex;
    result.contributors = rossContributors;

    return result;
  }

  async findContributorStatsByWorkspaceIdForUserId(
    pageOptionsDto: MostActiveContributorsDto,
    id: string,
    userId: number | undefined
  ): Promise<PageDto<DbContributorStat>> {
    const workspace = await this.workspaceService.findOneById(id);

    /*
     * viewers, editors, and owners can see what repos belongs to a workspace
     */

    const canView = canUserViewWorkspace(workspace, userId);

    if (!canView) {
      throw new NotFoundException();
    }

    const allContributors = await this.worksapceContributorsService.findAllContributors(id);

    if (allContributors.length === 0) {
      return new ContributionsPageDto(
        new Array<DbContributorStat>(),
        new ContributionPageMetaDto({ itemCount: 0, pageOptionsDto }, 0)
      );
    }

    const contributors = allContributors
      .map((c) => (c.contributor.login ? c.contributor.login.toLowerCase() : ""))
      .filter((c) => c !== "");

    if (contributors.length === 0) {
      return new ContributionsPageDto(
        new Array<DbContributorStat>(),
        new ContributionPageMetaDto({ itemCount: 0, pageOptionsDto }, 0)
      );
    }

    return this.contributorDevstatService.findAllContributorStats(pageOptionsDto, contributors);
  }
}
