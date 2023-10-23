import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { GetPrevDateISOString } from "../common/util/datetimes";
import { PageDto } from "../common/dtos/page.dto";
import { OrderDirectionEnum } from "../common/constants/order-direction.constant";
import { PageMetaDto } from "../common/dtos/page-meta.dto";
import { DbUser } from "../user/user.entity";
import { DbContribution } from "./contribution.entity";
import { ContributionOrderFieldsEnum, ContributionPageOptionsDto } from "./dtos/contribution-page-options.dto";
import { DbRepoLoginContributions } from "./entities/repo-user-contributions.entity";

@Injectable()
export class ContributionService {
  constructor(
    @InjectRepository(DbContribution, "ApiConnection")
    private contributionRepository: Repository<DbContribution>,
    @InjectRepository(DbUser, "ApiConnection")
    private userRepository: Repository<DbUser>
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

  async findAllByUserLogin(
    repoId: number,
    login: string,
    range: number,
    prev_days_start_date: number
  ): Promise<DbRepoLoginContributions> {
    const queryBuilder = this.userRepository.createQueryBuilder("user");

    const startDate = GetPrevDateISOString(prev_days_start_date);

    queryBuilder
      .select("login")
      .where("login = :login", { login })
      .addSelect(
        `(
          SELECT COALESCE(SUM("pull_requests"."commits"), 0)
          FROM "pull_requests"
          WHERE "pull_requests"."author_login" = "login"
            AND "pull_requests"."repo_id" = ${repoId}
            AND '${startDate}'::TIMESTAMP >= "pull_requests"."updated_at"
            AND '${startDate}'::TIMESTAMP - INTERVAL '${range} days' <= "pull_requests"."updated_at"
        )::INTEGER`,
        "commits"
      )
      .addSelect(
        `(
          SELECT COALESCE(COUNT("pull_requests"."id"), 0)
          FROM "pull_requests"
          WHERE "pull_requests"."author_login" = "login"
            AND "pull_requests"."repo_id" = ${repoId}
            AND now() - INTERVAL '${range} days' <= "pull_requests"."updated_at"
        )::INTEGER`,
        "prs_created"
      );

    const entity: DbRepoLoginContributions | undefined = await queryBuilder.getRawOne();

    if (!entity) {
      throw new NotFoundException();
    }

    return entity;
  }
}
