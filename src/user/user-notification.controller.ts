import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

import { PageOptionsDto } from "../common/dtos/page-options.dto";
import { PageDto } from "../common/dtos/page.dto";
import { DbUserNotification } from "./entities/user-notification.entity";
import { UserNotificationService } from "./user-notifcation.service";
import { UserId } from "../auth/supabase.user.decorator";
import { SupabaseGuard } from "../auth/supabase.guard";

@Controller("user/notifications")
@ApiTags("User service")
export class UserNotificationController {
  constructor (
    private userNotificationService: UserNotificationService,
  ) {}

  @Get("/")
  @ApiOperation({
    operationId: "getUserNotifications",
    summary: "Retrieves notifications for the authenticated user",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOkResponse({ type: DbUserNotification })
  @ApiNotFoundResponse({ description: "Unable to get user notifications" })
  async getUserNotifications (
    @UserId() userId: number,
      @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<DbUserNotification>> {
    return this.userNotificationService.findAllByUserId(userId, pageOptionsDto);
  }
}
