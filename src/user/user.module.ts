import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { PullRequestModule } from "../pull-requests/pull-request.module";

import { DbUser } from "./user.entity";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { DbUserHighlight } from "./entities/user-highlight.entity";
import { UserHighlightsController } from "./user-highlight.controller";
import { UserHighlightsService } from "./user-highlights.service";
import { UserFollowsController } from "./user-follow.controller";
import { UserFollowService } from "./user-follow.service";
import { DbUserToUserFollows } from "./entities/user-follows.entity";
import { DbUserHighlightReaction } from "./entities/user-highlight-reaction.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DbUser,
      DbUserHighlight,
      DbUserHighlightReaction,
      DbUserToUserFollows,
    ], "ApiConnection"),
    PullRequestModule,
  ],
  controllers: [UserController, UserHighlightsController, UserFollowsController],
  providers: [UserService, UserController, UserHighlightsService, UserHighlightsController, UserFollowService],
  exports: [UserService, UserHighlightsService, UserFollowService],
})
export class UserModule {}
