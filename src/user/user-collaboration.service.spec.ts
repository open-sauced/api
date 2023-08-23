import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { faker } from "@faker-js/faker";
import { NotFoundException } from "@nestjs/common";
import { PagerService } from "../common/services/pager.service";
import { PageOptionsDto } from "../common/dtos/page-options.dto";
import { PageDto } from "../common/dtos/page.dto";
import { PageMetaDto } from "../common/dtos/page-meta.dto";
import { DbUserCollaboration } from "./entities/user-collaboration.entity";
import { UserCollaborationService } from "./user-collaboration.service";

describe("UserCollaborationService", () => {
  let service: UserCollaborationService;

  const queryBuilderMock = {
    withDeleted: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
  };

  const pagerServiceMock = {
    applyPagination: jest.fn(),
  };

  const userCollaborationRepositoryMock = {
    createQueryBuilder: jest.fn().mockReturnValue(queryBuilderMock),
    save: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserCollaborationService,
        {
          provide: PagerService,
          useValue: pagerServiceMock,
        },
        {
          provide: getRepositoryToken(DbUserCollaboration, "ApiConnection"),
          useValue: userCollaborationRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<UserCollaborationService>(UserCollaborationService);
  });

  afterEach(() => {
    userCollaborationRepositoryMock.createQueryBuilder.mockClear();
    userCollaborationRepositoryMock.save.mockClear();
    userCollaborationRepositoryMock.update.mockClear();
    userCollaborationRepositoryMock.softDelete.mockClear();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findOneById", () => {
    it("should return a user collaboration when given a valid id", async () => {
      const id = faker.string.uuid();
      const userId = faker.number.int();
      const requestUserId = faker.number.int();
      const userCollaboration = { id, user_id: userId, request_user_id: requestUserId };

      queryBuilderMock.getOne.mockResolvedValue(userCollaboration);

      const result = await service.findOneById(id);

      expect(result).toEqual(userCollaboration);
      expect(queryBuilderMock.getOne).toHaveBeenCalled();
    });

    it("should throw NotFoundException when given an invalid id", async () => {
      const id = faker.string.uuid();

      queryBuilderMock.getOne.mockResolvedValue(null);
      await expect(service.findOneById(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe("addUserCollaboration", () => {
    it("should create a new user collaboration", async () => {
      const id = faker.string.uuid();
      const userId = faker.number.int();
      const requestUserId = faker.number.int();
      const userCollaboration = { id, user_id: userId, request_user_id: requestUserId };

      userCollaborationRepositoryMock.save.mockResolvedValue(userCollaboration);
      const result = await service.addUserCollaboration(userCollaboration);

      expect(userCollaborationRepositoryMock.save).toHaveBeenCalledWith(userCollaboration);
      expect(result).toEqual(userCollaboration);
    });
  });

  describe("updateUserCollaboration", () => {
    it("should update a user collaboration", async () => {
      const id = faker.string.uuid();
      const userId = faker.number.int();
      const requestUserId = faker.number.int();
      const userCollaboration = { id, user_id: userId, request_user_id: requestUserId };

      userCollaborationRepositoryMock.update.mockResolvedValue(userCollaboration);
      const result = await service.updateUserCollaboration(id, userCollaboration);

      expect(userCollaborationRepositoryMock.update).toHaveBeenCalledWith(id, userCollaboration);
      expect(result).toEqual(userCollaboration);
    });
  });

  describe("removeUserCollaboration", () => {
    it("should remove a user collaboration", async () => {
      const id = faker.string.uuid();
      const userId = faker.number.int();
      const requestUserId = faker.number.int();
      const userCollaboration = { id, user_id: userId, request_user_id: requestUserId };

      userCollaborationRepositoryMock.softDelete.mockResolvedValue(userCollaboration);
      const result = await service.removeUserCollaboration(id);

      expect(userCollaborationRepositoryMock.softDelete).toHaveBeenCalledWith(id);
      expect(result).toEqual(userCollaboration);
    });
  });

  describe("findAllUserCollaborations", () => {
    it("should return all user collaborations for the given user", async () => {
      const pageOptionsDto: PageOptionsDto = { page: 1, limit: 10, skip: 0 };
      const id = faker.string.uuid();
      const userId = faker.number.int();
      const requestUserId = faker.number.int();
      const userCollaboration = { id, user_id: userId, request_user_id: requestUserId };
      const userCollaborations = [userCollaboration];
      const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemCount: 1 });
      const expectedResult = new PageDto(userCollaborations, pageMetaDto);

      const createQueryBuilderMock = {
        innerJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
      };

      pagerServiceMock.applyPagination.mockReturnValue(expectedResult);
      userCollaborationRepositoryMock.createQueryBuilder.mockReturnValue(createQueryBuilderMock);
      const result = await service.findAllUserCollaborations(pageOptionsDto, userId);

      expect(userCollaborationRepositoryMock.createQueryBuilder).toHaveBeenCalled();
      expect(createQueryBuilderMock.innerJoinAndSelect).toHaveBeenCalled();
      expect(createQueryBuilderMock.where).toHaveBeenCalled();
      expect(createQueryBuilderMock.orderBy).toHaveBeenCalled();
      expect(pagerServiceMock.applyPagination).toHaveBeenCalledWith({
        pageOptionsDto,
        queryBuilder: createQueryBuilderMock,
      });
      expect(result).toMatchObject(expectedResult);
    });
  });
});
