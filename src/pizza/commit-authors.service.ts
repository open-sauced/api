import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { PageOptionsDto } from "../common/dtos/page-options.dto";
import { PageDto } from "../common/dtos/page.dto";
import { PagerService } from "../common/services/pager.service";
import { DbCommitAuthors } from "./entities/commit_authors.entity";

@Injectable()
export class CommitAuthorsService {
  constructor(
    @InjectRepository(DbCommitAuthors, "ApiConnection")
    private commitAuthorsRepository: Repository<DbCommitAuthors>,
    private pagerService: PagerService
  ) {}

  baseQueryBuilder() {
    const builder = this.commitAuthorsRepository.createQueryBuilder("commit_authors");

    return builder;
  }

  async findAllCommitAuthors(pageOptionsDto: PageOptionsDto): Promise<PageDto<DbCommitAuthors>> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder.offset(pageOptionsDto.skip).limit(pageOptionsDto.limit);

    return this.pagerService.applyPagination<DbCommitAuthors>({
      pageOptionsDto,
      queryBuilder,
    });
  }

  async findCommitAuthorById(id: number): Promise<DbCommitAuthors> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder.where("id = :id", { id });

    const item = await queryBuilder.getOne();

    if (!item) {
      throw new NotFoundException();
    }

    return item;
  }
}
