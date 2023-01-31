import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { DbInsightRepo } from "./entities/insight-repo.entity";

@Injectable()
export class InsightRepoService {
  constructor (
    @InjectRepository(DbInsightRepo, "ApiConnection")
    private insightRepoRepository: Repository<DbInsightRepo>,
  ) {}

  async addInsightRepo (insightId: number, repoId: number) {
    return this.insightRepoRepository.save({ insight_id: insightId, repo_id: repoId });
  }

  async removeInsightRepo (id: number) {
    return this.insightRepoRepository.softDelete(id);
  }
}
