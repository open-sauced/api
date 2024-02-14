import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Repository, SelectQueryBuilder } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { DbInsight } from "../insight/entities/insight.entity";
import { InsightsService } from "../insight/insights.service";
import { CreateInsightDto } from "../insight/dtos/create-insight.dto";
import { InsightRepoService } from "../insight/insight-repo.service";
import { PageMetaDto } from "../common/dtos/page-meta.dto";
import { PageDto } from "../common/dtos/page.dto";
import { PageOptionsDto } from "../common/dtos/page-options.dto";
import { WorkspaceService } from "./workspace.service";
import { canUserManageWorkspace } from "./common/memberAccess";
import { WorkspaceMemberRoleEnum } from "./entities/workspace-member.entity";
import { DbWorkspaceInsight } from "./entities/workspace-insights.entity";

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

  async findAllInsightsByWorkspaceIdForUserId(
    pageOptionsDto: PageOptionsDto,
    id: string,
    userId: number
  ): Promise<PageDto<DbInsight>> {
    const workspace = await this.workspaceService.findOneById(id);

    /*
     * viewers, editors, and owners can see insights that belong to a workspace
     */

    const canView = canUserManageWorkspace(workspace, userId, [
      WorkspaceMemberRoleEnum.Viewer,
      WorkspaceMemberRoleEnum.Editor,
      WorkspaceMemberRoleEnum.Owner,
    ]);

    if (!canView) {
      throw new UnauthorizedException();
    }

    const queryBuilder = this.workspaceInsightRepository
      .createQueryBuilder("workspace_insights")
      .leftJoinAndSelect("workspace_insights.insight", "workspace_insights_insight")
      .leftJoinAndSelect("workspace_insights_insight.repos", "workspace_insights_insight_repos")
      .where("workspace_insights.workspace_id = :id", { id });

    const itemCount = await queryBuilder.getCount();
    const entities: DbInsight[] = await queryBuilder
      .getMany()
      .then((results) => results.map((result) => result.insight));

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async addWorkspaceInsight(dto: CreateInsightDto, id: string, userId: number): Promise<DbWorkspaceInsight> {
    const workspace = await this.workspaceService.findOneById(id);

    /*
     * owners and editors can add workspace insight pages
     */

    const canEdit = canUserManageWorkspace(workspace, userId, [
      WorkspaceMemberRoleEnum.Owner,
      WorkspaceMemberRoleEnum.Editor,
    ]);

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

    const queryBuilder = this.baseQueryBuilder();

    queryBuilder.where("workspace_insights.insight_id = :id", { id: newInsight.id });

    const item: DbWorkspaceInsight | null = await queryBuilder.getOne();

    if (!item) {
      throw new NotFoundException("newly created workspace was not found");
    }

    return item;
  }

  async deleteWorkspaceInsight(id: string, insightId: number, userId: number) {
    const workspace = await this.workspaceService.findOneById(id);

    /*
     * owners and editors can delete the workspace contributors
     */

    const canDelete = canUserManageWorkspace(workspace, userId, [
      WorkspaceMemberRoleEnum.Owner,
      WorkspaceMemberRoleEnum.Editor,
    ]);

    if (!canDelete) {
      throw new UnauthorizedException();
    }

    await this.insightsService.removeInsight(insightId);
  }
}
