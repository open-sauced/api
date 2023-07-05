import { BadRequestException, Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiBearerAuth, ApiBadRequestResponse, ApiBody, ApiTags } from "@nestjs/swagger";

import { SupabaseGuard } from "../auth/supabase.guard";
import { GenerateCodeRefactorSuggestionDto } from "./dtos/create-code-refactor-suggestion.dto";
import { CodeRefactorSuggestionService } from "./code-refactor-suggestion.service";

@Controller("prs")
@ApiTags("Pull Requests service")
export class CodeRefactorSuggestionController {
  constructor(private codeRefactorSuggestionService: CodeRefactorSuggestionService) {}

  @Post("/suggestion/generate")
  @ApiOperation({
    operationId: "generateCodeRefactor",
    summary: "Generates a refactor suggestion based on the provided code",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiBody({ type: GenerateCodeRefactorSuggestionDto })
  async generatePRDescription(@Body() generateCodeRefactorSuggestionDto: GenerateCodeRefactorSuggestionDto) {
    const suggestion = await this.codeRefactorSuggestionService.generateDescription(generateCodeRefactorSuggestionDto);

    if (!suggestion) {
      throw new BadRequestException();
    }

    return { suggestion };
  }
}
