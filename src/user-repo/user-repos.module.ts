import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ApiServicesModule } from "../common/services/api-services.module";
import { DbUserRepo } from "./user-repo.entity";
import { UserReposService } from "./user-repos.service";

@Module({
  imports: [TypeOrmModule.forFeature([DbUserRepo], "ApiConnection"), ApiServicesModule],
  providers: [UserReposService],
  exports: [UserReposService],
})
export class UserReposModule {}
