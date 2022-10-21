import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository, SelectQueryBuilder } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { PageDto } from "../common/dtos/page.dto";
import { PageMetaDto } from "../common/dtos/page-meta.dto";

import { DbUserRepo } from "./user-repo.entity";
import { UserRepoOptionsDto } from "./dtos/user-repo-options.dto";

@Injectable()
export class UserReposService {
  constructor (
    @InjectRepository(DbUserRepo)
    private userRepoRepository: Repository<DbUserRepo>,
  ) {}

  baseQueryBuilder (): SelectQueryBuilder<DbUserRepo> {
    const builder = this.userRepoRepository.createQueryBuilder("insights");

    return builder;
  }

  async findOneById (id: number): Promise<DbUserRepo> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder.where("id = :id", { id });

    let item: DbUserRepo | null;

    try {
      item = await queryBuilder.getOne();
    } catch (e) {
      // handle error
      item = null;
    }

    if (!item) {
      throw (new NotFoundException);
    }

    return item;
  }

  async addUserRepo (userId: number, repoId: number) {
    const newUserRepo = this.userRepoRepository.create({
      user_id: userId,
      repo_id: repoId,
    });

    return this.userRepoRepository.save(newUserRepo);
  }

  async findAllByUserId (
    pageOptionsDto: UserRepoOptionsDto,
    userId: string,
  ): Promise<PageDto<DbUserRepo>> {
    const queryBuilder = this.userRepoRepository.createQueryBuilder("user_repos");

    queryBuilder
      .where("user_repos.user_id = :userId", { userId });

    queryBuilder
      .offset(pageOptionsDto.skip)
      .limit(pageOptionsDto.limit);

    const itemCount = await queryBuilder.getCount();
    const entities = await queryBuilder.getMany();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }
}
