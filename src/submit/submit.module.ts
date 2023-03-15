import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DbRepo } from "../repo/entities/repo.entity";
import { DbRepoToUserSubmissions } from "../repo/entities/repo.to.user.submissions.entity";
import { RepoService } from "../repo/repo.service";
import { SubmitService } from "./submit.service";
import { RepoSubmitController } from "./repo-submit.controller";

@Module({
  imports: [TypeOrmModule.forFeature([
    DbRepo,
    DbRepoToUserSubmissions,
  ], "ApiConnection")],
  controllers: [RepoSubmitController],
  providers: [RepoService, SubmitService],
  exports: [SubmitService],
})
export class SubmitModule {}
