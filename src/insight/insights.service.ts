import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository, SelectQueryBuilder } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { PageDto } from "../common/dtos/page.dto";
import { PageMetaDto } from "../common/dtos/page-meta.dto";

import { DbInsight } from "./entities/insight.entity";
import { InsightPageOptionsDto } from "./dtos/insight-page-options.dto";

@Injectable()
export class InsightsService {
  constructor(
    @InjectRepository(DbInsight, "ApiConnection")
    private insightRepository: Repository<DbInsight>
  ) {}

  baseQueryBuilder(): SelectQueryBuilder<DbInsight> {
    const builder = this.insightRepository.createQueryBuilder("insights");

    return builder;
  }

  async findOneById(id: number): Promise<DbInsight> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .where("insights.id = :id", { id })
      .innerJoinAndSelect(`insights.user`, `user`)
      .leftJoinAndSelect(`insights.repos`, `insight_repos`, `insights.id=insight_repos.insight_id`);

    const item: DbInsight | null = await queryBuilder.getOne();

    if (!item) {
      throw new NotFoundException();
    }

    return item;
  }

  async addInsight(insight: Partial<DbInsight>) {
    return this.insightRepository.save(insight);
  }

  async updateInsight(id: number, insight: Partial<DbInsight>) {
    return this.insightRepository.update(id, insight);
  }

  async removeInsight(id: number) {
    return this.insightRepository.softDelete(id);
  }

  async findAllByUserId(pageOptionsDto: InsightPageOptionsDto, userId: string): Promise<PageDto<DbInsight>> {
    const queryBuilder = this.insightRepository.createQueryBuilder("insights");

    queryBuilder
      .where("insights.user_id = :userId", { userId })
      .orWhere(
        `:userId IN (
          SELECT user_id
          FROM insight_members
          WHERE insight_id = insights.id
          AND user_id = :userId
          AND access != 'pending'
          AND deleted_at IS NULL
        )
      `,
        { userId }
      )
      .leftJoinAndSelect(`insights.repos`, `insight_repos`, `insights.id=insight_repos.insight_id`)
      .orderBy("insights.updated_at", "DESC");

    queryBuilder.skip(pageOptionsDto.skip).take(pageOptionsDto.limit);

    const itemCount = await queryBuilder.getCount();
    const entities = await queryBuilder.getMany();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }
}
