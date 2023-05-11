import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { PullRequestModule } from "../pull-requests/pull-request.module";
import { RepoModule } from "../repo/repo.module";

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
import { DbUserTopRepo } from "./entities/user-top-repo.entity";
import { DbRepo } from "../repo/entities/repo.entity";
import { RepoService } from "../repo/repo.service";
import { RepoFilterService } from "../common/filters/repo-filter.service";
import { DbUserNotification } from "./entities/user-notification.entity";
import { UserNotificationService } from "./user-notifcation.service";
import { UserNotificationController } from "./user-notification.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DbUser,
      DbUserHighlight,
      DbUserHighlightReaction,
      DbUserToUserFollows,
      DbUserTopRepo,
      DbUserNotification,
      DbRepo,
    ], "ApiConnection"),
    PullRequestModule,
    RepoModule,
  ],
  controllers: [UserController, UserHighlightsController, UserFollowsController, UserNotificationController],
  providers: [UserService, UserController, UserHighlightsService, UserHighlightsController, UserFollowService, RepoService, RepoFilterService, UserNotificationService],
  exports: [UserService, UserHighlightsService, UserFollowService, RepoService],
})
export class UserModule {}
