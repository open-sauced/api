import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { faker } from "@faker-js/faker";
import { NotFoundException } from "@nestjs/common";
import { PagerService } from "../common/services/pager.service";
import { PageOptionsDto } from "../common/dtos/page-options.dto";
import { PageDto } from "../common/dtos/page.dto";
import { PageMetaDto } from "../common/dtos/page-meta.dto";
import { DbUserConnection } from "./entities/user-connection.entity";
import { UserConnectionService } from "./user-connection.service";

describe("UserConnectionService", () => {
  let service: UserConnectionService;

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

  const userConnectionRepositoryMock = {
    createQueryBuilder: jest.fn().mockReturnValue(queryBuilderMock),
    save: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserConnectionService,
        {
          provide: PagerService,
          useValue: pagerServiceMock,
        },
        {
          provide: getRepositoryToken(DbUserConnection, "ApiConnection"),
          useValue: userConnectionRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<UserConnectionService>(UserConnectionService);
  });

  afterEach(() => {
    userConnectionRepositoryMock.createQueryBuilder.mockClear();
    userConnectionRepositoryMock.save.mockClear();
    userConnectionRepositoryMock.update.mockClear();
    userConnectionRepositoryMock.softDelete.mockClear();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findOneById", () => {
    it("should return a user connection when given a valid id", async () => {
      const id = faker.string.uuid();
      const userId = faker.number.int();
      const requestUserId = faker.number.int();
      const userConnection = { id, user_id: userId, request_user_id: requestUserId };

      queryBuilderMock.getOne.mockResolvedValue(userConnection);

      const result = await service.findOneById(id);

      expect(result).toEqual(userConnection);
      expect(queryBuilderMock.getOne).toHaveBeenCalled();
    });

    it("should throw NotFoundException when given an invalid id", async () => {
      const id = faker.string.uuid();

      queryBuilderMock.getOne.mockResolvedValue(null);
      await expect(service.findOneById(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe("addUserConnection", () => {
    it("should create a new user connection", async () => {
      const id = faker.string.uuid();
      const userId = faker.number.int();
      const requestUserId = faker.number.int();
      const userConnection = { id, user_id: userId, request_user_id: requestUserId };

      userConnectionRepositoryMock.save.mockResolvedValue(userConnection);
      const result = await service.addUserConnection(userConnection);

      expect(userConnectionRepositoryMock.save).toHaveBeenCalledWith(userConnection);
      expect(result).toEqual(userConnection);
    });
  });

  describe("updateUserConnection", () => {
    it("should update a user connection", async () => {
      const id = faker.string.uuid();
      const userId = faker.number.int();
      const requestUserId = faker.number.int();
      const userConnection = { id, user_id: userId, request_user_id: requestUserId };

      userConnectionRepositoryMock.update.mockResolvedValue(userConnection);
      const result = await service.updateUserConnection(id, userConnection);

      expect(userConnectionRepositoryMock.update).toHaveBeenCalledWith(id, userConnection);
      expect(result).toEqual(userConnection);
    });
  });

  describe("removeUserConnection", () => {
    it("should remove a user connection", async () => {
      const id = faker.string.uuid();
      const userId = faker.number.int();
      const requestUserId = faker.number.int();
      const userConnection = { id, user_id: userId, request_user_id: requestUserId };

      userConnectionRepositoryMock.softDelete.mockResolvedValue(userConnection);
      const result = await service.removeUserConnection(id);

      expect(userConnectionRepositoryMock.softDelete).toHaveBeenCalledWith(id);
      expect(result).toEqual(userConnection);
    });
  });

  describe("findAllUserConnections", () => {
    it("should return all user connections for the given user", async () => {
      const pageOptionsDto: PageOptionsDto = { page: 1, limit: 10, skip: 0 };
      const id = faker.string.uuid();
      const userId = faker.number.int();
      const requestUserId = faker.number.int();
      const userConnection = { id, user_id: userId, request_user_id: requestUserId };
      const userConnections = [userConnection];
      const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemCount: 1 });
      const expectedResult = new PageDto(userConnections, pageMetaDto);

      const createQueryBuilderMock = {
        innerJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
      };

      pagerServiceMock.applyPagination.mockReturnValue(expectedResult);
      userConnectionRepositoryMock.createQueryBuilder.mockReturnValue(createQueryBuilderMock);
      const result = await service.findAllUserConnections(pageOptionsDto, userId);

      expect(userConnectionRepositoryMock.createQueryBuilder).toHaveBeenCalled();
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
