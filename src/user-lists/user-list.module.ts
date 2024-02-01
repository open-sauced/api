import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ApiServicesModule } from "../common/services/api-services.module";
import { DbUser } from "../user/user.entity";
import { DbPullRequest } from "../pull-requests/entities/pull-request.entity";
import { DbUserHighlight } from "../user/entities/user-highlight.entity";
import { DbPullRequestGitHubEvents } from "../timescale/entities/pull_request_github_event";
import { DbUserListContributor } from "./entities/user-list-contributor.entity";
import { DbUserList } from "./entities/user-list.entity";
import { UserListService } from "./user-list.service";
import { UserListController } from "./user-list.controller";
import { UserListStatsController } from "./user-list-stats.controller";
import { DbUserListContributorStat } from "./entities/user-list-contributor-stats.entity";
import { DbContributionStatTimeframe } from "./entities/contributions-timeframe.entity";
import { DbContributorCategoryTimeframe } from "./entities/contributors-timeframe.entity";
import { UserListEventsStatsService } from "./user-list-events-stats.service";

@Module({
  imports: [
    ApiServicesModule,
    TypeOrmModule.forFeature(
      [
        DbUser,
        DbUserList,
        DbUserHighlight,
        DbPullRequest,
        DbUserListContributor,
        DbUserListContributorStat,
        DbContributionStatTimeframe,
        DbContributorCategoryTimeframe,
      ],
      "ApiConnection"
    ),
    TypeOrmModule.forFeature([DbPullRequestGitHubEvents], "TimescaleConnection"),
  ],
  controllers: [UserListController, UserListStatsController],
  providers: [UserListService, UserListEventsStatsService],
  exports: [UserListService, UserListEventsStatsService],
})
export class UserListModule {}
