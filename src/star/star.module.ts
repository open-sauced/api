import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DbRepo } from "../repo/entities/repo.entity";
import { DbRepoToUserStars } from "../repo/entities/repo.to.user.stars.entity";
import { RepoModule } from "../repo/repo.module";
import { StarService } from "./star.service";
import { RepoStarController } from "./repo-star.controller";

@Module({
  imports: [TypeOrmModule.forFeature([DbRepo, DbRepoToUserStars], "ApiConnection"), RepoModule],
  controllers: [RepoStarController],
  providers: [StarService],
  exports: [StarService],
})
export class StarModule {}
