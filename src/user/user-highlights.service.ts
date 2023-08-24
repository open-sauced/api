import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Repository, SelectQueryBuilder } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { PageOptionsDto } from "../common/dtos/page-options.dto";
import { PageDto } from "../common/dtos/page.dto";
import { PageMetaDto } from "../common/dtos/page-meta.dto";
import { DbUserHighlightReactionResponse, HighlightOptionsDto } from "../highlight/dtos/highlight-options.dto";
import { PagerService } from "../common/services/pager.service";
import { DbUserHighlight } from "./entities/user-highlight.entity";
import { CreateUserHighlightDto } from "./dtos/create-user-highlight.dto";
import { DbUserHighlightReaction } from "./entities/user-highlight-reaction.entity";
import { UserNotificationService } from "./user-notifcation.service";
import { UserService } from "./services/user.service";
import { UserFollowService } from "./user-follow.service";

@Injectable()
export class UserHighlightsService {
  constructor(
    @InjectRepository(DbUserHighlight, "ApiConnection")
    private userHighlightRepository: Repository<DbUserHighlight>,
    @InjectRepository(DbUserHighlightReaction, "ApiConnection")
    private userHighlightReactionRepository: Repository<DbUserHighlightReaction>,
    private userNotificationService: UserNotificationService,
    private userService: UserService,
    private userFollowService: UserFollowService,
    private pagerService: PagerService
  ) {}

  baseQueryBuilder(): SelectQueryBuilder<DbUserHighlight> {
    const builder = this.userHighlightRepository.createQueryBuilder("user_highlights");

    return builder;
  }

  async findOneById(id: number, userId?: number): Promise<DbUserHighlight> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .innerJoin("users", "users", "user_highlights.user_id=users.id")
      .addSelect("users.login", "user_highlights_login")
      .where("user_highlights.id = :id", { id });

    if (userId) {
      queryBuilder.andWhere("user_highlights.user_id = :userId", { userId });
    }

    const item: DbUserHighlight | null = await queryBuilder.getOne();

    if (!item) {
      throw new NotFoundException();
    }

    return item;
  }

  async findAll(pageOptionsDto: HighlightOptionsDto, followerUserId?: number): Promise<PageDto<DbUserHighlight>> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .innerJoin("users", "users", "user_highlights.user_id=users.id")
      .addSelect("users.name", "user_highlights_name")
      .addSelect("users.login", "user_highlights_login")
      .orderBy("user_highlights.updated_at", "DESC");

    const filters: [string, object][] = [];

    if (followerUserId) {
      filters.push([
        `user_highlights.user_id IN (
        SELECT following_user_id FROM users_to_users_followers
        WHERE user_id=:userId
        AND deleted_at IS NULL
      )`,
        { userId: followerUserId },
      ]);
    }

    if (pageOptionsDto.repo) {
      filters.push([
        // eslint-disable-next-line no-useless-escape
        `REGEXP_REPLACE(REGEXP_REPLACE(user_highlights.url, '(^(http(s)?:\/\/)?([\w]+\.)?github\.com\/)', ''), '/pull/.*', '')=:repo`,
        { repo: decodeURIComponent(pageOptionsDto.repo) },
      ]);
    }

    filters.forEach(([sql, data], index) => {
      if (index === 0) {
        queryBuilder.where(sql, data);
      } else {
        queryBuilder.andWhere(sql, data);
      }
    });

    return this.pagerService.applyPagination<DbUserHighlight>({
      pageOptionsDto,
      queryBuilder,
    });
  }

  async findAllFeatured(pageOptionsDto: PageOptionsDto): Promise<PageDto<DbUserHighlight>> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder.where(`user_highlights.featured = true`).orderBy("user_highlights.updated_at", "DESC");

    return this.pagerService.applyPagination<DbUserHighlight>({
      pageOptionsDto,
      queryBuilder,
    });
  }

  async findTop(pageOptionsDto: PageOptionsDto): Promise<PageDto<DbUserHighlight>> {
    const queryBuilder = this.baseQueryBuilder();
    const range = pageOptionsDto.range!;

    queryBuilder
      .addSelect(
        `
        (SELECT COUNT(id) FROM user_highlight_reactions
        WHERE highlight_id=user_highlights.id
        AND deleted_at IS NULL)
      `,
        "reactions"
      )
      .where(`now() - INTERVAL '${range} days' <= user_highlights.created_at`)
      .limit(10)
      .orderBy("reactions", "DESC");

    return this.pagerService.applyPagination<DbUserHighlight>({
      pageOptionsDto,
      queryBuilder,
    });
  }

  async addFeatured(highlightId: number, userId: number): Promise<DbUserHighlight> {
    const user = await this.userService.findOneById(userId);

    if (user.role < 100) {
      throw new UnauthorizedException("You are not authorized to perform this action");
    }
    const highlight = await this.findOneById(highlightId, userId);

    if (highlight.deleted_at) {
      throw new NotFoundException();
    }

    const updatedHighlight = await this.userHighlightRepository.save({
      featured: true,
    });

    return updatedHighlight;
  }

  async removeFeatured(highlightId: number, userId: number): Promise<DbUserHighlight | null> {
    const user = await this.userService.findOneById(userId);

    if (user.role < 100) {
      throw new UnauthorizedException("You are not authorized to perform this action");
    }

    const highlight = await this.findOneById(highlightId, userId);

    if (highlight.deleted_at) {
      throw new NotFoundException();
    }

    const updatedHighlight = await this.userHighlightRepository.save({
      featured: false,
    });

    return updatedHighlight;
  }

  async findAllHighlightRepos(pageOptionsDto: PageOptionsDto, follwerUserId?: number) {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .distinct(true)
      .select(
        // eslint-disable-next-line no-useless-escape
        `REGEXP_REPLACE(REGEXP_REPLACE(user_highlights.url, '(^(http(s)?:\/\/)?([\w]+\.)?github\.com\/)', ''), '/pull/.*', '')`,
        "full_name"
      )
      .where(`user_highlights.url LIKE '%github.com%'`);

    if (follwerUserId) {
      queryBuilder.andWhere(
        `user_highlights.user_id IN (
        SELECT following_user_id FROM users_to_users_followers
        WHERE user_id=:userId
        AND deleted_at IS NULL
      )`,
        { userId: follwerUserId }
      );
    }

    queryBuilder.offset(pageOptionsDto.skip).limit(pageOptionsDto.limit);

    const subQuery = this.userHighlightRepository.manager
      .createQueryBuilder()
      .from(`(${queryBuilder.getQuery()})`, "subquery_for_count")
      .setParameters(queryBuilder.getParameters())
      .select("count(full_name)");

    const countQueryResult = await subQuery.getRawOne<{ count: number }>();
    const itemCount = parseInt(`${countQueryResult?.count ?? "0"}`, 10);
    const entities = DbUserHighlight.create(await queryBuilder.getRawMany());

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async findAllByUserId(pageOptionsDto: PageOptionsDto, userId: number): Promise<PageDto<DbUserHighlight>> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder.where("user_highlights.user_id = :userId", { userId }).orderBy("user_highlights.updated_at", "DESC");

    return this.pagerService.applyPagination<DbUserHighlight>({
      pageOptionsDto,
      queryBuilder,
    });
  }

  async addUserHighlight(userId: number, highlight: CreateUserHighlightDto) {
    const newUserHighlight = this.userHighlightRepository.create({
      user_id: userId,
      url: highlight.url,
      highlight: highlight.highlight,
      title: highlight.title ?? "",
      shipped_at: highlight.shipped_at ? new Date(highlight.shipped_at) : new Date(),
      type: highlight.type,
      tagged_repos: highlight.taggedRepos,
    });

    const newHighlight = await this.userHighlightRepository.save(newUserHighlight);

    const followers = await this.userFollowService.findAllFollowers(userId);

    const notifications = followers.map(async (follower) =>
      this.userNotificationService.addUserHighlightNotification(newHighlight.id, userId, follower.user_id)
    );

    await Promise.all(notifications);

    return newHighlight;
  }

  async updateUserHighlight(highlightId: number, highlight: Partial<DbUserHighlight>) {
    return this.userHighlightRepository.update(highlightId, highlight);
  }

  async deleteUserHighlight(highlightId: number) {
    return this.userHighlightRepository.softDelete(highlightId);
  }

  async findAllHighlightReactions(highlightId: number, userId?: number) {
    const queryBuilder = this.userHighlightReactionRepository.createQueryBuilder("user_highlight_reactions");

    queryBuilder
      .select("emoji_id", "emoji_id")
      .addSelect("COUNT(emoji_id)", "reaction_count")
      .addSelect("ARRAY_AGG(users.login)", "reaction_users")
      .innerJoin("users", "users", "user_highlight_reactions.user_id=users.id")
      .where("user_highlight_reactions.highlight_id = :highlightId", { highlightId })
      .addGroupBy("emoji_id");

    if (userId) {
      queryBuilder.andWhere("user_highlight_reactions.user_id = :userId", { userId });
    }

    queryBuilder.addGroupBy("emoji_id");

    const entities: DbUserHighlightReactionResponse[] = await queryBuilder.getRawMany();

    return entities;
  }

  async findOneUserHighlightReaction(highlightId: number, userId: number, emojiId: string) {
    const queryBuilder = this.userHighlightReactionRepository.createQueryBuilder("user_highlight_reactions");

    queryBuilder
      .where("user_highlight_reactions.highlight_id = :highlightId", { highlightId })
      .andWhere("user_highlight_reactions.user_id = :userId", { userId })
      .andWhere("user_highlight_reactions.emoji_id = :emojiId", { emojiId });

    const item: DbUserHighlightReaction | null = await queryBuilder.getOne();

    if (!item) {
      throw new NotFoundException();
    }

    return item;
  }

  async addUserHighlightReaction(userId: number, highlightId: number, emojiId: string, highlightUserId: number) {
    const queryBuilder = this.userHighlightReactionRepository
      .createQueryBuilder("user_highlight_reactions")
      .withDeleted();

    queryBuilder
      .where("user_highlight_reactions.highlight_id = :highlightId", { highlightId })
      .andWhere("user_highlight_reactions.user_id = :userId", { userId })
      .andWhere("user_highlight_reactions.emoji_id = :emojiId", { emojiId });

    const reactionExists = await queryBuilder.getOne();

    if (reactionExists) {
      if (!reactionExists.deleted_at) {
        throw new ConflictException("You have already added this reaction for this highlight");
      }

      await this.userHighlightReactionRepository.restore(reactionExists.id);
      await this.userNotificationService.addUserHighlightReactionNotification(userId, highlightUserId, highlightId);

      return reactionExists;
    }

    await this.userNotificationService.addUserHighlightReactionNotification(userId, highlightUserId, highlightId);

    return this.userHighlightReactionRepository.save({
      user_id: userId,
      highlight_id: highlightId,
      emoji_id: emojiId,
    });
  }

  async deleteUserHighlightReaction(id: string) {
    return this.userHighlightReactionRepository.softDelete(id);
  }
}
