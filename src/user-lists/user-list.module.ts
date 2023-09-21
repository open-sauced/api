import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserModule } from "../user/user.module";
import { ApiServicesModule } from "../common/services/api-services.module";
import { DbUser } from "../user/user.entity";
import { DbPullRequest } from "../pull-requests/entities/pull-request.entity";
import { DbUserListContributor } from "./entities/user-list-contributor.entity";
import { DbUserList } from "./entities/user-list.entity";
import { UserListService } from "./user-list.service";
import { UserListController } from "./user-list.controller";
import { UserListStatsService } from "./user-list-stat.service";
import { UserListStatsController } from "./user-list-stats.controller";
import { DbUserListContributorStat } from "./entities/user-list-contributor-stats.entity";

@Module({
  imports: [
    ApiServicesModule,
    UserModule,
    TypeOrmModule.forFeature(
      [DbUser, DbUserList, DbPullRequest, DbUserListContributor, DbUserListContributorStat],
      "ApiConnection"
    ),
  ],
  controllers: [UserListController, UserListStatsController],
  providers: [UserListService, UserListStatsService],
  exports: [UserListService, UserListStatsService],
})
export class UserListModule {}
