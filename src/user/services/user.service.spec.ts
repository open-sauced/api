/* eslint-disable @typescript-eslint/no-explicit-any */
import { NotFoundException } from "@nestjs/common";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Test } from "@nestjs/testing";
import { faker } from "@faker-js/faker";
import { ObjectLiteral, Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";

import { User } from "@supabase/supabase-js";
import { DbForkGitHubEventsHistogram } from "../../timescale/entities/fork_github_events_histogram.entity";
import { userNotificationTypes } from "../entities/user-notification.constants";
import { DbUser } from "../user.entity";
import { DbUserHighlightReaction } from "../entities/user-highlight-reaction.entity";
import { DbUserHighlight } from "../entities/user-highlight.entity";
import { DbInsight } from "../../insight/entities/insight.entity";
import { DbUserCollaboration } from "../entities/user-collaboration.entity";
import { DbUserList } from "../../user-lists/entities/user-list.entity";
import { PullRequestGithubEventsService } from "../../timescale/pull_request_github_events.service";
import { DbPullRequestGitHubEvents } from "../../timescale/entities/pull_request_github_event.entity";
import { RepoService } from "../../repo/repo.service";
import { UserListService } from "../../user-lists/user-list.service";
import { DbRepo } from "../../repo/entities/repo.entity";
import { RepoFilterService } from "../../common/filters/repo-filter.service";
import { DbUserListContributor } from "../../user-lists/entities/user-list-contributor.entity";
import { PagerService } from "../../common/services/pager.service";
import { RepoDevstatsService } from "../../timescale/repo-devstats.service";
import { DbIssuesGitHubEvents } from "../../timescale/entities/issues_github_event.entity";
import { DbPushGitHubEvents } from "../../timescale/entities/push_github_events.entity";
import { DbWorkspace } from "../../workspace/entities/workspace.entity";
import { DbWorkspaceMember } from "../../workspace/entities/workspace-member.entity";
import { DbWorkspaceUserLists } from "../../workspace/entities/workspace-user-list.entity";
import { WorkspaceService } from "../../workspace/workspace.service";
import { DbWorkspaceRepo } from "../../workspace/entities/workspace-repos.entity";
import { DbWorkspaceContributor } from "../../workspace/entities/workspace-contributors.entity";
import { DbWatchGitHubEvents } from "../../timescale/entities/watch_github_events.entity";
import { DbForkGitHubEvents } from "../../timescale/entities/fork_github_events.entity";
import { ForkGithubEventsService } from "../../timescale/fork_github_events.service";
import { UserService } from "./user.service";

type MockRepository<T extends ObjectLiteral = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T extends ObjectLiteral = any>(): MockRepository<T> => ({
  createQueryBuilder: jest.fn(),
  update: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  softDelete: jest.fn(),
  findOneOrFail: jest.fn(),
});

describe("UserService", () => {
  let userService: UserService;
  let prEventService: PullRequestGithubEventsService;
  let dbUserRepositoryMock: MockRepository;
  let dbWorkspaceRepositoryMock: MockRepository;
  let dbUserHighlightReactionRepositoryMock: MockRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        ConfigService,
        ForkGithubEventsService,
        PullRequestGithubEventsService,
        RepoDevstatsService,
        RepoService,
        UserListService,
        RepoFilterService,
        PagerService,
        WorkspaceService,
        {
          provide: getRepositoryToken(DbUser, "ApiConnection"),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(DbRepo, "ApiConnection"),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(DbUserHighlightReaction, "ApiConnection"),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(DbUserHighlight, "ApiConnection"),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(DbInsight, "ApiConnection"),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(DbUserCollaboration, "ApiConnection"),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(DbUserList, "ApiConnection"),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(DbPullRequestGitHubEvents, "TimescaleConnection"),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(DbIssuesGitHubEvents, "TimescaleConnection"),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(DbPushGitHubEvents, "TimescaleConnection"),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(DbWatchGitHubEvents, "TimescaleConnection"),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(DbForkGitHubEvents, "TimescaleConnection"),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(DbForkGitHubEventsHistogram, "TimescaleConnection"),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(DbUserListContributor, "ApiConnection"),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(DbUserHighlight, "ApiConnection"),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(DbWorkspace, "ApiConnection"),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(DbWorkspaceMember, "ApiConnection"),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(DbWorkspaceUserLists, "ApiConnection"),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(DbWorkspaceRepo, "ApiConnection"),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(DbWorkspaceContributor, "ApiConnection"),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);

    // mocks out asynchronous timescale calls used within the user service
    prEventService = module.get<PullRequestGithubEventsService>(PullRequestGithubEventsService);
    prEventService.findCountByPrAuthor = jest.fn(async () => {
      await Promise.resolve();
      return 1;
    });
    prEventService.findVelocityByPrAuthor = jest.fn(async () => {
      await Promise.resolve();
      return 1;
    });
    prEventService.isMaintainer = jest.fn(async () => {
      await Promise.resolve();
      return true;
    });

    dbUserRepositoryMock = module.get<MockRepository>(getRepositoryToken(DbUser, "ApiConnection"));
    dbWorkspaceRepositoryMock = module.get<MockRepository>(getRepositoryToken(DbWorkspace, "ApiConnection"));
    dbUserHighlightReactionRepositoryMock = module.get<MockRepository>(
      getRepositoryToken(DbUserHighlightReaction, "ApiConnection")
    );
  });

  it("should be defined", () => {
    expect(userService).toBeDefined();
  });

  describe("[findTopUsers]", () => {
    it("should return a list of top users", async () => {
      const expectedUsers = [{ id: faker.number.int() }, { id: faker.number.int() }];
      const defaultLimit = 10;
      const skip = 0;

      const createQueryBuilderMock = {
        select: jest.fn().mockReturnThis(),
        from: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue(expectedUsers),
      };

      dbUserHighlightReactionRepositoryMock.createQueryBuilder?.mockReturnValue(createQueryBuilderMock);
      const result = await userService.findTopUsers({ limit: defaultLimit, skip });

      expect(dbUserHighlightReactionRepositoryMock.createQueryBuilder).toHaveBeenCalled();
      expect(createQueryBuilderMock.select).toHaveBeenCalled();
      expect(createQueryBuilderMock.innerJoin).toHaveBeenCalled();
      expect(createQueryBuilderMock.where).toHaveBeenCalled();
      expect(createQueryBuilderMock.groupBy).toHaveBeenCalled();
      expect(createQueryBuilderMock.orderBy).toHaveBeenCalled();
      expect(createQueryBuilderMock.offset).toHaveBeenCalledWith(skip);
      expect(createQueryBuilderMock.limit).toHaveBeenCalledWith(defaultLimit);
      expect(createQueryBuilderMock.getCount).toHaveBeenCalled();
      expect(createQueryBuilderMock.getRawMany).toHaveBeenCalled();
      expect(result).toMatchObject({ data: expectedUsers });
    });
  });

  describe("[findOneById]", () => {
    const user = { id: faker.number.int(), email: faker.internet.email() };
    const createQueryBuilderMock = {
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      setParameters: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(user),
    };

    /**
     * @author @takanome-dev
     * @todo test with a real db when doing e2e if `findOneById`
     * with includeEmail=false is returning the email or not.
     * Cannot be tested with unit test (IMO) since the result is mocked.
     */

    it("should return a user with the given id", async () => {
      dbUserRepositoryMock.createQueryBuilder?.mockReturnValue(createQueryBuilderMock);
      const result = await userService.findOneById(user.id);

      expect(dbUserRepositoryMock.createQueryBuilder).toHaveBeenCalled();
      expect(createQueryBuilderMock.addSelect).toHaveBeenCalled();
      expect(createQueryBuilderMock.where).toHaveBeenCalledWith("id = :id", { id: user.id });
      expect(createQueryBuilderMock.setParameters).toHaveBeenCalledWith({
        userId: user.id,
        userNotificationTypes,
      });
      expect(createQueryBuilderMock.getOne).toHaveBeenCalled();
      expect(result).toEqual(user);
    });

    it("should throw an error if the user is not found", async () => {
      createQueryBuilderMock.getOne = jest.fn().mockResolvedValue(null);
      dbUserRepositoryMock.createQueryBuilder?.mockReturnValue(createQueryBuilderMock);
      await expect(userService.findOneById(faker.number.int())).rejects.toThrow(NotFoundException);
    });
  });

  describe("[findOneByUsername]", () => {
    const username = faker.internet.userName();
    const user = { id: faker.number.int(), username };
    const createQueryBuilderMock = {
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      setParameters: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(user),
    };

    it("should return a user with the given username", async () => {
      dbUserRepositoryMock.createQueryBuilder?.mockReturnValue(createQueryBuilderMock);
      const result = await userService.findOneByUsername(username);

      expect(dbUserRepositoryMock.createQueryBuilder).toHaveBeenCalled();
      expect(createQueryBuilderMock.addSelect).toHaveBeenCalledTimes(3);
      expect(createQueryBuilderMock.where).toHaveBeenCalledWith("LOWER(login) = :username", {
        username: username.toLowerCase(),
      });
      expect(createQueryBuilderMock.setParameters).toHaveBeenCalledWith({ username: username.toLowerCase() });
      expect(createQueryBuilderMock.getOne).toHaveBeenCalled();
      expect(result).toEqual(user);
    });

    it("should throw an error if the user is not found", async () => {
      createQueryBuilderMock.getOne = jest.fn().mockResolvedValue(null);
      dbUserRepositoryMock.createQueryBuilder?.mockReturnValue(createQueryBuilderMock);
      await expect(userService.findOneByUsername(username)).rejects.toThrow(NotFoundException);
    });
  });

  describe("[checkAddUser]", () => {
    const userId = faker.number.int();
    const newWorkspace = {
      id: "abc-123",
      name: "Your workspace",
      description: "Your personal workspace",
    };
    const supabaseUser = {
      id: faker.string.uuid(),
      app_metadata: {
        provider: "github",
      },
      user_metadata: {
        user_name: faker.internet.userName(),
        email: faker.internet.email(),
        name: faker.person.firstName(),
      },
      aud: faker.string.uuid(),
      created_at: new Date(faker.date.past()).toISOString(),
      identities: [
        {
          created_at: new Date(faker.date.past()).toISOString(),
          id: userId.toString(),
          identity_data: {},
          last_sign_in_at: new Date(faker.date.past()).toISOString(),
          provider: "github",
          updated_at: new Date(faker.date.past()).toISOString(),
          user_id: faker.number.int().toString(),
        },
      ],
      confirmed_at: new Date(faker.date.past()).toISOString(),
    } satisfies User;

    const user = {
      id: userId,
      is_open_sauced_member: false,
    };
    const createQueryBuilderMock = {
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      setParameters: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(user),
    };

    it("should return the user if found and mark him as open sauced user if he was not", async () => {
      dbWorkspaceRepositoryMock.save?.mockReturnValue(newWorkspace);
      dbUserRepositoryMock.createQueryBuilder?.mockReturnValue(createQueryBuilderMock);
      const result = await userService.checkAddUser(supabaseUser);

      expect(dbUserRepositoryMock.createQueryBuilder).toHaveBeenCalled();
      expect(createQueryBuilderMock.addSelect).toHaveBeenCalled();
      expect(createQueryBuilderMock.where).toHaveBeenCalledWith("id = :id", { id: user.id });
      expect(createQueryBuilderMock.setParameters).toHaveBeenCalledWith({ userId: user.id, userNotificationTypes });
      expect(createQueryBuilderMock.getOne).toHaveBeenCalled();
      expect(dbUserRepositoryMock.update).toHaveBeenCalled();
      expect(result).toEqual(user);
    });

    it("should create a new user if not found and mark him as open sauced user", async () => {
      dbWorkspaceRepositoryMock.save?.mockReturnValue(newWorkspace);

      (createQueryBuilderMock.getOne = jest.fn().mockResolvedValue(null)),
        dbUserRepositoryMock.createQueryBuilder?.mockReturnValue(createQueryBuilderMock);
      await userService.checkAddUser(supabaseUser);

      expect(dbUserRepositoryMock.createQueryBuilder).toHaveBeenCalled();
      expect(createQueryBuilderMock.addSelect).toHaveBeenCalled();
      expect(createQueryBuilderMock.where).toHaveBeenCalledWith("id = :id", { id: user.id });
      expect(createQueryBuilderMock.setParameters).toHaveBeenCalledWith({ userId: user.id, userNotificationTypes });
      expect(createQueryBuilderMock.getOne).toHaveBeenCalled();

      const newUser = {
        id: userId,
        name: supabaseUser.user_metadata.name,
        is_open_sauced_member: true,
        login: supabaseUser.user_metadata.user_name,
        email: supabaseUser.user_metadata.email,
        created_at: new Date(supabaseUser.identities[0].created_at),
        updated_at: new Date(supabaseUser.identities[0].updated_at),
        connected_at: new Date(supabaseUser.confirmed_at),
        campaign_start_date: new Date(supabaseUser.confirmed_at),
        personal_workspace_id: "abc-123",
      };

      dbUserRepositoryMock.save?.mockReturnValue(newUser);
      const result = await userService.checkAddUser(supabaseUser);

      expect(dbUserRepositoryMock.save).toHaveBeenCalledWith(newUser);
      expect(result).toEqual(newUser);
    });
  });

  describe("[updateUser]", () => {
    const userId = faker.number.int();
    const user = {
      id: userId,
      name: faker.person.firstName(),
      email: "",
      bio: "",
      url: "",
      twitter_username: "",
      company: "",
      location: "",
      display_local_time: false,
      timezone: "",
      github_sponsors_url: "",
      linkedin_url: "",
      discord_url: "",
    };
    const createQueryBuilderMock = {
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      setParameters: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(user),
    };

    it("should update the user if found", async () => {
      const updatedUser = { ...user, name: "new name" };

      dbUserRepositoryMock.createQueryBuilder?.mockReturnValue(createQueryBuilderMock);
      const result = await userService.updateUser(userId, updatedUser);

      expect(dbUserRepositoryMock.createQueryBuilder).toHaveBeenCalled();
      expect(createQueryBuilderMock.addSelect).toHaveBeenCalled();
      expect(createQueryBuilderMock.where).toHaveBeenCalledWith("id = :id", { id: user.id });
      expect(createQueryBuilderMock.setParameters).toHaveBeenCalledWith({ userId: user.id, userNotificationTypes });
      expect(createQueryBuilderMock.getOne).toHaveBeenCalled();
      expect(dbUserRepositoryMock.update).toHaveBeenCalled();
      /*
       * skip mocking the updated user as it's just a duplicate of the expectations above
       * can be tested when doing e2e tests
       */
      expect(result).toEqual(user);
    });

    it("should throw an error if the user is not found", async () => {
      createQueryBuilderMock.getOne = jest.fn().mockResolvedValue(null);
      dbUserRepositoryMock.createQueryBuilder?.mockReturnValue(createQueryBuilderMock);
      await expect(userService.updateUser(userId, user)).rejects.toThrow(NotFoundException);
    });
  });

  describe("[updateOnboarding]", () => {
    const userId = faker.number.int();
    const user = {
      id: userId,
      interests: ["javascript", "react"],
      timezone: "",
    };
    const createQueryBuilderMock = {
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      setParameters: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(user),
    };

    it("should update onboarding infos for user if found", async () => {
      dbUserRepositoryMock.createQueryBuilder?.mockReturnValue(createQueryBuilderMock);
      await userService.updateOnboarding(userId, user);

      expect(dbUserRepositoryMock.createQueryBuilder).toHaveBeenCalled();
      expect(createQueryBuilderMock.addSelect).toHaveBeenCalled();
      expect(createQueryBuilderMock.where).toHaveBeenCalledWith("id = :id", { id: user.id });
      expect(createQueryBuilderMock.setParameters).toHaveBeenCalledWith({ userId: user.id, userNotificationTypes });
      expect(createQueryBuilderMock.getOne).toHaveBeenCalled();
      expect(dbUserRepositoryMock.update).toHaveBeenCalled();
    });

    it("should throw an error if the user is not found", async () => {
      createQueryBuilderMock.getOne = jest.fn().mockResolvedValue(null);
      dbUserRepositoryMock.createQueryBuilder?.mockReturnValue(createQueryBuilderMock);
      await expect(userService.updateOnboarding(userId, user)).rejects.toThrow(NotFoundException);
    });
  });

  describe("[updateWaitlistStatus]", () => {
    const userId = faker.number.int();
    const user = {
      id: userId,
      is_waitlisted: false,
    };
    const createQueryBuilderMock = {
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      setParameters: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(user),
    };

    it("should update waitlist status for user if found", async () => {
      dbUserRepositoryMock.createQueryBuilder?.mockReturnValue(createQueryBuilderMock);
      await userService.updateWaitlistStatus(userId);

      expect(dbUserRepositoryMock.createQueryBuilder).toHaveBeenCalled();
      expect(createQueryBuilderMock.addSelect).toHaveBeenCalled();
      expect(createQueryBuilderMock.where).toHaveBeenCalledWith("id = :id", { id: user.id });
      expect(createQueryBuilderMock.setParameters).toHaveBeenCalledWith({ userId: user.id, userNotificationTypes });
      expect(createQueryBuilderMock.getOne).toHaveBeenCalled();
      expect(dbUserRepositoryMock.update).toHaveBeenCalled();
    });

    it("should throw an error if the user is not found", async () => {
      createQueryBuilderMock.getOne = jest.fn().mockResolvedValue(null);
      dbUserRepositoryMock.createQueryBuilder?.mockReturnValue(createQueryBuilderMock);
      await expect(userService.updateWaitlistStatus(userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe("[updateRole]", () => {
    const userId = faker.number.int();
    const role = 0;
    const user = {
      id: userId,
      role,
    };
    const createQueryBuilderMock = {
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      setParameters: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(user),
    };

    it("should update user's role if found", async () => {
      dbUserRepositoryMock.createQueryBuilder?.mockReturnValue(createQueryBuilderMock);
      await userService.updateRole(userId, role);

      expect(dbUserRepositoryMock.createQueryBuilder).toHaveBeenCalled();
      expect(createQueryBuilderMock.addSelect).toHaveBeenCalled();
      expect(createQueryBuilderMock.where).toHaveBeenCalledWith("id = :id", { id: user.id });
      expect(createQueryBuilderMock.setParameters).toHaveBeenCalledWith({ userId: user.id, userNotificationTypes });
      expect(createQueryBuilderMock.getOne).toHaveBeenCalled();
      expect(dbUserRepositoryMock.update).toHaveBeenCalled();
    });

    it("should throw an error if the user is not found", async () => {
      createQueryBuilderMock.getOne = jest.fn().mockResolvedValue(null);
      dbUserRepositoryMock.createQueryBuilder?.mockReturnValue(createQueryBuilderMock);
      await expect(userService.updateWaitlistStatus(userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe("[updateInterests]", () => {
    const userId = faker.number.int();
    const interests = ["javascript", "react"];

    it("should update user's interests", async () => {
      await userService.updateInterests(userId, { interests });
      expect(dbUserRepositoryMock.update).toHaveBeenCalled();
    });
  });

  describe("[updateEmailPreferences]", () => {
    it("should update user's email preferences", async () => {
      const userId = faker.number.int();

      await userService.updateEmailPreferences(userId, {
        display_email: false,
        receive_collaboration: true,
        receive_product_updates: true,
      });
      expect(dbUserRepositoryMock.update).toHaveBeenCalled();
    });
  });

  describe("[findOneByEmail]", () => {
    const email = faker.internet.email();
    const user = { email };

    const createQueryBuilderMock = {
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(user),
    };

    it("should find the user by email", async () => {
      dbUserRepositoryMock.createQueryBuilder?.mockReturnValue(createQueryBuilderMock);
      const result = await userService.findOneByEmail(email.toLowerCase());

      expect(dbUserRepositoryMock.createQueryBuilder).toHaveBeenCalled();
      expect(createQueryBuilderMock.where).toHaveBeenCalledWith("users.email = :email", { email: email.toLowerCase() });
      expect(createQueryBuilderMock.getOne).toHaveBeenCalled();
      expect(result).toEqual(user);
    });

    it("should return null if user is not found", async () => {
      createQueryBuilderMock.getOne = jest.fn().mockResolvedValue(null);
      dbUserRepositoryMock.createQueryBuilder?.mockReturnValue(createQueryBuilderMock);
      const result = await userService.findOneByEmail(email.toLowerCase());

      expect(createQueryBuilderMock.where).toHaveBeenCalledWith("users.email = :email", { email: email.toLowerCase() });
      expect(result).toEqual(null);
    });
  });

  // create tests for deleteUser
  describe("[deleteUser]", () => {
    const userId = faker.number.int();
    const user = {
      id: userId,
      is_onboarded: true,
      is_open_sauced_member: true,
      deleted_at: undefined,
      highlights: [],
      collaborations: [],
      request_collaborations: [],
      insights: [],
      lists: [],
    } as unknown as DbUser;
    const createQueryBuilderMock = {
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      setParameters: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(user),
    };

    it("should delete the user if found", async () => {
      dbUserRepositoryMock.createQueryBuilder?.mockReturnValue(createQueryBuilderMock);
      dbUserRepositoryMock.findOneOrFail?.mockReturnValue(user);
      const deletedUser = await userService.deleteUser(userId);

      expect(dbUserRepositoryMock.createQueryBuilder).toHaveBeenCalled();
      expect(createQueryBuilderMock.addSelect).toHaveBeenCalled();
      expect(createQueryBuilderMock.where).toHaveBeenCalledWith("id = :id", { id: user.id });
      expect(deletedUser).toBeDefined();
    });
  });
});
