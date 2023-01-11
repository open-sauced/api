import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { DbInsightRepo } from "./entities/insight-repo.entity";
import { RepoInfo } from "../repo/dtos/repo-info.dto";

@Injectable()
export class InsightRepoService {
  constructor (
    @InjectRepository(DbInsightRepo)
    private insightRepoRepository: Repository<DbInsightRepo>,
  ) {}

  async addInsightRepo (insightId: number, repo: RepoInfo) {
    return this.insightRepoRepository.save({ insight_id: insightId, repo_id: repo.id, full_name: repo.fullName });
  }

  async removeInsightRepo (id: number) {
    return this.insightRepoRepository.softDelete(id);
  }
}
