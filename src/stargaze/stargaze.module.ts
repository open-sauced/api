import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DbRepo } from "../repo/entities/repo.entity";
import { DbRepoToUserStargazers } from "../repo/entities/repo.to.user.stargazers.entity";
import { StargazeService } from "./stargaze.service";
import { RepoStargazeController } from "./repo-stargaze.controller";
import { RepoModule } from "../repo/repo.module";

@Module({
  imports: [TypeOrmModule.forFeature([DbRepo, DbRepoToUserStargazers], "ApiConnection"), RepoModule],
  controllers: [RepoStargazeController],
  providers: [StargazeService],
  exports: [StargazeService],
})
export class StargazeModule {}
