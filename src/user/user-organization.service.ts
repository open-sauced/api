import { Injectable } from "@nestjs/common";
import { Repository, SelectQueryBuilder } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { PageMetaDto } from "../common/dtos/page-meta.dto";
import { PageDto } from "../common/dtos/page.dto";
import { PageOptionsDto } from "../common/dtos/page-options.dto";
import { DbUserOrganization } from "./entities/user-organization.entity";

@Injectable()
export class UserOrganizationService {
  constructor(
    @InjectRepository(DbUserOrganization, "ApiConnection")
    private userOrganizationRepository: Repository<DbUserOrganization>
  ) {}

  baseQueryBuilder(): SelectQueryBuilder<DbUserOrganization> {
    const builder = this.userOrganizationRepository.createQueryBuilder("user_organizations");

    return builder;
  }

  async findAllByUserId(userId: number, pageOptionsDto: PageOptionsDto) {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .innerJoinAndSelect("user_organizations.user", "user")
      .innerJoinAndSelect("user_organizations.organization_user", "organization_user")
      .where("user_id = :userId", { userId })
      .orderBy("user_organizations.created_at", "DESC");

    queryBuilder.offset(pageOptionsDto.skip).limit(pageOptionsDto.limit);

    const entities = await queryBuilder.getMany();
    const itemCount = await queryBuilder.getCount();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }
}
