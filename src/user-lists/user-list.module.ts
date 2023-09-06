import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ApiServicesModule } from "../common/services/api-services.module";
import { DbUserListContributor } from "./entities/user-list-contributor.entity";
import { DbUserList } from "./entities/user-list.entity";
import { UserListService } from "./user-list.service";
import { UserListController } from "./user-list.controller";

@Module({
  imports: [TypeOrmModule.forFeature([DbUserList, DbUserListContributor], "ApiConnection"), ApiServicesModule],
  controllers: [UserListController],
  providers: [UserListService],
  exports: [UserListService],
})
export class UserListModule {}
