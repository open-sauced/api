import { BadRequestException, Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiBearerAuth, ApiBadRequestResponse, ApiBody, ApiTags } from "@nestjs/swagger";

import { SupabaseGuard } from "../auth/supabase.guard";
import { GeneratePullRequestDescriptionDto } from "./dtos/create-pull-request-description.dto";
import { PullRequestDescriptionService } from "./pull-request-description.service";

@Controller("prs")
@ApiTags("Pull Requests service")
export class PullRequestDescriptionController {
  constructor(private pullRequestDescriptionService: PullRequestDescriptionService) {}

  @Post("/description/generate")
  @ApiOperation({
    operationId: "generatePRDescription",
    summary: "Generates a PR description based on the provided information",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiBody({ type: GeneratePullRequestDescriptionDto })
  async generatePRDescription(@Body() generatePullRequestDescriptionDto: GeneratePullRequestDescriptionDto) {
    const description = await this.pullRequestDescriptionService.generateDescription(generatePullRequestDescriptionDto);

    if (!description) {
      throw new BadRequestException();
    }

    return { description };
  }
}
