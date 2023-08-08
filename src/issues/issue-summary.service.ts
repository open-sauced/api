import { Injectable } from "@nestjs/common";

import { OpenAiService } from "../open-ai/open-ai.service";
import { CreateIssueSummaryDto } from "./dtos/create-issue-summary.dto";

@Injectable()
export class IssueSummaryService {
  constructor(private openAiService: OpenAiService) {}

  private generatePrompt(language: string, maxLength: number, tone: string) {
    return [
      `Generate an apt issue summary for an issue taken from github issues with the specifications mentioned below`,
      `The summary should be written in past tense and ${tone} tone`,
      `Summary language: ${language}`,
      `Summary must be a maximum of ${maxLength} characters.`,
      "If the issue or its comments include a solution, include it in the summary.",
      "Exclude anything unnecessary such as translation. Your entire response will be used to summarize and analyze the issue.",
    ].join("\n");
  }

  async generateIssueSummary(options: CreateIssueSummaryDto) {
    const content = `Issue Title: ${options.issueTitle}\nIssue Description: ${options.issueDescription}\nIssue Comments: ${options.issueComments}`;

    try {
      const completion = this.openAiService.generateCompletion(
        this.generatePrompt(options.language, options.summaryLength, options.tone),
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
