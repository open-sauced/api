import { Test, TestingModule } from "@nestjs/testing";
import { faker } from "@faker-js/faker";
import { RepoService } from "../repo/repo.service";
import { RepoContributionsController } from "./repo-contributions.controller";
import { ContributionService } from "./contribution.service";
import { ContributionPageOptionsDto } from "./dtos/contribution-page-options.dto";

describe("RepoContributionsController", () => {
  let controller: RepoContributionsController;

  const repoServiceMock = {
    findOneById: jest.fn(),
    findOneByOwnerAndRepo: jest.fn(),
  };
  const contributionServiceMock = {
    findAll: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RepoContributionsController],
      providers: [
        {
          provide: RepoService,
          useValue: repoServiceMock,
        },
        {
          provide: ContributionService,
          useValue: contributionServiceMock,
        },
      ],
    }).compile();

    controller = module.get<RepoContributionsController>(RepoContributionsController);
  });

  beforeEach(() => {
    repoServiceMock.findOneById.mockClear();
    repoServiceMock.findOneByOwnerAndRepo.mockClear();

    contributionServiceMock.findAll.mockClear();
  });

  describe("findAllByRepoId", () => {
    it("should return a page of contributions when repo is found", async () => {
      const mockId = faker.number.int();
      const mockPageOptionsDto = { page: 1, limit: 10 };
      const mockItem = { id: mockId };
      const mockContributions = [{ id: 1 }, { id: 2 }];

      repoServiceMock.findOneById.mockResolvedValue(mockItem);
      contributionServiceMock.findAll.mockResolvedValue(mockContributions);

      const result = await controller.findAllByRepoId(mockId, mockPageOptionsDto as ContributionPageOptionsDto);

      expect(repoServiceMock.findOneById).toHaveBeenCalledWith(mockId);
      expect(contributionServiceMock.findAll).toHaveBeenCalledWith(mockPageOptionsDto, mockItem.id);
      expect(result).toEqual(mockContributions);
    });
  });

  describe("findAllByOwnerAndRepo", () => {
    it("should return a page of contributions when repo is found", async () => {
      const mockOwner = faker.string.sample();
      const mockRepo = faker.string.sample();
      const mockPageOptionsDto = { page: 1, limit: 10 };
      const mockItem = { id: faker.number.int() };
      const mockContributions = [{ id: 1 }, { id: 2 }];

      repoServiceMock.findOneByOwnerAndRepo.mockResolvedValue(mockItem);
      contributionServiceMock.findAll.mockResolvedValue(mockContributions);

      const result = await controller.findAllByOwnerAndRepo(
        mockOwner,
        mockRepo,
        mockPageOptionsDto as ContributionPageOptionsDto
      );

      expect(repoServiceMock.findOneByOwnerAndRepo).toHaveBeenCalledWith(mockOwner, mockRepo);
      expect(contributionServiceMock.findAll).toHaveBeenCalledWith(mockPageOptionsDto, mockItem.id);
      expect(result).toEqual(mockContributions);
    });
  });
});
