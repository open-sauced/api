import { Injectable } from "@nestjs/common";

import { OpenAiService } from "../open-ai/open-ai.service";
import { GeneratePullRequestDescriptionDto } from "./dtos/create-pull-request-description.dto";

@Injectable()
export class PullRequestDescriptionService {
  constructor(private openAiService: OpenAiService) {}

  private generatePrompt(language: string, maxLength: number, tone: string) {
    return [
      `Generate an apt github PR description written in present tense and ${tone} tone for the given code diff/commit-messages with the specifications mentioned below`,
      `Description language: ${language}`,
      `Description must be a maximum of ${maxLength} characters.`,
      "Exclude anything unnecessary such as translation. Your entire response will be passed directly into a pull request description",
    ].join("\n");
  }

  async generateDescription(options: GeneratePullRequestDescriptionDto) {
    const content = `${options.diff ? `Diff: ${options.diff}\n` : ""}${
      options.commitMessages ? `\nCommit Messages: ${options.commitMessages.join(",")}` : ""
    }`;

    try {
      const completion = this.openAiService.generateCompletion(
        this.generatePrompt(options.language, options.descriptionLength, options.tone),
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
