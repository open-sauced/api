import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { PageDto } from "../common/dtos/page.dto";
import { OrderDirectionEnum } from "../common/constants/order-direction.constant";
import { PageMetaDto } from "../common/dtos/page-meta.dto";
import { DbContribution } from "./contribution.entity";
import { ContributionOrderFieldsEnum, ContributionPageOptionsDto } from "./dtos/contribution-page-options.dto";

@Injectable()
export class ContributionService {
  constructor(
    @InjectRepository(DbContribution, "ApiConnection")
    private contributionRepository: Repository<DbContribution>
  ) {}

  async findAll(pageOptionsDto: ContributionPageOptionsDto, repoId?: number): Promise<PageDto<DbContribution>> {
    const queryBuilder = this.contributionRepository.createQueryBuilder("contribution");
    const orderField = pageOptionsDto.orderBy ?? ContributionOrderFieldsEnum.count;

    if (repoId) {
      queryBuilder.where("contribution.repo_id = :repoId", { repoId });
    }

    queryBuilder
      .addOrderBy(`"${orderField}"`, pageOptionsDto.orderDirection)
      .addOrderBy(`"contribution"."created_at"`, OrderDirectionEnum.DESC)
      .offset(pageOptionsDto.skip)
      .limit(pageOptionsDto.limit);

    const itemCount = await queryBuilder.getCount();
    const entities = await queryBuilder.getMany();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }
}
