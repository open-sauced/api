import { BadRequestException, Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiBearerAuth, ApiBadRequestResponse, ApiBody, ApiTags } from "@nestjs/swagger";

import { SupabaseGuard } from "../auth/supabase.guard";
import { GenerateCodeExplanationDto } from "./dtos/create-code-explanation.dto";
import { CodeExplanationService } from "./code-explanation.service";

@Controller("prs")
@ApiTags("Pull Requests service")
export class CodeExplanationController {
  constructor(private codeExplanationService: CodeExplanationService) {}

  @Post("/explanation/generate")
  @ApiOperation({
    operationId: "generateCodeExplanation",
    summary: "Generates an explanation for the provided code",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiBody({ type: GenerateCodeExplanationDto })
  async generatePRDescription(@Body() generateCodeExplanationDto: GenerateCodeExplanationDto) {
    const suggestion = await this.codeExplanationService.generateExplanation(generateCodeExplanationDto);

    if (!suggestion) {
      throw new BadRequestException();
    }

    return { suggestion };
  }
}
