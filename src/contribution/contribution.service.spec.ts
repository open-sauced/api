import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { faker } from "@faker-js/faker";
import { PageDto } from "../common/dtos/page.dto";
import { OrderDirectionEnum } from "../common/constants/order-direction.constant";
import { PageMetaDto } from "../common/dtos/page-meta.dto";
import { ContributionService } from "./contribution.service";
import { DbContribution } from "./contribution.entity";
import { ContributionOrderFieldsEnum, ContributionPageOptionsDto } from "./dtos/contribution-page-options.dto";

describe("ContributionService", () => {
  let service: ContributionService;

  const contributionRepositoryMock = {
    createQueryBuilder: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContributionService,
        {
          provide: getRepositoryToken(DbContribution, "ApiConnection"),
          useValue: contributionRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<ContributionService>(ContributionService);
  });

  describe("findAll", () => {
    it("should return a PageDto of DbContribution entities", async () => {
      const pageOptionsDto: ContributionPageOptionsDto = {
        limit: 10,
        skip: 0,
        orderBy: ContributionOrderFieldsEnum.count,
        orderDirection: OrderDirectionEnum.ASC,
      };
      const repoId = faker.number.int();
      const itemCount = 2;
      const entities = [{ id: 1 }, { id: 2 }];
      const expectedPageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
      const expectedPageDto = new PageDto(entities, expectedPageMetaDto);

      const createQueryBuildMock = {
        where: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(itemCount),
        getMany: jest.fn().mockResolvedValue(entities),
      };

      contributionRepositoryMock.createQueryBuilder.mockReturnValue(createQueryBuildMock);

      const result = await service.findAll(pageOptionsDto, repoId);

      expect(contributionRepositoryMock.createQueryBuilder).toHaveBeenCalled();
      expect(createQueryBuildMock.where).toHaveBeenCalledWith("contribution.repo_id = :repoId", {
        repoId,
      });
      expect(createQueryBuildMock.addOrderBy).toHaveBeenCalledWith('"count"', OrderDirectionEnum.ASC);
      expect(createQueryBuildMock.offset).toHaveBeenCalledWith(pageOptionsDto.skip);
      expect(createQueryBuildMock.limit).toHaveBeenCalledWith(pageOptionsDto.limit);
      expect(createQueryBuildMock.getCount).toHaveBeenCalled();
      expect(createQueryBuildMock.getMany).toHaveBeenCalled();
      expect(result).toEqual(expectedPageDto);
    });
  });
});
