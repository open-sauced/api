import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository, SelectQueryBuilder } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { PageDto } from "../common/dtos/page.dto";

import { PageOptionsDto } from "../common/dtos/page-options.dto";
import { PagerService } from "../common/services/pager.service";
import { DbInsightMember } from "./entities/insight-member.entity";
import { InsightsService } from "./insights.service";

@Injectable()
export class InsightMemberService {
  constructor(
    @InjectRepository(DbInsightMember, "ApiConnection")
    private insightMemberRepository: Repository<DbInsightMember>,
    private insightService: InsightsService,
    private pagerService: PagerService
  ) {}

  baseQueryBuilder(): SelectQueryBuilder<DbInsightMember> {
    const builder = this.insightMemberRepository.createQueryBuilder("insight_members");

    return builder;
  }

  async findOneById(id: string): Promise<DbInsightMember> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder.where("insight_members.id = :id", { id });

    const item: DbInsightMember | null = await queryBuilder.getOne();

    if (!item) {
      throw new NotFoundException();
    }

    return item;
  }

  async addInsightMember(insightMember: Partial<DbInsightMember>) {
    return this.insightMemberRepository.save(insightMember);
  }

  async updateInsightMember(id: string, insightMember: Partial<DbInsightMember>) {
    return this.insightMemberRepository.update(id, insightMember);
  }

  async removeInsightMember(id: string) {
    return this.insightMemberRepository.softDelete(id);
  }

  async canUserManageInsight(
    userId: number,
    insightId: number,
    accessRoles: string[],
    checkOwner = true
  ): Promise<boolean> {
    const insight = await this.insightService.findOneById(insightId);

    if (checkOwner && Number(insight.user.id) === userId) {
      return true;
    }

    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .where("insight_members.insight_id = :insightId", { insightId })
      .andWhere("insight_members.user_id = :userId", { userId })
      .andWhere("insight_members.access IN (:...accessRoles)", { accessRoles });

    const item: DbInsightMember | null = await queryBuilder.getOne();

    if (!item) {
      return false;
    }

    return true;
  }

  async findAllInsightMembers(pageOptionsDto: PageOptionsDto, insightId: number): Promise<PageDto<DbInsightMember>> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .addSelect("users.name", "insight_members_name")
      .addSelect("insight_members.invitation_email", "insight_members_invitation_email")
      .innerJoin("insights", "insights", "insight_members.insight_id=insights.id")
      .leftJoin("users", "users", "insight_members.user_id=users.id")
      .where("insight_members.insight_id = :insightId", { insightId })
      .orderBy("users.name", "ASC");

    return this.pagerService.applyPagination<DbInsightMember>({
      pageOptionsDto,
      queryBuilder,
    });
  }
}
