import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DbUser } from "./user.entity";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DbUser,
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, UserController],
  exports: [UserService],
})
export class UserModule {}
