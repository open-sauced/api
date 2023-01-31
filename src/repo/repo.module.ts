import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DbRepo } from "./entities/repo.entity";
import { RepoService } from "./repo.service";
import { RepoController } from "./repo.controller";

@Module({
  imports: [TypeOrmModule.forFeature([DbRepo], "ApiConnection")],
  controllers: [RepoController],
  providers: [RepoService],
  exports: [RepoService],
})
export class RepoModule {}
