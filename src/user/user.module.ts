import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DbUser } from "./user.entity";
import { UserService } from "./user.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DbUser,
    ]),
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
