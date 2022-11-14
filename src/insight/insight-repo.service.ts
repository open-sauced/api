import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { DbInsightRepo } from "./entities/insight-repo.entity";

@Injectable()
export class InsightRepoService {
  constructor (
    @InjectRepository(DbInsightRepo)
    private insightRepoRepository: Repository<DbInsightRepo>,
  ) {}

  async addInsightRepo (insightId: number, repoId: number) {
    const newInsightRepo = this.insightRepoRepository.create({ insight_id: insightId, repo_id: repoId });

    await newInsightRepo.save();

    return newInsightRepo;
  }
}
