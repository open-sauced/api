import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository, SelectQueryBuilder } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { PageDto } from "../common/dtos/page.dto";
import { PageMetaDto } from "../common/dtos/page-meta.dto";

import { DbInsightMember } from "./entities/insight-member.entity";
import { PageOptionsDto } from "../common/dtos/page-options.dto";

@Injectable()
export class InsightMemberService {
  constructor (
    @InjectRepository(DbInsightMember, "ApiConnection")
    private insightMemberRepository: Repository<DbInsightMember>,
  ) {}

  baseQueryBuilder (): SelectQueryBuilder<DbInsightMember> {
    const builder = this.insightMemberRepository.createQueryBuilder("insight_members");

    return builder;
  }

  async findOneById (id: string): Promise<DbInsightMember> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder.where("insight_members.id = :id", { id });

    const item: DbInsightMember | null = await queryBuilder.getOne();

    if (!item) {
      throw (new NotFoundException);
    }

    return item;
  }

  async addInsightMember (insightMember: Partial<DbInsightMember>) {
    return this.insightMemberRepository.save(insightMember);
  }

  async updateInsightMember (id: string, insightMember: Partial<DbInsightMember>) {
    return this.insightMemberRepository.update(id, insightMember);
  }

  async removeInsightMember (id: string) {
    return this.insightMemberRepository.softDelete(id);
  }

  async findAllInsightMembers (
    pageOptionsDto: PageOptionsDto,
    insightId: number,
  ): Promise<PageDto<DbInsightMember>> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .innerJoin("insights", "insights", "insight_members.insight_id=insights.id")
      .innerJoin("users", "users", "insight_members.user_id=users.id")
      .where("insight_members.insight_id = :insightId", { insightId })
      .orderBy("users.name", "ASC");

    queryBuilder
      .offset(pageOptionsDto.skip)
      .limit(pageOptionsDto.limit);

    const itemCount = await queryBuilder.getCount();
    const entities = await queryBuilder.getMany();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }
}
