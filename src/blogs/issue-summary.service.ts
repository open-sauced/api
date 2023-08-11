import { Injectable } from "@nestjs/common";

import { OpenAiService } from "../open-ai/open-ai.service";
import { CreateBlogSummaryDto } from "./dtos/create-blog-summary.dto";

@Injectable()
export class BlogSummaryService {
  constructor(private openAiService: OpenAiService) {}

  private generatePrompt(language: string, maxLength: number, tone: string) {
    return [
      `Generate a blog summary for a blog with the specifications mentioned below`,
      `The summary should be written in ${tone} tone`,
      `Summary language: ${language}`,
      `Summary must be a maximum of ${maxLength} characters.`,
      "Exclude anything unnecessary such as translation. Your entire response will be used to summarize and analyze the blog.",
    ].join("\n");
  }

  async generateBlogSummary(options: CreateBlogSummaryDto) {
    const content = `Blog Title: ${options.blogTitle}\n\nBlog Content: ${options.blogMarkdown}`;

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
