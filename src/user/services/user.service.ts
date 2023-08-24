import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository, SelectQueryBuilder } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "@supabase/supabase-js";

import { DbUser } from "../user.entity";
import { UpdateUserDto } from "../dtos/update-user.dto";
import { UpdateUserProfileInterestsDto } from "../dtos/update-user-interests.dto";
import { UpdateUserEmailPreferencesDto } from "../dtos/update-user-email-prefs.dto";
import { UserOnboardingDto } from "../../auth/dtos/user-onboarding.dto";
import { userNotificationTypes } from "../entities/user-notification.constants";
import { DbUserHighlightReaction } from "../entities/user-highlight-reaction.entity";
import { DbTopUser } from "../entities/top-users.entity";
import { TopUsersDto } from "../dtos/top-users.dto";
import { PageDto } from "../../common/dtos/page.dto";
import { PageMetaDto } from "../../common/dtos/page-meta.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(DbUser, "ApiConnection")
    private userRepository: Repository<DbUser>,
    @InjectRepository(DbUserHighlightReaction, "ApiConnection")
    private userHighlightReactionRepository: Repository<DbUserHighlightReaction>
  ) {}

  baseQueryBuilder(): SelectQueryBuilder<DbUser> {
    const builder = this.userRepository.createQueryBuilder("users");

    return builder;
  }

  reactionsQueryBuilder(): SelectQueryBuilder<DbUserHighlightReaction> {
    const builder = this.userHighlightReactionRepository.createQueryBuilder("user_highlight_reactions");

    return builder;
  }

  async findTopUsers(pageOptionsDto: TopUsersDto): Promise<PageDto<DbTopUser>> {
    const queryBuilder = this.reactionsQueryBuilder();

    const { userId } = pageOptionsDto;

    queryBuilder
      .select("users.login as login")
      .from(DbUser, "users")
      .innerJoin("user_highlights", "user_highlights", "user_highlights.user_id = users.id")
      .innerJoin("user_highlight_reactions", "reactions", "reactions.highlight_id = user_highlights.id")
      .where("reactions.deleted_at IS NULL");

    if (userId) {
      queryBuilder
        .andWhere(
          "users.id NOT IN (SELECT following_user_id FROM users_to_users_followers WHERE user_id = :userId AND deleted_at IS NULL)"
        )
        .setParameters({ userId });
    }

    queryBuilder.groupBy("users.login").orderBy("COUNT(reactions.user_id)", "DESC");

    queryBuilder.offset(pageOptionsDto.skip).limit(pageOptionsDto.limit);

    const [itemCount, entities] = await Promise.all([queryBuilder.getCount(), queryBuilder.getRawMany()]);
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async findOneById(id: number, includeEmail = false): Promise<DbUser> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .addSelect(
        `(
          SELECT COALESCE(COUNT("user_notifications"."id"), 0)
          FROM user_notifications
          WHERE user_id = :userId
          AND user_notifications.type IN (:...userNotificationTypes)
          AND user_notifications.read_at IS NULL
        )::INTEGER`,
        "users_notification_count"
      )
      .where("id = :id", { id });

    if (includeEmail) {
      queryBuilder.addSelect("users.email", "users_email");
    }

    let item: DbUser | null;

    try {
      queryBuilder.setParameters({ userId: id, userNotificationTypes });
      item = await queryBuilder.getOne();
    } catch (e) {
      // handle error
      item = null;
    }

    if (!item) {
      throw new NotFoundException();
    }

    return item;
  }

  async findOneByUsername(username: string): Promise<DbUser> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .addSelect(
        `(
        SELECT COALESCE(COUNT("user_highlights"."id"), 0)
        FROM user_highlights
        WHERE user_id = users.id
        AND user_highlights.deleted_at IS NULL
      )::INTEGER`,
        "users_highlights_count"
      )
      .addSelect(
        `(
        SELECT COALESCE(COUNT("user_follows"."id"), 0)
        FROM users_to_users_followers user_follows
        WHERE user_id = users.id
        AND user_follows.deleted_at IS NULL
      )::INTEGER`,
        "users_following_count"
      )
      .addSelect(
        `(
        SELECT COALESCE(COUNT("user_follows"."id"), 0)
        FROM users_to_users_followers user_follows
        WHERE following_user_id = users.id
        AND user_follows.deleted_at IS NULL
      )::INTEGER`,
        "users_followers_count"
      )
      .addSelect(
        `(
        SELECT COALESCE(COUNT("pull_requests"."id"), 0)
        FROM pull_requests
        WHERE LOWER(author_login) = :username
        AND now() - INTERVAL '30 days' <= "pull_requests"."updated_at"
      )::INTEGER`,
        "users_recent_pull_requests_count"
      )
      .addSelect(
        `(
          SELECT COALESCE(AVG(("pull_requests"."merged_at"::DATE - "pull_requests"."created_at"::DATE)), 0)
          FROM "pull_requests"
          WHERE LOWER("pull_requests"."author_login") = :username
          AND now() - INTERVAL '30 days' <= "pull_requests"."updated_at"
        )::INTEGER`,
        `users_recent_pull_request_velocity_count`
      )
      .addSelect(
        `(
          SELECT
            CASE
              WHEN COUNT(DISTINCT full_name) > 0 THEN true
              ELSE false
            END
          FROM pull_requests prs
          JOIN repos on prs.repo_id=repos.id
          WHERE prs.merged_by_login = :username
        )::BOOLEAN`,
        "users_is_maintainer"
      )
      .where("LOWER(login) = :username", { username: username.toLowerCase() })
      .setParameters({ username: username.toLowerCase() });

    const item: DbUser | null = await queryBuilder.getOne();

    if (!item) {
      throw new NotFoundException();
    }

    return item;
  }

  async checkAddUser(user: User): Promise<DbUser> {
    const {
      user_metadata: { user_name, email, name },
      identities,
      confirmed_at,
    } = user;
    const github = identities!.filter((identity) => identity.provider === "github")[0];
    const id = parseInt(github.id, 10);

    try {
      const user = await this.findOneById(id, true);

      if (!user.is_open_sauced_member) {
        await this.userRepository.update(user.id, {
          is_open_sauced_member: true,
          connected_at: new Date(),
        });
      }

      return user;
    } catch (e) {
      // create new user
      const newUser = await this.userRepository.save({
        id,
        name: name as string,
        is_open_sauced_member: true,
        login: user_name as string,
        email: email as string,
        created_at: new Date(github.created_at),
        updated_at: new Date(github.updated_at ?? github.created_at),
        connected_at: confirmed_at ? new Date(confirmed_at) : new Date(),
      });

      return newUser;
    }
  }

  async updateUser(id: number, user: UpdateUserDto) {
    try {
      await this.findOneById(id);

      await this.userRepository.update(id, {
        name: user.name,
        email: user.email,
        bio: user.bio ?? "",
        url: user.url ?? "",
        twitter_username: user.twitter_username ?? "",
        company: user.company ?? "",
        location: user.location ?? "",
        display_local_time: !!user.display_local_time,
        timezone: user.timezone,
        github_sponsors_url: user.github_sponsors_url ?? "",
        linkedin_url: user.linkedin_url ?? "",
        discord_url: user.discord_url ?? "",
      });

      return this.findOneById(id);
    } catch (e) {
      throw new NotFoundException("Unable to update user");
    }
  }

  async updateOnboarding(id: number, user: UserOnboardingDto) {
    try {
      await this.findOneById(id);

      await this.userRepository.update(id, {
        is_onboarded: true,
        is_waitlisted: false,
        timezone: user.timezone,
        interests: user.interests.join(","),
      });
    } catch (e) {
      throw new NotFoundException("Unable to update user onboarding status");
    }
  }

  async updateWaitlistStatus(id: number) {
    try {
      await this.findOneById(id);

      await this.userRepository.update(id, { is_waitlisted: true });
    } catch (e) {
      throw new NotFoundException("Unable to update user waitlist status");
    }
  }

  async updateRole(id: number, role: number) {
    try {
      await this.findOneById(id);

      await this.userRepository.update(id, { role });
    } catch (e) {
      throw new NotFoundException("Unable to update user role");
    }
  }

  async updateInterests(id: number, user: UpdateUserProfileInterestsDto) {
    return this.userRepository.update(id, { interests: user.interests.join(",") });
  }

  async updateEmailPreferences(id: number, user: UpdateUserEmailPreferencesDto) {
    return this.userRepository.update(id, {
      display_email: user.display_email,
      receive_collaboration: user.receive_collaboration,
    });
  }

  async findOneByEmail(email: string): Promise<DbUser | null> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder.where(`users.email = :email`, { email: email.toLowerCase() });

    let item: DbUser | null;

    try {
      item = await queryBuilder.getOne();
    } catch (e) {
      // handle error
      item = null;
    }

    return item;
  }
}
