import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { SupabaseGuard } from "../auth/supabase.guard";
import { UserId } from "../auth/supabase.user.decorator";
import { ApiPaginatedResponse } from "../common/decorators/api-paginated-response.decorator";

import { PageOptionsDto } from "../common/dtos/page-options.dto";
import { EndorsementService } from "../endorsement/endorsement.service";
import { DbEndorsement } from "../endorsement/entities/endorsement.entity";

@Controller("user/endorsements")
@ApiTags("Endorsements service")
export class UserEndorsementController {
  constructor(private readonly endorsementService: EndorsementService) {}

  @Get("/created")
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOperation({
    operationId: "findAllUserCreatedEndorsements",
    summary: "Finds all endorsements created by the authenticated user and paginates them",
  })
  @ApiPaginatedResponse(DbEndorsement)
  @ApiOkResponse({ type: DbEndorsement })
  async findAllUserCreatedEndorsements(@UserId() userId: number, @Query() pageOptionsDto: PageOptionsDto) {
    return this.endorsementService.findAllByCreatorUserId(userId, pageOptionsDto);
  }

  @Get("/received")
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOperation({
    operationId: "findAllUserReceivedEndorsements",
    summary: "Finds all endorsements received by the authenticated user and paginates them",
  })
  @ApiPaginatedResponse(DbEndorsement)
  @ApiOkResponse({ type: DbEndorsement })
  async findAllUserReceivedEndorsements(@UserId() userId: number, @Query() pageOptionsDto: PageOptionsDto) {
    return this.endorsementService.findAllByRecipientUserId(userId, pageOptionsDto);
  }
}
