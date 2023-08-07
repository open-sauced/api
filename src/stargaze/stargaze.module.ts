import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DbRepo } from "../repo/entities/repo.entity";
import { DbRepoToUserStargazers } from "../repo/entities/repo.to.user.stargazers.entity";
import { RepoModule } from "../repo/repo.module";
import { StargazeService } from "./stargaze.service";
import { RepoStargazeController } from "./repo-stargaze.controller";

@Module({
  imports: [TypeOrmModule.forFeature([DbRepo, DbRepoToUserStargazers], "ApiConnection"), RepoModule],
  controllers: [RepoStargazeController],
  providers: [StargazeService],
  exports: [StargazeService],
})
export class StargazeModule {}
