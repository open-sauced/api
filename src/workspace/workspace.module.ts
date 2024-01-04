import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserModule } from "../user/user.module";
import { ApiServicesModule } from "../common/services/api-services.module";
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

@Module({
  imports: [
    UserModule,
    ApiServicesModule,
    TypeOrmModule.forFeature(
      [DbWorkspace, DbWorkspaceMember, DbWorkspaceOrg, DbWorkspaceRepo, DbWorkspaceInsight],
      "ApiConnection"
    ),
  ],
  controllers: [WorkspaceController, WorkspaceMemberController, WorkspaceOrgController, WorkspaceRepoController],
  providers: [WorkspaceService, WorkspaceMembersService, WorkspaceOrgsService, WorkspaceReposService],
  exports: [WorkspaceService, WorkspaceMembersService, WorkspaceOrgsService, WorkspaceReposService],
})
export class WorkspaceModule {}
