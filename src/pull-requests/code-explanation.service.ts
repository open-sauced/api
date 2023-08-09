import { Injectable } from "@nestjs/common";

import { OpenAiService } from "../open-ai/open-ai.service";
import { GenerateCodeExplanationDto } from "./dtos/create-code-explanation.dto";

@Injectable()
export class CodeExplanationService {
  constructor(private openAiService: OpenAiService) {}

  private generatePrompt(language: string, maxLength: number) {
    return [
      `Generate an explanation for the given code snippet written in ${language} with the specifications mentioned below`,
      `The explanation must be a maximum of ${maxLength} characters.`,
    ].join("\n");
  }

  async generateExplanation(options: GenerateCodeExplanationDto) {
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
