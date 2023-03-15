import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DbUserRepo } from "./user-repo.entity";
import { UserReposService } from "./user-repos.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DbUserRepo,
    ], "ApiConnection"),
  ],
  providers: [UserReposService],
  exports: [UserReposService],
})
export class UserReposModule {}
