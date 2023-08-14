import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HttpModule } from "@nestjs/axios";

import { ApiServicesModule } from "../common/services/api-services.module";
import { PizzaOvenService } from "./pizza-oven.service";
import { PizzaOvenController } from "./pizza-oven.controller";
import { DbBakedRepo } from "./entities/baked-repo.entity";
import { DbCommitAuthors } from "./entities/commit_authors.entity";
import { DbCommits } from "./entities/commits.entity";
import { CommitAuthorsService } from "./commit-authors.service";
import { CommitsService } from "./commits.service";

@Module({
  imports: [
    ApiServicesModule,
    HttpModule,
    TypeOrmModule.forFeature([DbBakedRepo, DbCommitAuthors, DbCommits], "ApiConnection"),
  ],
  controllers: [PizzaOvenController],
  providers: [PizzaOvenService, CommitAuthorsService, CommitsService],
  exports: [PizzaOvenService, CommitAuthorsService, CommitsService],
})
export class PizzaOvenModule {}
