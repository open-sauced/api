import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserModule } from "../user/user.module";
import { ApiServicesModule } from "../common/services/api-services.module";
import { DbUser } from "../user/user.entity";
import { DbUserListContributor } from "./entities/user-list-contributor.entity";
import { DbUserList } from "./entities/user-list.entity";
import { UserListService } from "./user-list.service";
import { UserListController } from "./user-list.controller";

@Module({
  imports: [
    ApiServicesModule,
    UserModule,
    TypeOrmModule.forFeature([DbUser, DbUserList, DbUserListContributor], "ApiConnection"),
  ],
  controllers: [UserListController],
  providers: [UserListService],
  exports: [UserListService],
})
export class UserListModule {}
