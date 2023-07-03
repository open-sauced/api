import { BadRequestException, Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiBearerAuth, ApiBadRequestResponse, ApiBody, ApiTags } from "@nestjs/swagger";

import { SupabaseGuard } from "../auth/supabase.guard";
import { GenerateCodeTestSuggestionDto } from "./dtos/create-code-test-suggestion.dto";
import { CodeTestSuggestionService } from "./code-test-suggestion.service";

@Controller("prs")
@ApiTags("Pull Requests service")
export class CodeTestSuggestionController {
  constructor(private codeTestSuggestionService: CodeTestSuggestionService) {}

  @Post("/test/generate")
  @ApiOperation({
    operationId: "generateCodeTest",
    summary: "Generates a test for the provided code",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiBody({ type: GenerateCodeTestSuggestionDto })
  async generatePRDescription(@Body() generateCodeTestSuggestionDto: GenerateCodeTestSuggestionDto) {
    const suggestion = await this.codeTestSuggestionService.generateTestSuggestion(generateCodeTestSuggestionDto);

    if (!suggestion) {
      throw new BadRequestException();
    }

    return { suggestion };
  }
}
