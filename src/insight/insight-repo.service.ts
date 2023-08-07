import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { RepoInfo } from "../repo/dtos/repo-info.dto";
import { DbInsightRepo } from "./entities/insight-repo.entity";

@Injectable()
export class InsightRepoService {
  constructor(
    @InjectRepository(DbInsightRepo, "ApiConnection")
    private insightRepoRepository: Repository<DbInsightRepo>
  ) {}

  async addInsightRepo(insightId: number, repo: RepoInfo) {
    return this.insightRepoRepository.save({ insight_id: insightId, repo_id: repo.id, full_name: repo.fullName });
  }

  async removeInsightRepo(id: number) {
    return this.insightRepoRepository.softDelete(id);
  }
}
