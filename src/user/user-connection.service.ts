import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository, SelectQueryBuilder } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { PageDto } from "../common/dtos/page.dto";

import { PageOptionsDto } from "../common/dtos/page-options.dto";
import { PagerService } from "../common/services/pager.service";
import { DbUserConnection } from "./entities/user-connection.entity";

@Injectable()
export class UserConnectionService {
  constructor(
    @InjectRepository(DbUserConnection, "ApiConnection")
    private userConnectionRepository: Repository<DbUserConnection>,
    private pagerService: PagerService
  ) {}

  baseQueryBuilder(): SelectQueryBuilder<DbUserConnection> {
    const builder = this.userConnectionRepository.createQueryBuilder("user_connections");

    return builder;
  }

  async findOneById(id: string): Promise<DbUserConnection> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder.where("user_connections.id = :id", { id });

    const item: DbUserConnection | null = await queryBuilder.getOne();

    if (!item) {
      throw new NotFoundException();
    }

    return item;
  }

  async addUserConnection(userConnection: Partial<DbUserConnection>) {
    return this.userConnectionRepository.save(userConnection);
  }

  async updateUserConnection(id: string, userConnection: Partial<DbUserConnection>) {
    return this.userConnectionRepository.update(id, userConnection);
  }

  async removeUserConnection(id: string) {
    return this.userConnectionRepository.softDelete(id);
  }

  async findAllUserConnections(pageOptionsDto: PageOptionsDto, userId: number): Promise<PageDto<DbUserConnection>> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .innerJoinAndSelect("user_connections.user", "user")
      .innerJoinAndSelect("user_connections.request_user", "request_user")
      .where("user_connections.user_id = :userId", { userId })
      .orderBy("user_connections.updated_at", "DESC");

    return this.pagerService.applyPagination<DbUserConnection>({
      pageOptionsDto,
      queryBuilder,
    });
  }
}
