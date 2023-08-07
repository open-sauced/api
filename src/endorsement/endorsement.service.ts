import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { PageOptionsDto } from "../common/dtos/page-options.dto";
import { PagerService } from "../common/services/pager.service";
import { CreateEndorsementDto } from "./dto/create-endorsement.dto";
import { DbEndorsement } from "./entities/endorsement.entity";

@Injectable()
export class EndorsementService {
  constructor(
    @InjectRepository(DbEndorsement, "ApiConnection")
    private endorsementRepository: Repository<DbEndorsement>,
    private pagerService: PagerService
  ) {}

  baseQueryBuilder() {
    return this.endorsementRepository.createQueryBuilder("endorsements");
  }

  async create(createEndorsementDto: CreateEndorsementDto) {
    return this.endorsementRepository.save(createEndorsementDto);
  }

  async findAll(pageOptionsDto: PageOptionsDto) {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder.orderBy("endorsements.created_at", "DESC");

    return this.pagerService.applyPagination<DbEndorsement>({
      pageOptionsDto,
      queryBuilder,
    });
  }

  async findAllByCreatorUserId(userId: number, pageOptionsDto: PageOptionsDto) {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder.where("endorsements.creator_user_id = :userId", { userId }).orderBy("endorsements.created_at", "DESC");

    return this.pagerService.applyPagination<DbEndorsement>({
      pageOptionsDto,
      queryBuilder,
    });
  }

  async findAllByRecipientUserId(userId: number, pageOptionsDto: PageOptionsDto) {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .where("endorsements.recipient_user_id = :userId", { userId })
      .orderBy("endorsements.created_at", "DESC");

    return this.pagerService.applyPagination<DbEndorsement>({
      pageOptionsDto,
      queryBuilder,
    });
  }

  async findAllByRepoOwnerOrUser(repoOwnerOrUser: string, pageOptionsDto: PageOptionsDto) {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .innerJoin("repos", "repos", "endorsements.repo_id=repos.id")
      .leftJoin("users", "users", "endorsements.recipient_user_id=users.id")
      .where("LOWER(repos.full_name) LIKE ':ownerOrUser/%'", { ownerOrUser: repoOwnerOrUser.toLowerCase() })
      .orWhere("LOWER(users.login) = :user", { user: repoOwnerOrUser.toLowerCase() })
      .orderBy("endorsements.created_at", "DESC");

    return this.pagerService.applyPagination<DbEndorsement>({
      pageOptionsDto,
      queryBuilder,
    });
  }

  async findAllEndorsementsByRepo(owner: string, repo: string, pageOptionsDto: PageOptionsDto) {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .innerJoin("repos", "repos", "endorsements.repo_id=repos.id")
      .where("LOWER(repos.full_name) = :repo", { repo: `${owner}/${repo}`.toLowerCase() })
      .orderBy("endorsements.created_at", "DESC");

    return this.pagerService.applyPagination<DbEndorsement>({
      pageOptionsDto,
      queryBuilder,
    });
  }

  async findAllEndorsementsByRepoByUser(owner: string, repo: string, pageOptionsDto: PageOptionsDto) {
    const queryBuilder = this.endorsementRepository.manager.createQueryBuilder();

    queryBuilder
      .from(DbEndorsement, "endorsements")
      .innerJoin("repos", "repos", "endorsements.repo_id=repos.id")
      .leftJoin("users", "users", "endorsements.repo_id=users.id")
      .select("users.login")
      .addSelect("", "endorsements")
      .where("LOWER(repos.full_name) = :repo", { repo: `${owner}/${repo}`.toLowerCase() })
      .groupBy("users.login")
      .orderBy("endorsements.created_at", "DESC");

    return this.pagerService.applyPagination<DbEndorsement>({
      pageOptionsDto,
      queryBuilder,
    });
  }

  async findOneById(id: string) {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder.where("endorsements.id = :id", { id });

    const item = await queryBuilder.getOne();

    if (!item) {
      throw new NotFoundException();
    }

    return item;
  }

  async remove(id: string) {
    await this.endorsementRepository.softDelete(id);
  }
}
