import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository, SelectQueryBuilder } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { PageDto } from "../common/dtos/page.dto";
import { PageMetaDto } from "../common/dtos/page-meta.dto";

import { DbInsight } from "./entities/insight.entity";
import { InsightPageOptionsDto } from "./dtos/insight-page-options.dto";

@Injectable()
export class InsightsService {
  constructor (
    @InjectRepository(DbInsight)
    private insightRepository: Repository<DbInsight>,
  ) {}

  baseQueryBuilder (): SelectQueryBuilder<DbInsight> {
    const builder = this.insightRepository.createQueryBuilder("insights");

    return builder;
  }

  async findOneById (id: number): Promise<DbInsight> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder.where("id = :id", { id });

    const item: DbInsight | null = await queryBuilder.getOne();

    if (!item || !item.is_public) {
      throw (new NotFoundException);
    }

    return item;
  }

  async addInsight (insight: Omit<DbInsight, "id" | "created_at" | "updated_at">) {
    const newInsight = this.insightRepository.create({ ...insight });

    await newInsight.save();

    return newInsight;
  }

  async findAllByUserId (
    pageOptionsDto: InsightPageOptionsDto,
    userId: string,
  ): Promise<PageDto<DbInsight>> {
    const queryBuilder = this.insightRepository.createQueryBuilder("insights");

    queryBuilder
      .where("insights.user_id = :userId", { userId })
      .leftJoinAndSelect(`insights.repos`, `insight_repos`, `insights.id=insight_repos.insight_id`);

    queryBuilder
      .offset(pageOptionsDto.skip)
      .limit(pageOptionsDto.limit);

    const itemCount = await queryBuilder.getCount();
    const entities = await queryBuilder.getMany();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }
}
