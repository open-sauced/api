import { Injectable } from "@nestjs/common";

import { OpenAiService } from "../open-ai/open-ai.service";
import { GenerateCodeTestSuggestionDto } from "./dtos/create-code-test-suggestion.dto";

@Injectable()
export class CodeTestSuggestionService {
  constructor(private openAiService: OpenAiService) {}

  private generatePrompt(maxLength: number) {
    return [
      `Generate a test for a given code snippet with the specifications mentioned below`,
      `The code snippet must be a maximum of ${maxLength} characters.`,
      'Exclude anything unnecessary such as translation and instructions. The code snippet you suggest should start with "```suggestion" and end with ``` to create a valid GitHub suggestion codeblock. All non-code text or description should be outside of the codeblock.',
    ].join("\n");
  }

  async generateTestSuggestion(options: GenerateCodeTestSuggestionDto) {
    const content = `Code: ${options.code}\n`;

    try {
      const completion = this.openAiService.generateCompletion(
        this.generatePrompt(options.descriptionLength),
        content,
        options.temperature
      );

      return completion;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("OpenAI error: ", error.message);
      }
    }
  }
}
