import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository, SelectQueryBuilder } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { DbUserHighlight } from "./entities/user-highlight.entity";
import { CreateUserHighlightDto } from "./dtos/create-user-highlight.dto";
import { PageOptionsDto } from "../common/dtos/page-options.dto";
import { PageDto } from "../common/dtos/page.dto";
import { PageMetaDto } from "../common/dtos/page-meta.dto";

@Injectable()
export class UserHighlightsService {
  constructor (
    @InjectRepository(DbUserHighlight)
    private userHighlightRepoRepository: Repository<DbUserHighlight>,
  ) {}

  baseQueryBuilder (): SelectQueryBuilder<DbUserHighlight> {
    const builder = this.userHighlightRepoRepository.createQueryBuilder("user_highlights");

    return builder;
  }

  async findOneById (id: number, userId: number): Promise<DbUserHighlight> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .where("user_highlights.id = :id", { id })
      .andWhere("user_highlights.user_id = :userId", { userId });

    const item: DbUserHighlight | null = await queryBuilder.getOne();

    if (!item) {
      throw (new NotFoundException);
    }

    return item;
  }

  async findAllByUserId (
    pageOptionsDto: PageOptionsDto,
    userId: number,
  ): Promise<PageDto<DbUserHighlight>> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .where("user_highlights.user_id = :userId", { userId })
      .orderBy("user_highlights.updated_at", "DESC");

    queryBuilder
      .offset(pageOptionsDto.skip)
      .limit(pageOptionsDto.limit);

    const itemCount = await queryBuilder.getCount();
    const entities = await queryBuilder.getMany();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async addUserHighlight (userId: number, highlight: CreateUserHighlightDto) {
    const newUserHighlight = this.userHighlightRepoRepository.create({
      user_id: userId,
      url: highlight.url,
      highlight: highlight.highlight,
    });

    return this.userHighlightRepoRepository.save(newUserHighlight);
  }

  async updateUserHighlight (highlightId: number, highlight: Partial<DbUserHighlight>) {
    return this.userHighlightRepoRepository.update(highlightId, highlight);
  }

  async deleteUserHighlight (highlightId: number) {
    return this.userHighlightRepoRepository.softDelete(highlightId);
  }
}
