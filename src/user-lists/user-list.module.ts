import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DbWorkspaceUserLists } from "../workspace/entities/workspace-user-list.entity";
import { ApiServicesModule } from "../common/services/api-services.module";
import { DbUser } from "../user/user.entity";
import { DbUserHighlight } from "../user/entities/user-highlight.entity";
import { DbPullRequestGitHubEvents } from "../timescale/entities/pull_request_github_event.entity";
import { WorkspaceModule } from "../workspace/workspace.module";
import { UserModule } from "../user/user.module";
import { TimescaleModule } from "../timescale/timescale.module";
import { DbUserListContributor } from "./entities/user-list-contributor.entity";
import { DbUserList } from "./entities/user-list.entity";
import { UserListService } from "./user-list.service";
import { UserListController } from "./user-list.controller";
import { UserListStatsController } from "./user-list-stats.controller";
import { DbContributionStatTimeframe } from "./entities/contributions-timeframe.entity";
import { DbContributorCategoryTimeframe } from "./entities/contributors-timeframe.entity";
import { UserListEventsStatsService } from "./user-list-events-stats.service";

@Module({
  imports: [
    forwardRef(() => TimescaleModule),
    forwardRef(() => UserModule),
    ApiServicesModule,
    forwardRef(() => WorkspaceModule),
    TypeOrmModule.forFeature(
      [
        DbUser,
        DbUserList,
        DbUserHighlight,
        DbUserListContributor,
        DbContributionStatTimeframe,
        DbContributorCategoryTimeframe,
        DbWorkspaceUserLists,
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
