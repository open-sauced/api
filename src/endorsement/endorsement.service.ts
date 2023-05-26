import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CreateEndorsementDto } from "./dto/create-endorsement.dto";
import { DbEndorsement } from "./entities/endorsement.entity";

import { PageOptionsDto } from "../common/dtos/page-options.dto";
import { PageMetaDto } from "../common/dtos/page-meta.dto";
import { PageDto } from "../common/dtos/page.dto";

@Injectable()
export class EndorsementService {
  constructor (
    @InjectRepository(DbEndorsement, "ApiConnection")
    private endorsementRepository: Repository<DbEndorsement>,
  ) {}

  baseQueryBuilder () {
    return this.endorsementRepository.createQueryBuilder("endorsements");
  }

  async create (createEndorsementDto: CreateEndorsementDto) {
    return this.endorsementRepository.save(createEndorsementDto);
  }

  async findAll (pageOptionsDto: PageOptionsDto) {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .orderBy("endorsements.updated_at", "DESC");

    queryBuilder
      .offset(pageOptionsDto.skip)
      .limit(pageOptionsDto.limit);

    const itemCount = await queryBuilder.getCount();
    const entities = await queryBuilder.getMany();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async findAllByCreatorUserId (userId: number, pageOptionsDto: PageOptionsDto) {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .where("endorsements.creator_user_id = :userId", { userId })
      .orderBy("endorsements.updated_at", "DESC");

    queryBuilder
      .offset(pageOptionsDto.skip)
      .limit(pageOptionsDto.limit);

    const itemCount = await queryBuilder.getCount();
    const entities = await queryBuilder.getMany();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async findAllByRecipientUserId (userId: number, pageOptionsDto: PageOptionsDto) {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .where("endorsements.recipient_user_id = :userId", { userId })
      .orderBy("endorsements.updated_at", "DESC");

    queryBuilder
      .offset(pageOptionsDto.skip)
      .limit(pageOptionsDto.limit);

    const itemCount = await queryBuilder.getCount();
    const entities = await queryBuilder.getMany();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async findAllByRepoOwnerOrUser (repoOwnerOrUser: string, pageOptionsDto: PageOptionsDto) {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .innerJoin("repos", "repos", "endorsements.repo_id=repos.id")
      .leftJoin("users", "users", "endorsements.recipient_user_id=users.id")
      .where("LOWER(repos.full_name) LIKE ':ownerOrUser/%'", { ownerOrUser: repoOwnerOrUser.toLowerCase() })
      .orWhere("LOWER(users.login) = :user", { user: repoOwnerOrUser.toLowerCase() })
      .orderBy("endorsements.updated_at", "DESC");

    queryBuilder
      .offset(pageOptionsDto.skip)
      .limit(pageOptionsDto.limit);

    const itemCount = await queryBuilder.getCount();
    const entities = await queryBuilder.getMany();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async findAllEndorsementsByRepo (owner: string, repo: string, pageOptionsDto: PageOptionsDto) {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .innerJoin("repos", "repos", "endorsements.repo_id=repos.id")
      .where("LOWER(repos.full_name) = :repo", { repo: `${owner}/${repo}`.toLowerCase() })
      .orderBy("endorsements.updated_at", "DESC");

    queryBuilder
      .offset(pageOptionsDto.skip)
      .limit(pageOptionsDto.limit);

    const itemCount = await queryBuilder.getCount();
    const entities = await queryBuilder.getMany();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async findAllEndorsementsByRepoByUser (owner: string, repo: string, pageOptionsDto: PageOptionsDto) {
    const queryBuilder = this.endorsementRepository.manager.createQueryBuilder();

    queryBuilder
      .from(DbEndorsement, "endorsements")
      .innerJoin("repos", "repos", "endorsements.repo_id=repos.id")
      .leftJoin("users", "users", "endorsements.repo_id=users.id")
      .select("users.login")
      .addSelect("", "endorsements")
      .where("LOWER(repos.full_name) = :repo", { repo: `${owner}/${repo}`.toLowerCase() })
      .groupBy("users.login")
      .orderBy("endorsements.updated_at", "DESC");

    queryBuilder
      .offset(pageOptionsDto.skip)
      .limit(pageOptionsDto.limit);

    const itemCount = await queryBuilder.getCount();
    const entities = await queryBuilder.getMany();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async findOneById (id: string) {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .where("endorsements.id = :id", { id });

    const item = await queryBuilder.getOne();

    if (!item) {
      throw (new NotFoundException);
    }

    return item;
  }

  async remove (id: string) {
    await this.endorsementRepository.softDelete(id);
  }
}
