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

@Module({
  imports: [
    UserModule,
    ApiServicesModule,
    TypeOrmModule.forFeature(
      [DbWorkspace, DbWorkspaceMember, DbWorkspaceOrg, DbWorkspaceRepo, DbWorkspaceInsight],
      "ApiConnection"
    ),
  ],
  controllers: [WorkspaceController, WorkspaceMemberController],
  providers: [WorkspaceService, WorkspaceMembersService],
  exports: [WorkspaceService, WorkspaceMembersService],
})
export class WorkspaceModule {}
