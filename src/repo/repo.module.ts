import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Repo } from "./entities/repo.entity";
import { RepoService } from "./repo.service";
import { RepoController } from "./repo.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Repo])],
  controllers: [RepoController],
  providers: [RepoService],
  exports: [RepoService],
})
export class RepoModule {}
