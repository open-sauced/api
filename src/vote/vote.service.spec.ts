import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { NotFoundException, ConflictException } from "@nestjs/common";
import { faker } from "@faker-js/faker";
import { DbRepoToUserVotes } from "../repo/entities/repo.to.user.votes.entity";
import { VoteService } from "./vote.service";

describe("VoteService", () => {
  let service: VoteService;

  const queryBuilderMock = {
    withDeleted: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
  };
  const repoVoteRepositoryMock = {
    createQueryBuilder: jest.fn().mockReturnValue(queryBuilderMock),
    restore: jest.fn(),
    save: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VoteService,
        {
          provide: getRepositoryToken(DbRepoToUserVotes, "ApiConnection"),
          useValue: repoVoteRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<VoteService>(VoteService);
  });

  afterEach(() => {
    repoVoteRepositoryMock.createQueryBuilder.mockClear();
    repoVoteRepositoryMock.restore.mockClear();
    repoVoteRepositoryMock.save.mockClear();
    repoVoteRepositoryMock.softDelete.mockClear();
  });

  describe("findOneByRepoId", () => {
    it("should return voted repo if vote exists", async () => {
      const repoId = faker.number.int();
      const userId = faker.number.int();
      const voteExists = { id: 1, deleted_at: null };

      // repoVoteRepositoryMock.createQueryBuilder.mockReturnValue(withDeletedMock);
      queryBuilderMock.getOne.mockResolvedValue(voteExists);

      const result = await service.findOneByRepoId(repoId, userId);

      expect(result).toEqual({ voted: true, data: voteExists });
      expect(queryBuilderMock.getOne).toHaveBeenCalled();
    });

    it("should return not voted repo if vote does not exist", async () => {
      const repoId = faker.number.int();
      const userId = faker.number.int();

      queryBuilderMock.getOne.mockResolvedValue(null);

      const result = await service.findOneByRepoId(repoId, userId);

      expect(result).toEqual({ voted: false, data: null });
    });

    it("should return not voted repo if vote is soft-deleted", async () => {
      // mock data
      const repoId = faker.number.int();
      const userId = faker.number.int();
      const voteExists = { id: 1, deleted_at: new Date() };

      queryBuilderMock.getOne.mockResolvedValue(voteExists);

      const result = await service.findOneByRepoId(repoId, userId);

      expect(result).toEqual({ voted: false, data: null });
    });
  });

  describe("voteByRepoId", () => {
    it("should return the existing vote if it is soft-deleted and restore it", async () => {
      const repoId = faker.number.int();
      const userId = faker.number.int();
      const voteExists = { id: 1, deleted_at: new Date() };

      queryBuilderMock.getOne.mockResolvedValue(voteExists);

      const result = await service.voteByRepoId(repoId, userId);

      expect(result).toEqual(voteExists);
      expect(repoVoteRepositoryMock.restore).toHaveBeenCalledWith(voteExists.id);
    });

    it("should create and return a new vote if no vote exists", async () => {
      const repoId = faker.number.int();
      const userId = faker.number.int();

      queryBuilderMock.getOne.mockResolvedValue(null);

      const savedVote = { id: 2, repo_id: repoId, user_id: userId };

      repoVoteRepositoryMock.save.mockResolvedValue(savedVote);

      const result = await service.voteByRepoId(repoId, userId);

      expect(result).toEqual(savedVote);
      expect(repoVoteRepositoryMock.save).toHaveBeenCalledWith({ repo_id: repoId, user_id: userId });
    });

    it("should throw ConflictException if the existing vote is not soft-deleted", async () => {
      const repoId = faker.number.int();
      const userId = faker.number.int();
      const voteExists = { id: 1, deleted_at: null };

      queryBuilderMock.getOne.mockResolvedValue(voteExists);

      await expect(service.voteByRepoId(repoId, userId)).rejects.toThrow(ConflictException);
    });
  });

  describe("downVoteByRepoId", () => {
    it("should throw NotFoundException if no vote exists", async () => {
      const repoId = faker.number.int();
      const userId = faker.number.int();

      queryBuilderMock.getOne.mockResolvedValue(null);

      await expect(service.downVoteByRepoId(repoId, userId)).rejects.toThrow(NotFoundException);
    });

    it("should throw ConflictException if the existing vote is soft-deleted", async () => {
      const repoId = faker.number.int();
      const userId = faker.number.int();
      const voteExists = { id: 1, deleted_at: new Date() };

      queryBuilderMock.getOne.mockResolvedValue(voteExists);

      await expect(service.downVoteByRepoId(repoId, userId)).rejects.toThrow(ConflictException);
    });

    it("should soft-delete the existing vote and return it", async () => {
      const repoId = faker.number.int();
      const userId = faker.number.int();
      const voteExists = { id: 1, deleted_at: null };

      queryBuilderMock.getOne.mockResolvedValue(voteExists);
      repoVoteRepositoryMock.softDelete.mockResolvedValue(voteExists);

      const result = await service.downVoteByRepoId(repoId, userId);

      expect(result).toEqual(voteExists);
      expect(repoVoteRepositoryMock.softDelete).toHaveBeenCalledWith(voteExists.id);
    });
  });
});
