import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

import { ApiPaginatedResponse } from "../common/decorators/api-paginated-response.decorator";
import { DbWorkspace } from "../workspace/entities/workspace.entity";
import { WorkspaceService } from "../workspace/workspace.service";
import { SupabaseGuard } from "../auth/supabase.guard";
import { UserId } from "../auth/supabase.user.decorator";
import { UserService } from "./services/user.service";

@Controller("user/personal-workspace")
@ApiTags("User personal workspace service")
export class UserPersonalWorkspaceController {
  constructor(private userService: UserService, private workspaceService: WorkspaceService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOperation({
    operationId: "findPersonalWorkspaceByUsername",
    summary: "Gets the personal workspace for the given authenticated user",
  })
  @ApiPaginatedResponse(DbWorkspace)
  @ApiOkResponse({ type: DbWorkspace })
  @ApiNotFoundResponse({ description: "Personal workspace not found" })
  async findPersonalWorkspaceByUsername(@UserId() userId: number): Promise<DbWorkspace> {
    const user = await this.userService.findOneById(userId);

    return this.workspaceService.findOneById(user.personal_workspace_id);
  }
}
