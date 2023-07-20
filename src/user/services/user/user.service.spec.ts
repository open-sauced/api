/* eslint-disable @typescript-eslint/no-explicit-any */
import { NotFoundException } from "@nestjs/common";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Test } from "@nestjs/testing";
import { faker } from "@faker-js/faker";
import { ObjectLiteral, Repository } from "typeorm";

import { UserService } from "../../services/user/user.service";
import { userNotificationTypes } from "./../../entities/user-notification.constants";
import { DbUser } from "../../user.entity";
import { DbUserHighlightReaction } from "../../entities/user-highlight-reaction.entity";

type MockRepository<T extends ObjectLiteral = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T extends ObjectLiteral = any>(): MockRepository<T> => ({
  createQueryBuilder: jest.fn(),
});

describe("UserService", () => {
  let userService: UserService;
  let dbUserRepositoryMock: MockRepository;
  let dbUserHighlightReactionRepositoryMock: MockRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(DbUser, "ApiConnection"),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(DbUserHighlightReaction, "ApiConnection"),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    dbUserRepositoryMock = module.get<MockRepository>(getRepositoryToken(DbUser, "ApiConnection"));
    dbUserHighlightReactionRepositoryMock = module.get<MockRepository>(
      getRepositoryToken(DbUserHighlightReaction, "ApiConnection")
    );
  });

  it("should be defined", () => {
    expect(userService).toBeDefined();
  });

  describe("findTopUsers", () => {
    it("should return a list of top users", async () => {
      const expectedUsers = [{ id: faker.number.int() }, { id: faker.number.int() }];
      const defaultLimit = 10;

      const createQueryBuilderMock = {
        select: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue(expectedUsers),
      };

      dbUserHighlightReactionRepositoryMock.createQueryBuilder?.mockReturnValue(createQueryBuilderMock);
      const result = await userService.findTopUsers(defaultLimit);

      expect(dbUserHighlightReactionRepositoryMock.createQueryBuilder).toHaveBeenCalled();
      /*
       * @todo remove this comment before merging
       * we can also use `toHaveBeenCalledWith` and pass the sql query as an argument
       * but it's just a repetition of the query we have in the service
       * unless the query is taking some parameters. let me know what you think
       */
      expect(createQueryBuilderMock.select).toHaveBeenCalled();
      expect(createQueryBuilderMock.innerJoin).toHaveBeenCalled();
      expect(createQueryBuilderMock.where).toHaveBeenCalled();
      expect(createQueryBuilderMock.groupBy).toHaveBeenCalled();
      expect(createQueryBuilderMock.orderBy).toHaveBeenCalled();
      expect(createQueryBuilderMock.limit).toHaveBeenCalledWith(defaultLimit);
      expect(createQueryBuilderMock.getRawMany).toHaveBeenCalled();
      expect(result).toEqual(expectedUsers);
    });
  });

  describe("findOneById", () => {
    const user = { id: faker.number.int(), email: faker.internet.email() };
    let includeEmail = false;
    const createQueryBuilderMock = {
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      setParameters: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(user),
    };

    it("should return a user with the given id without the email", async () => {
      dbUserRepositoryMock.createQueryBuilder?.mockReturnValue(createQueryBuilderMock);
      const result = await userService.findOneById(user.id, includeEmail);
      const expectedResult = { id: user.id };

      expect(dbUserRepositoryMock.createQueryBuilder).toHaveBeenCalled();
      expect(createQueryBuilderMock.addSelect).toHaveBeenCalled();
      expect(createQueryBuilderMock.where).toHaveBeenCalledWith("id = :id", { id: user.id });
      expect(createQueryBuilderMock.setParameters).toHaveBeenCalledWith({
        userId: user.id,
        userNotificationTypes,
      });
      expect(createQueryBuilderMock.getOne).toHaveBeenCalled();
      // eslint-disable-next-line capitalized-comments
      // TODO: bug `findOneById` should return the email even if `includeEmail` is false
      expect(result).toEqual(expectedResult);
    });

    it("should return a user with the given id with the email", async () => {
      includeEmail = true;
      dbUserRepositoryMock.createQueryBuilder?.mockReturnValue(createQueryBuilderMock);
      const result = await userService.findOneById(user.id, includeEmail);

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

      try {
        await userService.findOneById(faker.number.int());
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
        expect((err as NotFoundException).message).toEqual("Not Found");
      }
    });
  });

  it.todo("Add describe block for [findOneByUsername]");
  it.todo("Add describe block for [checkAddUser]");
  it.todo("Add describe block for [updateUser]");
  it.todo("Add describe block for [updateOnboarding]");
  it.todo("Add describe block for [updateWaitlistStatus]");
  it.todo("Add describe block for [updateRole]");
  it.todo("Add describe block for [updateInterests]");
  it.todo("Add describe block for [updateEmailPreferences]");
  it.todo("Add describe block for [findOneByEmail]");
});
