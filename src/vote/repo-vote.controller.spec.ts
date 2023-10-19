import { Test, TestingModule } from "@nestjs/testing";
import { faker } from "@faker-js/faker";
import { RepoService } from "../repo/repo.service";
import { RepoPageOptionsDto } from "../repo/dtos/repo-page-options.dto";
import { RepoVoteController } from "./repo-vote.controller";
import { VoteService } from "./vote.service";

describe("RepoVoteController", () => {
  let controller: RepoVoteController;
  const repoServiceMock = {
    findAll: jest.fn(),
    findOneById: jest.fn(),
    findOneByOwnerAndRepo: jest.fn(),
  };

  const voteServiceMock = {
    findOneByRepoId: jest.fn(),
    voteByRepoId: jest.fn(),
    downVoteByRepoId: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RepoVoteController],
      providers: [
        {
          provide: RepoService,
          useValue: repoServiceMock,
        },
        {
          provide: VoteService,
          useValue: voteServiceMock,
        },
      ],
    }).compile();

    controller = module.get<RepoVoteController>(RepoVoteController);
  });

  beforeEach(() => {
    repoServiceMock.findAll.mockClear();
    repoServiceMock.findOneById.mockClear();
    repoServiceMock.findOneByOwnerAndRepo.mockClear();

    voteServiceMock.downVoteByRepoId.mockClear();
    voteServiceMock.voteByRepoId.mockClear();
    voteServiceMock.findOneByRepoId.mockClear();
  });

  describe("findAllUserVoted", () => {
    it("should return paginated repos", async () => {
      const pageOptionsDto = {
        page: faker.number.int(),
        limit: faker.number.int(),
      } as RepoPageOptionsDto;

      const userId = faker.number.int();
      const mockedResponse = {};

      repoServiceMock.findAll.mockResolvedValue(mockedResponse);

      const result = await controller.findAllUserVoted(pageOptionsDto, userId);

      expect(result).toEqual(mockedResponse);
      expect(repoServiceMock.findAll).toHaveBeenCalledWith(pageOptionsDto, userId, ["Votes"]);
    });
  });

  describe("findOneByRepoId", () => {
    it("should return a voted repo", async () => {
      const repoId = faker.number.int();
      const userId = faker.number.int();

      const mockedResponse = {};

      voteServiceMock.findOneByRepoId.mockResolvedValue(mockedResponse);

      const result = await controller.findOneByRepoId(repoId, userId);

      expect(result).toEqual(mockedResponse);
      expect(voteServiceMock.findOneByRepoId).toHaveBeenCalledWith(repoId, userId);
    });
  });

  describe("voteOneById", () => {
    it("should vote for a repo by id", async () => {
      const repoId = faker.number.int();
      const userId = faker.number.int();
      const mockItem = { id: faker.number.int() };
      const mockedResponse = {};

      voteServiceMock.voteByRepoId.mockResolvedValue(mockedResponse);
      repoServiceMock.findOneById.mockResolvedValue(mockItem);

      const result = await controller.voteOneById(repoId, userId);

      expect(result).toEqual(mockedResponse);
      expect(voteServiceMock.voteByRepoId).toHaveBeenCalledWith(mockItem.id, userId);
    });
  });

  describe("voteOneByOwnerAndRepo", () => {
    it("should vote for a repo by owner and repo", async () => {
      const owner = faker.internet.userName();
      const repo = faker.lorem.word();
      const userId = faker.number.int();
      const mockItem = { id: faker.number.int() };
      const mockedResponse = {};

      repoServiceMock.findOneByOwnerAndRepo.mockResolvedValue(mockItem);
      voteServiceMock.voteByRepoId.mockResolvedValue(mockedResponse);

      const result = await controller.voteOneByOwnerAndRepo(owner, repo, userId);

      expect(result).toEqual(mockedResponse);
      expect(repoServiceMock.findOneByOwnerAndRepo).toHaveBeenCalledWith(owner, repo);
      expect(voteServiceMock.voteByRepoId).toHaveBeenCalledWith(mockItem.id, userId);
    });
  });

  describe("downVoteOneById", () => {
    it("should down-vote a repo by id", async () => {
      const repoId = faker.number.int();
      const userId = faker.number.int();
      const mockItem = { id: faker.number.int() };
      const mockedResponse = {};

      voteServiceMock.downVoteByRepoId.mockResolvedValue(mockedResponse);
      repoServiceMock.findOneById.mockResolvedValue(mockItem);
      const result = await controller.downVoteOneById(repoId, userId);

      expect(result).toEqual(mockedResponse);
      expect(voteServiceMock.downVoteByRepoId).toHaveBeenCalledWith(mockItem.id, userId);
    });
  });

  describe("downVoteOneByOwnerAndRepo", () => {
    it("should down-vote a repo by owner and repo", async () => {
      const owner: string = faker.internet.userName();
      const repo: string = faker.lorem.word();
      const userId: number = faker.number.int();
      const mockItem = { id: faker.number.int() };
      const mockedResponse = {};

      voteServiceMock.downVoteByRepoId.mockResolvedValue(mockedResponse);
      repoServiceMock.findOneByOwnerAndRepo.mockResolvedValue(mockItem);
      const result = await controller.downVoteOneByOwnerAndRepo(owner, repo, userId);

      expect(result).toEqual(mockedResponse);
      expect(voteServiceMock.downVoteByRepoId).toHaveBeenCalled();
      expect(voteServiceMock.downVoteByRepoId).toHaveBeenCalledWith(mockItem.id, userId);
    });
  });
});
