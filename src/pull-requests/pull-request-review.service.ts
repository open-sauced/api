import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DbPullRequestReview } from "./entities/pull-request-review.entity";

@Injectable()
export class PullRequestReviewService {
  constructor(
    @InjectRepository(DbPullRequestReview, "ApiConnection")
    private pullRequestReviewRepository: Repository<DbPullRequestReview>
  ) {}

  async findAllReviewsByPrId(PrId: number): Promise<DbPullRequestReview[]> {
    return this.pullRequestReviewRepository.find({
      where: { pullRequest: { id: PrId } },
    });
  }
}
