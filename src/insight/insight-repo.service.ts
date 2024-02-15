import { BadRequestException, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { RepoInfo } from "../repo/dtos/repo-info.dto";
import { PizzaOvenService } from "../pizza/pizza-oven.service";
import { BakeRepoDto } from "../pizza/dtos/baked-repo.dto";
import { RepoService } from "../repo/repo.service";
import { DbInsightRepo } from "./entities/insight-repo.entity";

@Injectable()
export class InsightRepoService {
  constructor(
    @InjectRepository(DbInsightRepo, "ApiConnection")
    private insightRepoRepository: Repository<DbInsightRepo>,
    private pizzaOvenService: PizzaOvenService,
    private repoService: RepoService
  ) {}

  async addInsightRepo(insightId: number, repoInfo: RepoInfo) {
    if (!repoInfo.id && !repoInfo.fullName) {
      throw new BadRequestException("either repo id or repo full name must be provided");
    }

    // when individual insight pages are fetched, go bake their repos to get fresh commit data
    if (repoInfo.fullName) {
      const bakeRepoInfo: BakeRepoDto = {
        url: `https://github.com/${repoInfo.fullName}`,
        wait: false,
      };

      try {
        await this.pizzaOvenService.postToPizzaOvenService(bakeRepoInfo);
      } catch (e: unknown) {
        if (e instanceof Error) {
          console.error(`error posting to pizza-oven service for repo ${bakeRepoInfo.url}: ${e.message}`);
        }
      }
    }

    let org = "";
    let name = "";

    if (repoInfo.fullName) {
      const parts = repoInfo.fullName.split("/");

      if (parts.length !== 2) {
        throw new BadRequestException("given repo full name is not valid owner/name repo");
      }

      [org, name] = parts;
    }

    const repo = await this.repoService.tryFindRepoOrMakeStub(repoInfo.id, org, name);

    return this.insightRepoRepository.save({
      insight_id: insightId,
      repo_id: repo.id,
      full_name: repo.full_name,
    });
  }

  async findReposById(insightId: number) {
    return this.insightRepoRepository.find({ where: { insight_id: insightId } });
  }

  async removeInsightRepo(id: number) {
    return this.insightRepoRepository.softDelete(id);
  }
}
