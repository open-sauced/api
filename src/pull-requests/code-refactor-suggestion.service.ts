import { Injectable } from "@nestjs/common";

import { OpenAiService } from "../open-ai/open-ai.service";
import { GenerateCodeRefactorSuggestionDto } from "./dtos/create-code-refactor-suggestion.dto";

@Injectable()
export class CodeRefactorSuggestionService {
  constructor(private openAiService: OpenAiService) {}

  private generatePrompt(language: string, maxLength: number) {
    return [
      `Generate a code refactor suggestion for a given code snippet written in ${language} with the specifications mentioned below`,
      `The code snippet must be a maximum of ${maxLength} characters.`,
      'Exclude anything unnecessary such as translation and instructions. The code snippet you suggest should start with "```suggestion" and end with ``` to create a valid GitHub suggestion codeblock. All non-code text or description should be outside of the codeblock.',
    ].join("\n");
  }

  async generateDescription(options: GenerateCodeRefactorSuggestionDto) {
    const content = `Code: ${options.code}\n`;

    try {
      const completion = await this.openAiService.generateCompletion(
        this.generatePrompt(options.language, options.descriptionLength),
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
