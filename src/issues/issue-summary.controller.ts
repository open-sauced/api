import { BadRequestException, Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiBearerAuth, ApiBadRequestResponse, ApiBody, ApiTags } from "@nestjs/swagger";

import { SupabaseGuard } from "../auth/supabase.guard";
import { CreateIssueSummaryDto } from "./dtos/create-issue-summary.dto";
import { IssueSummaryService } from "./issue-summary.service";

@Controller("issues")
@ApiTags("Issue summary service")
export class IssueSummaryController {
  constructor(private readonly issueSummaryService: IssueSummaryService) {}

  @Post("/summary/generate")
  @ApiOperation({
    operationId: "generateIssueSummary",
    summary: "Generate a summary for an issue",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiBody({ type: CreateIssueSummaryDto })
  async generateIssueSummary(@Body() generateIssueSummaryDto: CreateIssueSummaryDto) {
    const summary = await this.issueSummaryService.generateIssueSummary(generateIssueSummaryDto);

    if (!summary) {
      throw new BadRequestException();
    }

    return { summary };
  }
}
