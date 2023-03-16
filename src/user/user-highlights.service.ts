import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository, SelectQueryBuilder } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { DbUserHighlight } from "./entities/user-highlight.entity";
import { CreateUserHighlightDto } from "./dtos/create-user-highlight.dto";
import { PageOptionsDto } from "../common/dtos/page-options.dto";
import { PageDto } from "../common/dtos/page.dto";
import { PageMetaDto } from "../common/dtos/page-meta.dto";
import { HighlightOptionsDto } from "../highlight/dtos/highlight-options.dto";

@Injectable()
export class UserHighlightsService {
  constructor (
    @InjectRepository(DbUserHighlight, "ApiConnection")
    private userHighlightRepository: Repository<DbUserHighlight>,
  ) {}

  baseQueryBuilder (): SelectQueryBuilder<DbUserHighlight> {
    const builder = this.userHighlightRepository.createQueryBuilder("user_highlights");

    return builder;
  }

  async findOneById (id: number, userId?: number): Promise<DbUserHighlight> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .innerJoin("users", "users", "user_highlights.user_id=users.id")
      .addSelect("users.login", "user_highlights_login")
      .where("user_highlights.id = :id", { id });

    if (userId) {
      queryBuilder
        .andWhere("user_highlights.user_id = :userId", { userId });
    }

    const item: DbUserHighlight | null = await queryBuilder.getOne();

    if (!item) {
      throw (new NotFoundException);
    }

    return item;
  }

  async findAll (pageOptionsDto: HighlightOptionsDto): Promise<PageDto<DbUserHighlight>> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .innerJoin("users", "users", "user_highlights.user_id=users.id")
      .addSelect("users.name", "user_highlights_name")
      .addSelect("users.login", "user_highlights_login")
      .orderBy("user_highlights.updated_at", "DESC");

    if (pageOptionsDto.repo) {
      queryBuilder

        // eslint-disable-next-line no-useless-escape
        .where(`REGEXP_REPLACE(REGEXP_REPLACE(user_highlights.url, '(^(http(s)?:\/\/)?([\w]+\.)?github\.com\/)', ''), '/pull/.*', '')=:repo`, { repo: decodeURIComponent(pageOptionsDto.repo) });
    }

    queryBuilder
      .offset(pageOptionsDto.skip)
      .limit(pageOptionsDto.limit);

    const itemCount = await queryBuilder.getCount();
    const entities = await queryBuilder.getMany();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async findAllHighlightRepos (pageOptionsDto: PageOptionsDto) {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .distinct(true)

      // eslint-disable-next-line no-useless-escape
      .select(`REGEXP_REPLACE(REGEXP_REPLACE(user_highlights.url, '(^(http(s)?:\/\/)?([\w]+\.)?github\.com\/)', ''), '/pull/.*', '')`, "full_name")
      .where(`user_highlights.url LIKE '%github.com%'`);

    queryBuilder
      .offset(pageOptionsDto.skip)
      .limit(pageOptionsDto.limit);

    const subQuery = this.userHighlightRepository.manager.createQueryBuilder()
      .from(`(${queryBuilder.getQuery()})`, "subquery_for_count")
      .setParameters(queryBuilder.getParameters())
      .select("count(full_name)");

    const countQueryResult = await subQuery.getRawOne<{ count: number }>();
    const itemCount = parseInt(`${countQueryResult?.count ?? "0"}`, 10);
    const entities = DbUserHighlight.create(await queryBuilder.getRawMany());

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
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
    const newUserHighlight = this.userHighlightRepository.create({
      user_id: userId,
      url: highlight.url,
      highlight: highlight.highlight,
      title: highlight.title ?? "",
    });

    return this.userHighlightRepository.save(newUserHighlight);
  }

  async updateUserHighlight (highlightId: number, highlight: Partial<DbUserHighlight>) {
    return this.userHighlightRepository.update(highlightId, highlight);
  }

  async deleteUserHighlight (highlightId: number) {
    return this.userHighlightRepository.softDelete(highlightId);
  }
}
