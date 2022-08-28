import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Repo } from "../repo/entities/repo.entity";
import { RepoToUserStargazers } from "../repo/entities/repo.to.user.stargazers.entity";
import { RepoService } from "../repo/repo.service";
import { StargazeService } from "./stargaze.service";
import { RepoStargazeController } from "./repo-stargaze.controller";

@Module({
  imports: [TypeOrmModule.forFeature([
    Repo,
    RepoToUserStargazers
  ])],
  controllers: [RepoStargazeController],
  providers: [RepoService, StargazeService],
  exports: [StargazeService],
})
export class StargazeModule {}
