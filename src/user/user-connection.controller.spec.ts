import { Test, TestingModule } from "@nestjs/testing";
import { faker } from "@faker-js/faker";
import { SupabaseAuthUser } from "nestjs-supabase-auth";
import { ConflictException, UnauthorizedException } from "@nestjs/common";
import { PageOptionsDto } from "../common/dtos/page-options.dto";
import { UserConnectionController } from "./user-connection.controller";
import { UserConnectionService } from "./user-connection.service";
import { UserService } from "./services/user.service";
import { CreateUserConnectionDto } from "./dtos/create-user-connection.dto";
import { DbUserConnection } from "./entities/user-connection.entity";

describe("UserConnectionController", () => {
  let controller: UserConnectionController;

  const userConnectionServiceMock = {
    findAllUserConnections: jest.fn(),
    addUserConnection: jest.fn(),
    findOneById: jest.fn(),
    updateUserConnection: jest.fn(),
    removeUserConnection: jest.fn(),
  };

  const userServiceMock = {
    findOneByUsername: jest.fn(),
    findOneById: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserConnectionController],
      providers: [
        {
          provide: UserConnectionService,
          useValue: userConnectionServiceMock,
        },
        {
          provide: UserService,
          useValue: userServiceMock,
        },
      ],
    }).compile();

    controller = module.get<UserConnectionController>(UserConnectionController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  beforeEach(() => {
    userConnectionServiceMock.findAllUserConnections.mockClear();
    userConnectionServiceMock.findOneById.mockClear();
    userConnectionServiceMock.addUserConnection.mockClear();
    userConnectionServiceMock.updateUserConnection.mockClear();
    userConnectionServiceMock.removeUserConnection.mockClear();

    userServiceMock.findOneById.mockClear();
    userServiceMock.findOneByUsername.mockClear();
  });

  describe("findAllUserConnections", () => {
    it("should return all connections for the authenticated user", async () => {
      const pageOptionsDto: PageOptionsDto = {
        page: faker.number.int(),
        limit: faker.number.int(),
        skip: 0,
      };

      const userId = faker.number.int();
      const mockedResponse = {};

      userConnectionServiceMock.findAllUserConnections.mockResolvedValue(mockedResponse);
      const result = await controller.findAllUserConnections(pageOptionsDto, userId);

      expect(result).toEqual(mockedResponse);
      expect(userConnectionServiceMock.findAllUserConnections).toHaveBeenCalledWith(pageOptionsDto, userId);
    });
  });

  describe("addUserConnection", () => {
    it("should add a new connection request for the user", async () => {
      const id = faker.string.uuid();
      const userId = faker.number.int();
      const requestUserId = faker.number.int();
      const sub = faker.number.int();
      const username = faker.internet.userName();
      const message = faker.lorem.lines();
      const createUserConnectionDto: CreateUserConnectionDto = { username, message };
      const user = { id, user_metadata: { sub } } as unknown as SupabaseAuthUser;
      const recipient = { id, receive_connection: true };
      const requester = { id, role: 60 };
      const newUserConnection = { id, user_id: userId, request_user_id: requestUserId, message, status: "pending" };

      userServiceMock.findOneByUsername.mockResolvedValue(recipient);
      userServiceMock.findOneById.mockResolvedValue(requester);
      userConnectionServiceMock.addUserConnection.mockResolvedValue(newUserConnection);

      const result = await controller.addUserConnection(createUserConnectionDto, user);

      expect(userServiceMock.findOneByUsername).toHaveBeenCalledWith(username);
      expect(userServiceMock.findOneById).toHaveBeenCalledWith(sub);
      expect(userConnectionServiceMock.addUserConnection).toHaveBeenCalledWith({
        user_id: recipient.id,
        request_user_id: requester.id,
        message: createUserConnectionDto.message,
        status: "pending",
      });
      expect(result).toEqual(newUserConnection);
    });

    it("should throw an UnauthorizedException when the requester user has role < 50", async () => {
      const id = faker.string.uuid();
      const username = faker.internet.userName();
      const recipient = { id, receive_connection: true };
      const requester = { id, role: 40 };
      const user = { id, user_metadata: { sub: 2 } } as unknown as SupabaseAuthUser;

      userServiceMock.findOneByUsername.mockResolvedValue(recipient);
      userServiceMock.findOneById.mockResolvedValue(requester);

      await expect(controller.addUserConnection({ username, message: "Test message" }, user)).rejects.toThrow(
        UnauthorizedException
      );
      expect(userServiceMock.findOneByUsername).toHaveBeenCalledWith(username);
      expect(userServiceMock.findOneById).toHaveBeenCalledWith(user.user_metadata.sub);
      expect(userConnectionServiceMock.addUserConnection).not.toHaveBeenCalled();
    });

    it("should throw a ConflictException when the recipient is not accepting connection requests", async () => {
      const id = faker.string.uuid();
      const username = faker.internet.userName();
      const recipient = { id, receive_connection: false };
      const requester = { id, role: 60 };
      const user = { id, user_metadata: { sub: 2 } } as unknown as SupabaseAuthUser;

      userServiceMock.findOneByUsername.mockResolvedValue(recipient);
      userServiceMock.findOneById.mockResolvedValue(requester);

      await expect(controller.addUserConnection({ username, message: "Test message" }, user)).rejects.toThrow(
        ConflictException
      );
      expect(userServiceMock.findOneByUsername).toHaveBeenCalledWith(username);
      expect(userServiceMock.findOneById).toHaveBeenCalledWith(user.user_metadata.sub);
      expect(userConnectionServiceMock.addUserConnection).not.toHaveBeenCalled();
    });
  });

  describe("updateUserConnection", () => {
    it("should update user connection when input is valid", async () => {
      const id = faker.string.uuid();
      const userId = faker.number.int();
      const updateUserConnectionDto = { status: "accept" };
      const connection = new DbUserConnection();

      connection.user_id = userId;
      const updatedUserConnection = new DbUserConnection();

      updatedUserConnection.user_id = userId;

      userConnectionServiceMock.findOneById.mockResolvedValue(connection);
      userConnectionServiceMock.updateUserConnection.mockResolvedValue(updatedUserConnection);

      const result = await controller.updateUserConnection(id, userId, updateUserConnectionDto);

      expect(result).toEqual(updatedUserConnection);
      expect(userConnectionServiceMock.findOneById).toHaveBeenCalledWith(id);
      expect(userConnectionServiceMock.updateUserConnection).toHaveBeenCalledWith(id, { status: "accept" });
    });

    it("should throw UnauthorizedException when user is not authorized", async () => {
      const id = faker.string.uuid();
      const userId = faker.number.int();
      const updateUserConnectionDto = { status: "accept" };
      const connection = new DbUserConnection();

      connection.user_id = 123;

      userConnectionServiceMock.findOneById.mockResolvedValue(connection);

      // act & Assert
      await expect(controller.updateUserConnection(id, userId, updateUserConnectionDto)).rejects.toThrow(
        UnauthorizedException
      );
      expect(userConnectionServiceMock.findOneById).toHaveBeenCalledWith(id);
    });
  });

  describe("removeUserConnectionById", () => {
    it("should remove the user connection request when it exists and the authenticated user is the owner", async () => {
      const id = faker.string.uuid();
      const userId = faker.number.int();
      const connection = new DbUserConnection();

      connection.user_id = userId;

      userConnectionServiceMock.findOneById.mockResolvedValue(connection);

      await controller.removeUserConnectionById(id, userId);

      expect(userConnectionServiceMock.findOneById).toHaveBeenCalledWith(id);
      expect(userConnectionServiceMock.removeUserConnection).toHaveBeenCalledWith(id);
    });
  });

  it("should throw an UnauthorizedException when the user is not the owner of the connection request", async () => {
    const id = faker.string.uuid();
    const userId = faker.number.int();
    const connection = new DbUserConnection();

    connection.user_id = 123;

    userConnectionServiceMock.findOneById.mockResolvedValue(connection);

    await expect(controller.removeUserConnectionById(id, userId)).rejects.toThrow(UnauthorizedException);
    expect(userConnectionServiceMock.findOneById).toHaveBeenCalledWith(id);
    expect(userConnectionServiceMock.removeUserConnection).not.toHaveBeenCalled();
  });
});
