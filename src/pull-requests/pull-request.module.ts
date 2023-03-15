import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { RepoFilterModule } from "../common/filters/repo-filter.module";
import { DbPullRequest } from "./entities/pull-request.entity";
import { PullRequestController } from "./pull-request.controller";
import { PullRequestService } from "./pull-request.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DbPullRequest,
    ], "ApiConnection"),
    RepoFilterModule,
  ],
  controllers: [PullRequestController],
  providers: [PullRequestService],
  exports: [PullRequestService],
})
export class PullRequestModule {}
