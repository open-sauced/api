import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { lastValueFrom, map } from "rxjs";
import { HttpService } from "@nestjs/axios";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";

import { PageOptionsDto } from "../common/dtos/page-options.dto";
import { PageDto } from "../common/dtos/page.dto";
import { PagerService } from "../common/services/pager.service";
import { BakeRepoDto } from "./dtos/baked-repo.dto";
import { DbBakedRepo } from "./entities/baked-repo.entity";

@Injectable()
export class PizzaOvenService {
  constructor(
    @InjectRepository(DbBakedRepo, "ApiConnection")
    private bakedRepoRepository: Repository<DbBakedRepo>,
    private readonly httpService: HttpService,
    private configService: ConfigService,
    private pagerService: PagerService
  ) {}

  baseQueryBuilder() {
    const builder = this.bakedRepoRepository.createQueryBuilder("baked_repos");

    return builder;
  }

  async postToPizzaOvenService(bakeRepoInfo: BakeRepoDto): Promise<number> {
    const data = {
      url: bakeRepoInfo.url,
      wait: bakeRepoInfo.wait,
    };

    const host: string = this.configService.get("pizza.host")!;
    const port: string = this.configService.get("pizza.port")!;

    return lastValueFrom(this.httpService.post(`${host}:${port}/bake`, data).pipe(map((resp) => resp.status)));
  }

  async findBakedRepoById(id: number): Promise<DbBakedRepo> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder.where("id = :id", { id });

    const item = await queryBuilder.getOne();

    if (!item) {
      throw new NotFoundException();
    }

    return item;
  }

  async findAllBakedRepos(pageOptionsDto: PageOptionsDto): Promise<PageDto<DbBakedRepo>> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder.offset(pageOptionsDto.skip).limit(pageOptionsDto.limit);

    return this.pagerService.applyPagination<DbBakedRepo>({
      pageOptionsDto,
      queryBuilder,
    });
  }
}
