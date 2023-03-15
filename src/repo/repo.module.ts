import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DbRepo } from "./entities/repo.entity";
import { RepoService } from "./repo.service";
import { RepoController } from "./repo.controller";
import { RepoFilterModule } from "../common/filters/repo-filter.module";

@Module({
  imports: [TypeOrmModule.forFeature([DbRepo], "ApiConnection"), RepoFilterModule],
  controllers: [RepoController],
  providers: [RepoService],
  exports: [RepoService],
})
export class RepoModule {}
