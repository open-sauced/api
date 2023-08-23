import { Test, TestingModule } from "@nestjs/testing";
import { faker } from "@faker-js/faker";
import { SupabaseAuthUser } from "nestjs-supabase-auth";
import { ConflictException, UnauthorizedException } from "@nestjs/common";
import { PageOptionsDto } from "../common/dtos/page-options.dto";
import { UserCollaborationController } from "./user-collaboration.controller";
import { UserCollaborationService } from "./user-collaboration.service";
import { UserService } from "./services/user.service";
import { CreateUserCollaborationDto } from "./dtos/create-user-collaboration.dto";
import { DbUserCollaboration } from "./entities/user-collaboration.entity";

describe("UserCollaborationController", () => {
  let controller: UserCollaborationController;

  const userCollaborationServiceMock = {
    findAllUserCollaborations: jest.fn(),
    addUserCollaboration: jest.fn(),
    findOneById: jest.fn(),
    updateUserCollaboration: jest.fn(),
    removeUserCollaboration: jest.fn(),
  };

  const userServiceMock = {
    findOneByUsername: jest.fn(),
    findOneById: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserCollaborationController],
      providers: [
        {
          provide: UserCollaborationService,
          useValue: userCollaborationServiceMock,
        },
        {
          provide: UserService,
          useValue: userServiceMock,
        },
      ],
    }).compile();

    controller = module.get<UserCollaborationController>(UserCollaborationController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  beforeEach(() => {
    userCollaborationServiceMock.findAllUserCollaborations.mockClear();
    userCollaborationServiceMock.findOneById.mockClear();
    userCollaborationServiceMock.addUserCollaboration.mockClear();
    userCollaborationServiceMock.updateUserCollaboration.mockClear();
    userCollaborationServiceMock.removeUserCollaboration.mockClear();

    userServiceMock.findOneById.mockClear();
    userServiceMock.findOneByUsername.mockClear();
  });

  describe("findAllUserCollaborations", () => {
    it("should return all collaborations for the authenticated user", async () => {
      const pageOptionsDto: PageOptionsDto = {
        page: faker.number.int(),
        limit: faker.number.int(),
        skip: 0,
      };

      const userId = faker.number.int();
      const mockedResponse = {};

      userCollaborationServiceMock.findAllUserCollaborations.mockResolvedValue(mockedResponse);
      const result = await controller.findAllUserCollaborations(pageOptionsDto, userId);

      expect(result).toEqual(mockedResponse);
      expect(userCollaborationServiceMock.findAllUserCollaborations).toHaveBeenCalledWith(pageOptionsDto, userId);
    });
  });

  describe("addUserCollaboration", () => {
    it("should add a new collaboration request for the user", async () => {
      const id = faker.string.uuid();
      const userId = faker.number.int();
      const requestUserId = faker.number.int();
      const sub = faker.number.int();
      const username = faker.internet.userName();
      const message = faker.lorem.lines();
      const createUserCollaborationDto: CreateUserCollaborationDto = { username, message };
      const user = { id, user_metadata: { sub } } as unknown as SupabaseAuthUser;
      const recipient = { id, receive_collaboration: true };
      const requester = { id, role: 60 };
      const newUserCollaboration = { id, user_id: userId, request_user_id: requestUserId, message, status: "pending" };

      userServiceMock.findOneByUsername.mockResolvedValue(recipient);
      userServiceMock.findOneById.mockResolvedValue(requester);
      userCollaborationServiceMock.addUserCollaboration.mockResolvedValue(newUserCollaboration);

      const result = await controller.addUserCollaboration(createUserCollaborationDto, user);

      expect(userServiceMock.findOneByUsername).toHaveBeenCalledWith(username);
      expect(userServiceMock.findOneById).toHaveBeenCalledWith(sub);
      expect(userCollaborationServiceMock.addUserCollaboration).toHaveBeenCalledWith({
        user_id: recipient.id,
        request_user_id: requester.id,
        message: createUserCollaborationDto.message,
        status: "pending",
      });
      expect(result).toEqual(newUserCollaboration);
    });

    it("should throw an UnauthorizedException when the requester user has role <= 50", async () => {
      const id = faker.string.uuid();
      const username = faker.internet.userName();
      const recipient = { id, receive_collaboration: true };
      const requester = { id, role: 50 };
      const user = { id, user_metadata: { sub: 2 } } as unknown as SupabaseAuthUser;

      userServiceMock.findOneByUsername.mockResolvedValue(recipient);
      userServiceMock.findOneById.mockResolvedValue(requester);

      await expect(controller.addUserCollaboration({ username, message: "Test message" }, user)).rejects.toThrow(
        UnauthorizedException
      );
      expect(userServiceMock.findOneByUsername).toHaveBeenCalledWith(username);
      expect(userServiceMock.findOneById).toHaveBeenCalledWith(user.user_metadata.sub);
      expect(userCollaborationServiceMock.addUserCollaboration).not.toHaveBeenCalled();
    });

    it("should throw a ConflictException when the recipient is not accepting collaboration requests", async () => {
      const id = faker.string.uuid();
      const username = faker.internet.userName();
      const recipient = { id, receive_collaboration: false };
      const requester = { id, role: 60 };
      const user = { id, user_metadata: { sub: 2 } } as unknown as SupabaseAuthUser;

      userServiceMock.findOneByUsername.mockResolvedValue(recipient);
      userServiceMock.findOneById.mockResolvedValue(requester);

      await expect(controller.addUserCollaboration({ username, message: "Test message" }, user)).rejects.toThrow(
        ConflictException
      );
      expect(userServiceMock.findOneByUsername).toHaveBeenCalledWith(username);
      expect(userServiceMock.findOneById).toHaveBeenCalledWith(user.user_metadata.sub);
      expect(userCollaborationServiceMock.addUserCollaboration).not.toHaveBeenCalled();
    });
  });

  describe("updateUserCollaboration", () => {
    it("should update user collaboration when input is valid", async () => {
      const id = faker.string.uuid();
      const userId = faker.number.int();
      const updateUserCollaborationDto = { status: "accept" };
      const collaboration = new DbUserCollaboration();

      collaboration.user_id = userId;
      const updatedUserCollaboration = new DbUserCollaboration();

      updatedUserCollaboration.user_id = userId;

      userCollaborationServiceMock.findOneById.mockResolvedValue(collaboration);
      userCollaborationServiceMock.updateUserCollaboration.mockResolvedValue(updatedUserCollaboration);

      const result = await controller.updateUserCollaboration(id, userId, updateUserCollaborationDto);

      expect(result).toEqual(updatedUserCollaboration);
      expect(userCollaborationServiceMock.findOneById).toHaveBeenCalledWith(id);
      expect(userCollaborationServiceMock.updateUserCollaboration).toHaveBeenCalledWith(id, { status: "accept" });
    });

    it("should throw UnauthorizedException when user is not authorized", async () => {
      const id = faker.string.uuid();
      const userId = faker.number.int();
      const updateUserCollaborationDto = { status: "accept" };
      const collaboration = new DbUserCollaboration();

      collaboration.user_id = 123;

      userCollaborationServiceMock.findOneById.mockResolvedValue(collaboration);

      // act & Assert
      await expect(controller.updateUserCollaboration(id, userId, updateUserCollaborationDto)).rejects.toThrow(
        UnauthorizedException
      );
      expect(userCollaborationServiceMock.findOneById).toHaveBeenCalledWith(id);
    });
  });

  describe("removeUserCollaborationById", () => {
    it("should remove the user collaboration request when it exists and the authenticated user is the owner", async () => {
      const id = faker.string.uuid();
      const userId = faker.number.int();
      const collaboration = new DbUserCollaboration();

      collaboration.user_id = userId;

      userCollaborationServiceMock.findOneById.mockResolvedValue(collaboration);

      await controller.removeUserCollaborationById(id, userId);

      expect(userCollaborationServiceMock.findOneById).toHaveBeenCalledWith(id);
      expect(userCollaborationServiceMock.removeUserCollaboration).toHaveBeenCalledWith(id);
    });
  });

  it("should throw an UnauthorizedException when the user is not the owner of the collaboration request", async () => {
    const id = faker.string.uuid();
    const userId = faker.number.int();
    const collaboration = new DbUserCollaboration();

    collaboration.user_id = 123;

    userCollaborationServiceMock.findOneById.mockResolvedValue(collaboration);

    await expect(controller.removeUserCollaborationById(id, userId)).rejects.toThrow(UnauthorizedException);
    expect(userCollaborationServiceMock.findOneById).toHaveBeenCalledWith(id);
    expect(userCollaborationServiceMock.removeUserCollaboration).not.toHaveBeenCalled();
  });
});
