import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { DbPullRequest } from "./entities/pull-request.entity";
import { PageMetaDto } from "../common/dtos/page-meta.dto";
import { PageDto } from "../common/dtos/page.dto";
import { OrderDirectionEnum } from "../common/constants/order-direction.constant";
import { PageOptionsDto } from "../common/dtos/page-options.dto";

@Injectable()
export class PullRequestService {
  constructor (
    @InjectRepository(DbPullRequest, "ApiConnection")
    private pullRequestRepository: Repository<DbPullRequest>,
  ) {}

  baseQueryBuilder () {
    const builder = this.pullRequestRepository.createQueryBuilder("pr");

    return builder;
  }

  async findAll (
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<DbPullRequest>> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .addOrderBy(`"pr"."updated_at"`, OrderDirectionEnum.DESC)
      .offset(pageOptionsDto.skip)
      .limit(pageOptionsDto.limit);

    const itemCount = await queryBuilder.getCount();
    const entities = await queryBuilder.getMany();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }
}
