import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { InsightsModule } from "../insight/insights.module";
import { TimescaleModule } from "../timescale/timescale.module";
import { UserModule } from "../user/user.module";
import { ApiServicesModule } from "../common/services/api-services.module";
import { DbUser } from "../user/user.entity";
import { UserListModule } from "../user-lists/user-list.module";
import { DbUserList } from "../user-lists/entities/user-list.entity";
import { WorkspaceService } from "./workspace.service";
import { WorkspaceController } from "./workspace.controller";
import { DbWorkspace } from "./entities/workspace.entity";
import { DbWorkspaceMember } from "./entities/workspace-member.entity";
import { DbWorkspaceOrg } from "./entities/workspace-org.entity";
import { DbWorkspaceRepo } from "./entities/workspace-repos.entity";
import { DbWorkspaceInsight } from "./entities/workspace-insights.entity";
import { WorkspaceMemberController } from "./workspace-members.controller";
import { WorkspaceMembersService } from "./workspace-members.service";
import { WorkspaceOrgController } from "./workspace-orgs.controller";
import { WorkspaceOrgsService } from "./workspace-orgs.service";
import { WorkspaceRepoController } from "./workspace-repos.controller";
import { WorkspaceReposService } from "./workspace-repos.service";
import { WorkspaceContributorController } from "./workspace-contributors.controller";
import { WorkspaceContributorsService } from "./workspace-contributors.service";
import { DbWorkspaceContributor } from "./entities/workspace-contributors.entity";
import { WorkspaceStatsService } from "./workspace-stats.service";
import { WorkspaceStatsController } from "./workspace-stats.controller";
import { WorkspaceInsightsController } from "./workspace-insights.controller";
import { WorkspaceInsightsService } from "./workspace-insights.service";
import { WorkspaceUserListsController } from "./workspace-user-lists.controller";
import { WorkspaceUserListsService } from "./workspace-user-lists.service";
import { DbWorkspaceUserLists } from "./entities/workspace-user-list.entity";

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => InsightsModule),
    forwardRef(() => TimescaleModule),
    forwardRef(() => UserListModule),
    ApiServicesModule,
    TypeOrmModule.forFeature(
      [
        DbUser,
        DbWorkspace,
        DbWorkspaceMember,
        DbWorkspaceOrg,
        DbWorkspaceRepo,
        DbWorkspaceInsight,
        DbWorkspaceContributor,
        DbWorkspaceUserLists,
        DbUserList,
      ],
      "ApiConnection"
    ),
  ],
  controllers: [
    WorkspaceController,
    WorkspaceMemberController,
    WorkspaceOrgController,
    WorkspaceStatsController,
    WorkspaceRepoController,
    WorkspaceContributorController,
    WorkspaceInsightsController,
    WorkspaceUserListsController,
  ],
  providers: [
    WorkspaceService,
    WorkspaceMembersService,
    WorkspaceOrgsService,
    WorkspaceStatsService,
    WorkspaceReposService,
    WorkspaceContributorsService,
    WorkspaceInsightsService,
    WorkspaceUserListsService,
  ],
  exports: [
    WorkspaceService,
    WorkspaceMembersService,
    WorkspaceOrgsService,
    WorkspaceReposService,
    WorkspaceStatsService,
    WorkspaceContributorsService,
    WorkspaceInsightsService,
    WorkspaceUserListsService,
  ],
})
export class WorkspaceModule {}
