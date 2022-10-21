import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DbUserRepo } from "./user-repo.entity";
import { UserReposController } from "./user-repos.controller";
import { UserReposService } from "./user-repos.service";

@Module({
  controllers: [UserReposController],
  imports: [
    TypeOrmModule.forFeature([
      DbUserRepo,
    ]),
  ],
  providers: [UserReposService],
  exports: [UserReposService],
})
export class UserReposModule {}
