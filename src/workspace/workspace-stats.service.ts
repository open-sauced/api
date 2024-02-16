import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository, SelectQueryBuilder } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { RepoDevstatsService } from "../timescale/repo-devstats.service";
import { IssuesGithubEventsService } from "../timescale/issues_github_events.service";
import { PullRequestGithubEventsService } from "../timescale/pull_request_github_events.service";
import { DbWorkspaceRepo } from "./entities/workspace-repos.entity";
import { WorkspaceService } from "./workspace.service";
import { canUserViewWorkspace } from "./common/memberAccess";
import { DbWorkspaceStats } from "./entities/workspace-stats.entity";
import { WorkspaceStatsOptionsDto } from "./dtos/workspace-stats.dto";

@Injectable()
export class WorkspaceStatsService {
  constructor(
    @InjectRepository(DbWorkspaceRepo, "ApiConnection")
    private workspaceRepoRepository: Repository<DbWorkspaceRepo>,
    private workspaceService: WorkspaceService,
    private pullRequestGithubEventsService: PullRequestGithubEventsService,
    private issueGithubEventsService: IssuesGithubEventsService,
    private repoDevstatsService: RepoDevstatsService
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

      result.repos.forks += entity.repo.forks;
      result.repos.stars += entity.repo.stars;
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
}
