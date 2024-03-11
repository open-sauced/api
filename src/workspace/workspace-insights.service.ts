import { Injectable, NotFoundException, UnauthorizedException, UnprocessableEntityException } from "@nestjs/common";
import { Repository, SelectQueryBuilder } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { DbInsight } from "../insight/entities/insight.entity";
import { InsightsService } from "../insight/insights.service";
import { CreateInsightDto } from "../insight/dtos/create-insight.dto";
import { InsightRepoService } from "../insight/insight-repo.service";
import { PageMetaDto } from "../common/dtos/page-meta.dto";
import { PageDto } from "../common/dtos/page.dto";
import { PageOptionsDto } from "../common/dtos/page-options.dto";
import { UpdateInsightDto } from "../insight/dtos/update-insight.dto";
import { WorkspaceService } from "./workspace.service";
import { canUserEditWorkspace, canUserViewWorkspace } from "./common/memberAccess";
import { DbWorkspaceInsight } from "./entities/workspace-insights.entity";
import { MoveWorkspaceInsightDto } from "./dtos/move-workspace-insight.dto";

@Injectable()
export class WorkspaceInsightsService {
  constructor(
    @InjectRepository(DbWorkspaceInsight, "ApiConnection")
    private workspaceInsightRepository: Repository<DbWorkspaceInsight>,
    private workspaceService: WorkspaceService,
    private insightsService: InsightsService,
    private insightRepoService: InsightRepoService
  ) {}

  baseQueryBuilder(): SelectQueryBuilder<DbWorkspaceInsight> {
    const builder = this.workspaceInsightRepository.createQueryBuilder("workspace_insights");

    return builder;
  }

  private async findOneByInsightId(insightId: number): Promise<DbWorkspaceInsight> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder.where("workspace_insights.insight_id = :id", { id: insightId });

    const item: DbWorkspaceInsight | null = await queryBuilder.getOne();

    if (!item) {
      throw new NotFoundException("newly created workspace was not found");
    }

    return item;
  }

  async findAllInsightsByWorkspaceIdForUserId(
    pageOptionsDto: PageOptionsDto,
    id: string,
    userId: number | undefined
  ): Promise<PageDto<DbInsight>> {
    const workspace = await this.workspaceService.findOneById(id);

    /*
     * viewers, editors, and owners can see insights that belong to a workspace
     */

    const canView = canUserViewWorkspace(workspace, userId);

    if (!canView) {
      throw new NotFoundException();
    }

    const queryBuilder = this.workspaceInsightRepository
      .createQueryBuilder("workspace_insights")
      .leftJoinAndSelect("workspace_insights.insight", "workspace_insights_insight")
      .leftJoinAndSelect("workspace_insights_insight.repos", "workspace_insights_insight_repos")
      .where("workspace_insights.workspace_id = :id", { id })
      .orderBy("workspace_insights_insight.updated_at", "DESC")
      .offset(pageOptionsDto.skip)
      .limit(pageOptionsDto.limit);

    const itemCount = await queryBuilder.getCount();
    const entities: DbInsight[] = await queryBuilder
      .getMany()
      .then((results) => results.map((result) => result.insight));

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async findOneInsightByWorkspaceIdForUserId(
    id: string,
    insightId: number,
    userId: number | undefined
  ): Promise<DbInsight> {
    const workspace = await this.workspaceService.findOneById(id);

    /*
     * viewers, editors, and owners can see insights that belong to a workspace
     */

    const canView = canUserViewWorkspace(workspace, userId);

    if (!canView) {
      throw new NotFoundException();
    }

    const queryBuilder = this.workspaceInsightRepository
      .createQueryBuilder("workspace_insights")
      .leftJoinAndSelect("workspace_insights.insight", "workspace_insights_insight")
      .leftJoinAndSelect("workspace_insights_insight.repos", "workspace_insights_insight_repos")
      .leftJoinAndSelect("workspace_insights_insight.members", "workspace_insights_insight_members")
      .leftJoinAndSelect("workspace_insights_insight.workspaces", "workspace_insights_insight_workspaces")
      .where("workspace_insights.workspace_id = :id", { id })
      .andWhere("workspace_insights.insight_id = :insightId", { insightId });

    const item = await queryBuilder.getOne();

    if (!item) {
      throw new NotFoundException();
    }

    return item.insight;
  }

  async addWorkspaceInsight(dto: CreateInsightDto, id: string, userId: number): Promise<DbWorkspaceInsight> {
    const workspace = await this.workspaceService.findOneById(id);

    /*
     * owners and editors can add workspace insight pages
     */

    const canEdit = canUserEditWorkspace(workspace, userId);

    if (!canEdit) {
      throw new UnauthorizedException();
    }

    const newInsight = await this.insightsService.addInsight(userId, id, {
      name: dto.name,
      is_public: dto.is_public,
    });

    dto.repos.forEach(async (repo) => {
      await this.insightRepoService.addInsightRepo(newInsight.id, repo);
    });

    return this.findOneByInsightId(newInsight.id);
  }

  async moveWorkspaceInsight(
    dto: MoveWorkspaceInsightDto,
    homeWorkspaceId: string,
    newWorkspaceId: string,
    userId: number
  ): Promise<DbWorkspaceInsight> {
    /*
     * owners and editors can move workspace insight pages they are members of.
     * note: the given user must be an owner / editor of BOTH workspaces to move it.
     */

    const homeWorkspace = await this.workspaceService.findOneById(homeWorkspaceId);
    const canEditHomeWorkspace = canUserEditWorkspace(homeWorkspace, userId);

    if (!canEditHomeWorkspace) {
      throw new UnauthorizedException();
    }

    const workspaceInsight = await this.workspaceInsightRepository.findOne({
      where: {
        insight_id: dto.id,
      },
    });

    if (!workspaceInsight) {
      throw new NotFoundException(`workspace insight with insight id ${dto.id} not found`);
    }

    const newWorkspace = await this.workspaceService.findOneById(newWorkspaceId);
    const canEditNewWorkspace = canUserEditWorkspace(newWorkspace, userId);

    if (!canEditNewWorkspace) {
      throw new UnauthorizedException();
    }

    await this.workspaceInsightRepository.update(workspaceInsight.id, {
      workspace: newWorkspace,
    });

    return this.findOneByInsightId(dto.id);
  }

  async patchWorkspaceInsight(
    dto: UpdateInsightDto,
    id: string,
    insightId: number,
    userId: number
  ): Promise<DbInsight> {
    const workspace = await this.workspaceService.findOneById(id);

    /*
     * owners and editors can add workspace insight pages
     */

    const canEdit = canUserEditWorkspace(workspace, userId);

    if (!canEdit) {
      throw new UnauthorizedException();
    }

    const insight = await this.insightsService.findOneById(insightId);

    await this.insightsService.updateInsight(insightId, {
      name: dto.name,
    });

    try {
      // current set of insight repos
      const currentRepos = insight.repos?.filter((insightRepo) => !insightRepo.deleted_at) || [];

      // remove deleted repos
      const reposToRemove = currentRepos.filter(
        (repo) => !dto.repos.find((repoInfo) => `${repoInfo.id!}` === `${repo.repo_id}`)
      );

      const reposToRemoveRequests = reposToRemove.map(async (insightRepo) =>
        this.insightRepoService.removeInsightRepo(insightRepo.id)
      );

      await Promise.all(reposToRemoveRequests);

      // add new repos
      const currentRepoIds = currentRepos.map((cr) => cr.repo_id);
      const reposToAdd = dto.repos.filter((repoInfo) => !currentRepoIds.find((id) => `${id}` === `${repoInfo.id!}`));

      const repoToAddRequests = reposToAdd.map(async (repo) =>
        this.insightRepoService.addInsightRepo(insight.id, repo)
      );

      await Promise.all(repoToAddRequests);
    } catch (e) {
      throw new UnprocessableEntityException();
    }

    return this.insightsService.findOneById(insight.id);
  }

  async deleteWorkspaceInsight(id: string, insightId: number, userId: number) {
    const workspace = await this.workspaceService.findOneById(id);

    /*
     * owners and editors can delete the workspace contributors
     */

    const canDelete = canUserEditWorkspace(workspace, userId);

    if (!canDelete) {
      throw new UnauthorizedException();
    }

    await this.insightsService.removeInsight(insightId);
  }
}
