import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DbUser } from "./user.entity";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { DbUserHighlight } from "./entities/user-highlight.entity";
import { UserHighlightsController } from "./user-highlight.controller";
import { UserHighlightsService } from "./user-highlights.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DbUser,
      DbUserHighlight,
    ]),
  ],
  controllers: [UserController, UserHighlightsController],
  providers: [UserService, UserController, UserHighlightsService, UserHighlightsController],
  exports: [UserService, UserHighlightsService],
})
export class UserModule {}
