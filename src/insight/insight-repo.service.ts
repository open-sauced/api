import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { RepoInfo } from "../repo/dtos/repo-info.dto";
import { PizzaOvenService } from "../pizza/pizza-oven.service";
import { BakeRepoDto } from "../pizza/dtos/baked-repo.dto";
import { DbInsightRepo } from "./entities/insight-repo.entity";

@Injectable()
export class InsightRepoService {
  constructor(
    @InjectRepository(DbInsightRepo, "ApiConnection")
    private insightRepoRepository: Repository<DbInsightRepo>,
    private pizzaOvenService: PizzaOvenService
  ) {}

  async addInsightRepo(insightId: number, repo: RepoInfo) {
    // when individual insight pages are fetched, go bake their repos to get fresh commit data
    const bakeRepoInfo: BakeRepoDto = {
      url: `https://github.com/${repo.fullName}`,
      wait: false,
    };

    await this.pizzaOvenService.postToPizzaOvenService(bakeRepoInfo);

    return this.insightRepoRepository.save({ insight_id: insightId, repo_id: repo.id, full_name: repo.fullName });
  }

  async removeInsightRepo(id: number) {
    return this.insightRepoRepository.softDelete(id);
  }
}
