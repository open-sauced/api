import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { PageOptionsDto } from "../common/dtos/page-options.dto";
import { PageDto } from "../common/dtos/page.dto";
import { PagerService } from "../common/services/pager.service";
import { DbCommits } from "./entities/commits.entity";

@Injectable()
export class CommitsService {
  constructor(
    @InjectRepository(DbCommits, "ApiConnection")
    private commitsRepository: Repository<DbCommits>,
    private pagerService: PagerService
  ) {}

  baseQueryBuilder() {
    const builder = this.commitsRepository.createQueryBuilder("commits");

    return builder;
  }

  async findAllCommitsByBakedRepoId(pageOptionsDto: PageOptionsDto, id: number): Promise<PageDto<DbCommits>> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder.where("baked_repo_id = :id", { id });

    queryBuilder.offset(pageOptionsDto.skip).limit(pageOptionsDto.limit);

    return this.pagerService.applyPagination<DbCommits>({
      pageOptionsDto,
      queryBuilder,
    });
  }

  async findAllCommitsByCommitAuthorId(pageOptionsDto: PageOptionsDto, id: number): Promise<PageDto<DbCommits>> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder.where("commit_author_id = :id", { id });

    queryBuilder.offset(pageOptionsDto.skip).limit(pageOptionsDto.limit);

    return this.pagerService.applyPagination<DbCommits>({
      pageOptionsDto,
      queryBuilder,
    });
  }

  async findCommitById(id: number): Promise<DbCommits> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder.where("id = :id", { id });

    const item = await queryBuilder.getOne();

    if (!item) {
      throw new NotFoundException();
    }

    return item;
  }
}
