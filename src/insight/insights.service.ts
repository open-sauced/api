import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository, SelectQueryBuilder } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { PageDto } from "../common/dtos/page.dto";
import { PageMetaDto } from "../common/dtos/page-meta.dto";

import { PizzaOvenService } from "../pizza/pizza-oven.service";
import { BakeRepoDto } from "../pizza/dtos/baked-repo.dto";
import { DbInsight } from "./entities/insight.entity";
import { InsightPageOptionsDto } from "./dtos/insight-page-options.dto";
import { DbInsightMember } from "./entities/insight-member.entity";

@Injectable()
export class InsightsService {
  constructor(
    @InjectRepository(DbInsight, "ApiConnection")
    private insightRepository: Repository<DbInsight>,
    @InjectRepository(DbInsightMember, "ApiConnection")
    private insightMemberRepository: Repository<DbInsightMember>,
    private pizzaOvenService: PizzaOvenService
  ) {}

  baseQueryBuilder(): SelectQueryBuilder<DbInsight> {
    const builder = this.insightRepository.createQueryBuilder("insights");

    return builder;
  }

  processPizza(item: DbInsight) {
    item.repos.forEach(async (url) => {
      const bakeRepoInfo: BakeRepoDto = {
        url: `https://github.com/${url.full_name}`,
        wait: false,
      };

      try {
        await this.pizzaOvenService.postToPizzaOvenService(bakeRepoInfo);
      } catch (e: unknown) {
        if (e instanceof Error) {
          console.error(`error posting to pizza-oven service for repo ${bakeRepoInfo.url}: ${e.message}`);
        }
      }
    });
  }

  async findOneById(id: number): Promise<DbInsight> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .leftJoin("insight_members", "insight_members")
      .where("insights.id = :id", { id })
      .leftJoinAndSelect(`insights.repos`, `insight_repos`, `insights.id=insight_repos.insight_id`)
      .leftJoinAndSelect(`insights.members`, `members`, `insights.id=members.insight_id`);

    const item: DbInsight | null = await queryBuilder.getOne();

    if (!item) {
      throw new NotFoundException();
    }

    this.processPizza(item);

    return item;
  }

  async findOneByIdAndUserId(id: number, userId: number): Promise<DbInsight> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .leftJoin("insight_members", "insight_members", "insight_members.user_id = :userId", { userId })
      .where("insights.id = :id", { id })
      .leftJoinAndSelect(`insights.repos`, `insight_repos`, `insights.id=insight_repos.insight_id`)
      .leftJoinAndSelect(`insights.members`, `members`, `insights.id=members.insight_id`);

    const item: DbInsight | null = await queryBuilder.getOne();

    if (!item) {
      throw new NotFoundException();
    }

    this.processPizza(item);

    return item;
  }

  async addInsight(userId: number, insight: Partial<DbInsight>) {
    const newInsight = await this.insightRepository.save(insight);

    /* creators of insight pages are automatically an admin for them */
    await this.insightMemberRepository.save({
      user_id: userId,
      insight_id: insight.id,
      access: "admin",
    });

    return newInsight;
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
      .leftJoinAndSelect("insights.members", "insight_members", "insight_members.insight_id = insights.id")
      .where(
        `(
          ((SELECT COUNT(id) FROM insight_members where insight_members.user_id=:userId)=0)
          AND
          (insights.is_featured=true AND insights.deleted_at IS NULL)
        )
      `,
        { userId }
      )
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

  async findAllFeatured(pageOptionsDto: InsightPageOptionsDto): Promise<PageDto<DbInsight>> {
    const queryBuilder = this.insightRepository.createQueryBuilder("insights");

    queryBuilder
      .where("is_featured=true")
      .andWhere("is_public=true")
      .leftJoinAndSelect(`insights.repos`, `insight_repos`, `insights.id=insight_repos.insight_id`)
      .leftJoinAndSelect(`insights.members`, `members`, `insights.id=members.insight_id`)
      .orderBy("insights.updated_at", "DESC");

    queryBuilder.skip(pageOptionsDto.skip).take(pageOptionsDto.limit);

    const itemCount = await queryBuilder.getCount();
    const entities = await queryBuilder.getMany();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }
}
