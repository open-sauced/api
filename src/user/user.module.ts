import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { PullRequestModule } from "../pull-requests/pull-request.module";

import { DbUser } from "./user.entity";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DbUser,
    ], "ApiConnection"),
    PullRequestModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserController],
  exports: [UserService],
})
export class UserModule {}
